import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  SimpleChanges,
  ViewChild,
  input,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { User } from '../../models/user.model';
import { UserItemComponent } from '../user-item/user-item.component';
import {
  ScrollingModule,
  CdkVirtualScrollViewport,
} from '@angular/cdk/scrolling';

@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  imports: [UserItemComponent, ScrollingModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnChanges {
  users = input.required<User[]>();
  title = input.required<string>();

  @ViewChild('scrollViewport') scrollViewport!: CdkVirtualScrollViewport;
  viewportHeight = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['users'].currentValue) {
      const visibleItems = changes['users'].currentValue.length ?? 0;
      const USER_ITEM_HEIGHT = 60;
      const USER_ITEM_HEIGHT_MOBILE = 236;
      const MOBILE_WIDTH_THRESHOLD = 600;
      const CONTAINER_PADDING = 12;
      const itemHeight =
        window.innerWidth > MOBILE_WIDTH_THRESHOLD
          ? USER_ITEM_HEIGHT
          : USER_ITEM_HEIGHT_MOBILE;
      this.viewportHeight = Math.min(
        window.innerHeight,
        visibleItems * itemHeight + CONTAINER_PADDING * 2,
      );
    }
  }
}
