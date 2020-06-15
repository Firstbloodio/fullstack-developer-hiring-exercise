import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './user.service';


/**
 * Add JWT token to API calls.
 *
 * TODO: Make sure that token is added to calls that go to our backend only.
 */
@Injectable()
export class JwtAuthTokenInterceptor implements HttpInterceptor {

  constructor(private userService: UserService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const token = this.userService.getAuthToken();

    // Not logged in, pass the request unmodified
    if(!token) {
      return next.handle(request);
    }

    // Create a new request with auth header added
    const secureReq = request.clone({
      body: request.body,
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next.handle(secureReq);
  }
}
