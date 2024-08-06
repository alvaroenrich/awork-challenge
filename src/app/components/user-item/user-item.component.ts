import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnChanges,
  SimpleChanges,
  ViewChild,
  inject,
  input,
} from '@angular/core';
import { User } from '../../models/user.model';
import { DatePipe } from '@angular/common';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-user-item',
  standalone: true,
  templateUrl: './user-item.component.html',
  styleUrl: './user-item.component.scss',
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserItemComponent implements OnChanges {
  user = input.required<User>();
  @ViewChild('userDetails', { read: ElementRef }) detailsRef!: ElementRef;
  private usersService = inject(UsersService);

  /**
   * Get the count of users with same nationality
   */
  get nationalitiesCount(): number {
    if (!this.usersService.users.length) {
      return 0;
    }

    return this.usersService.users.reduce((acc, user) => {
      return user.nat === this.user().nat ? acc + 1 : acc;
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'].previousValue) {
      this.detailsRef.nativeElement.classList.remove('show');
    }
  }

  /**
   * Toggle details of user
   */
  toggleDetails(): void {
    this.detailsRef.nativeElement.classList.toggle('show');
  }
}
