import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../models/user.model';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private tempUserData: User | null = null;
  private verificationCode = '123456'; // Verification Code for testing

  constructor() {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    }
  }

  register(userData: User): void {
    // Store user data temporarily until verification
    this.tempUserData = userData;
  }

  verifyCode(code: string): Observable<boolean> {
    // Simulate API call to verify code
    return of(code === this.verificationCode).pipe(
      delay(1000),
      tap(isValid => {
        if (isValid && this.tempUserData) {
          const user = {
            ...this.tempUserData,
            id: this.generateUserId(),
            isVerified: true
          };
          this.setCurrentUser(user);
        }
      })
    );
  }

  resendVerificationCode(): Observable<boolean> {
    // Simulate resending verification code
    this.verificationCode = '654321'; // In a real app, generate a new code
    return of(true).pipe(delay(1000));
  }

  updateUserProfile(userData: Partial<User>): Observable<User> {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser) {
      throw new Error('No authenticated user');
    }

    const updatedUser = { ...currentUser, ...userData };
    this.setCurrentUser(updatedUser);
    return of(updatedUser).pipe(delay(500));
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private setCurrentUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  private generateUserId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}