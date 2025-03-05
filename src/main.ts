import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './app/components/header/header.component';
import { appConfig } from './app/app.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ HeaderComponent],
  template: `
    <app-header></app-header>
  `
})
export class App {}

bootstrapApplication(App, appConfig);