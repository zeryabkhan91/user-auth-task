import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Welcome to TechRise</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <p>Create an account to get started or sign in to your existing account.</p>
        </mat-card-content>
        
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="goToRegistration()">Create Account</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      max-width: 500px;
      margin: 40px auto;
    }
    
    mat-card {
      padding: 20px;
    }
    
    mat-card-title {
      margin-bottom: 20px;
    }
    
    mat-card-content {
      margin-bottom: 20px;
    }
    
    mat-card-actions {
      display: flex;
      justify-content: flex-end;
    }
  `]
})
export class LoginComponent {
  constructor(private router: Router) {}
  
  goToRegistration(): void {
    this.router.navigate(['/register']);
  }
}