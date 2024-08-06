import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { UsersService } from './services/users.service';
import { User } from './models/user.model';
import { UserListComponent } from './components/user-list/user-list.component';
import { takeUntil, tap } from 'rxjs';
import { SubscribedClass } from './directives/subscribed.directive';

export type GroupingCategories = 'ALPHABETICALLY' | 'AGE' | 'NATIONALITY';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [UserListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent extends SubscribedClass implements OnInit {
  private usersService = inject(UsersService);
  private cdr = inject(ChangeDetectorRef);

  public loading = true;

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
    this.usersService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.groupUsersData();
      });
  }

  /**
   * Switches the category which users are grouped by
   */
  switchCategory(): void {
    const nextCategoryIdx =
      this.categories.indexOf(this.currentlyAppliedCategory) + 1 >=
      this.categories.length
        ? 0
        : this.categories.indexOf(this.currentlyAppliedCategory) + 1;
    this.currentlyAppliedCategory = this.categories[nextCategoryIdx];
    this.groupUsersData();
  }

  /**
   * Groups user data by category. Uses a web worker.
   */
  private groupUsersData(): void {
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
      users: this.usersService.users,
      category: this.currentlyAppliedCategory,
    });
    this.cdr.markForCheck();
  }
}
