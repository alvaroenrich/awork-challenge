import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-paginator',
  standalone: true,
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class PaginatorComponent {
  page = input.required<number>();

  pageChanged = output<number>();

  get prevPageDisabled(): boolean {
    return this.page() <= 1;
  }

  prevPage(): void {
    if (!this.prevPageDisabled) {
      this.pageChanged.emit(this.page() - 1);
    }
  }
  nextPage(): void {
    this.pageChanged.emit(this.page() + 1);
  }
}
