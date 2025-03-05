import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, Subscription, interval } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './verification.component.html',
  styleUrl: './verification.component.scss',
})
export class VerificationComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  verificationForm: FormGroup;
  timerSubscription: Subscription | null = null;
  timeLeft = 120; // 2 minutes in seconds
  minutes = 2;
  seconds = 0;
  timerExpired = false;
  isVerifying = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.verificationForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
  }

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  private startTimer(): void {
    this.timerExpired = false;
    this.timeLeft = 120;
    this.updateTimerDisplay();

    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    this.timerSubscription = interval(1000)
      .pipe(take(this.timeLeft))
      .subscribe(() => {
        this.timeLeft--;
        this.updateTimerDisplay();

        if (this.timeLeft <= 0) {
          this.timerExpired = true;
          if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
          }
        }
      });
  }

  private updateTimerDisplay(): void {
    this.minutes = Math.floor(this.timeLeft / 60);
    this.seconds = this.timeLeft % 60;
  }

  public resendCode(): void {
    this.authService
      .resendVerificationCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.startTimer();
        this.errorMessage = '';
      });
  }

  public onSubmit(): void {
    if (this.verificationForm.valid) {
      this.isVerifying = true;
      this.errorMessage = '';

      this.authService
        .verifyCode(this.verificationForm.value.code)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (isValid) => {
            this.isVerifying = false;
            if (isValid) {
              this.router.navigate(['/profile']);
            } else {
              this.errorMessage =
                'Invalid verification code. Please try again.';
            }
          },
          (error) => {
            this.isVerifying = false;
            this.errorMessage = 'An error occurred. Please try again.';
            console.error(error);
          }
        );
    }
  }
}
