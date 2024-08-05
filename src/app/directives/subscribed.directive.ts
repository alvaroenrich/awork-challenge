import { Directive, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Directive()
export class SubscribedClass implements OnDestroy {
  private destroySubject$: Subject<void> = new Subject();

  get destroy$(): Observable<void> {
    return this.destroySubject$.asObservable();
  }

  ngOnDestroy(): void {
    this.destroySubject$.next();
  }
}
