import { Injectable } from '@angular/core';
import { Observable, Subject, map, tap } from 'rxjs';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { ApiResult } from '../models/api-result.model';

class UsersState {
  users: User[] = [];
  users$: Subject<User[]> = new Subject();
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = 'https://randomuser.me/api';
  private state = new UsersState();

  get users(): User[] {
    return this.state.users;
  }

  get users$(): Observable<User[]> {
    return this.state.users$.asObservable();
  }

  constructor(private httpClient: HttpClient) {}

  /**
   * Fetches 5000 mock users from the api
   * @param {number} page
   * @returns {Observable<void>}
   */
  getUsers(page = 1): Observable<void> {
    return this.httpClient
      .get<ApiResult>(`${this.apiUrl}?results=5000&seed=awork&page=${page}`)
      .pipe(
        map((apiResult) => {
          const users = User.mapFromUserResult(apiResult.results);
          this.state.users = users;
          this.state.users$.next(users);
        }),
      );
  }

  reset(): void {
    this.state = new UsersState();
  }
}
