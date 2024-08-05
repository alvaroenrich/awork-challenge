import {
  Component,
  ElementRef,
  OnChanges,
  SimpleChanges,
  ViewChild,
  input,
} from '@angular/core';
import { User } from '../../models/user.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-item',
  standalone: true,
  templateUrl: './user-item.component.html',
  styleUrl: './user-item.component.scss',
  imports: [DatePipe],
})
export class UserItemComponent implements OnChanges {
  user = input.required<User>();
  allUsers = input.required<User[]>();
  @ViewChild('userDetails', { read: ElementRef }) detailsRef!: ElementRef;

  /**
   * Get the count of users with same nationality
   */
  get nationalitiesCount(): number {
    if (!this.allUsers().length) {
      return 0;
    }

    return this.allUsers().reduce((acc, user) => {
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
