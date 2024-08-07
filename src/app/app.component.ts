import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { take, takeUntil } from 'rxjs';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { SubscribedClass } from './directives/subscribed.directive';
import { User } from './models/user.model';
import { UsersService } from './services/users.service';

export type GroupingCategories = 'ALPHABETICALLY' | 'AGE' | 'NATIONALITY';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    UserListComponent,
    FormsModule,
    ReactiveFormsModule,
    PaginatorComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent extends SubscribedClass implements OnInit {
  private usersService = inject(UsersService);
  private cdr = inject(ChangeDetectorRef);

  loading = true;
  form = new FormGroup({
    searchFilter: new FormControl('', [
      Validators.minLength(3),
      Validators.required,
    ]),
  });
  currentPage = 1;

  groupedUsers: Record<string, User[]> = {};

  currentlyAppliedCategory: GroupingCategories = 'ALPHABETICALLY';

  private categories: GroupingCategories[] = [
    'ALPHABETICALLY',
    'AGE',
    'NATIONALITY',
  ];

  get displayedCategories(): string[] {
    return Object.keys(this.groupedUsers);
  }

  ngOnInit(): void {
    this.usersService.reset();
    this.usersService.users$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.groupUsersData(this.usersService.users);
    });
    this.callApi();
  }

  /**
   * Filters list of user
   */
  filter(): void {
    const filterValue = this.form.value?.searchFilter;
    if (filterValue) {
      this.groupUsersData(
        this.usersService.users.filter((u) =>
          u.firstname?.toLowerCase()?.startsWith(filterValue.toLowerCase()),
        ),
      );
    }
  }

  /**
   * Switches the category which users are grouped by
   */
  switchCategory(): void {
    this.form.reset();
    const nextCategoryIdx =
      this.categories.indexOf(this.currentlyAppliedCategory) + 1 >=
      this.categories.length
        ? 0
        : this.categories.indexOf(this.currentlyAppliedCategory) + 1;
    this.currentlyAppliedCategory = this.categories[nextCategoryIdx];
    this.groupUsersData(this.usersService.users);
  }

  /**
   * Updates page number. Calls API with new Page number.
   */
  updatePage(newPage: number): void {
    this.currentPage = newPage;
    this.callApi();
  }

  /**
   * Groups user data by category. Uses a web worker.
   */
  private groupUsersData(users: User[]): void {
    this.loading = true;
    const worker = new Worker(
      new URL('./web-workers/users.worker', import.meta.url),
    );
    worker.addEventListener('message', ({ data }) => {
      this.groupedUsers = data;
      this.loading = false;
      this.cdr.markForCheck();
    });
    worker.postMessage({
      users: users,
      category: this.currentlyAppliedCategory,
    });
    this.cdr.markForCheck();
  }

  private callApi(): void {
    this.loading = true;
    this.usersService
      .getUsers(this.currentPage)
      .pipe(take(1))
      .subscribe(() => {});
  }
}
