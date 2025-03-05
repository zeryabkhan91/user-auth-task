import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { Country } from '../../models/country.model';
import { AuthService } from '../../services/auth.service';
import { CountryService } from '../../services/country.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  registrationForm: FormGroup;
  countries: Country[] = [];
  filteredCountries: Observable<Country[]>;
  avatarPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private countryService: CountryService,
    private router: Router
  ) {
    this.registrationForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthdate: ['', Validators.required],
      country: ['', Validators.required],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^\+?[0-9\s\-\(\)]+$/)],
      ],
      website: [''],
      avatar: [null],
    });

    this.filteredCountries = this.registrationForm
      .get('country')!
      .valueChanges.pipe(
        startWith(''),
        map((value) => this._filterCountries(value || ''))
      );
  }

  ngOnInit(): void {
    this.countryService
      .getCountries()
      .pipe(takeUntil(this.destroy$))
      .subscribe((countries) => {
        this.countries = countries;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onAvatarSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // In a real app, we would upload this file to a server
      // For this demo, we'll just create a data URL
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result as string;
        this.registrationForm.patchValue({ avatar: this.avatarPreview });
      };
      reader.readAsDataURL(file);
    }
  }

  public onSubmit(): void {
    if (this.registrationForm.valid) {
      const userData: User = {
        ...this.registrationForm.value,
        avatar: this.avatarPreview,
      };

      this.authService.register(userData);
      this.router.navigate(['/verify']);
    }
  }

  private _filterCountries(value: string): Country[] {
    const filterValue = value.toLowerCase();
    return this.countries.filter((country) =>
      country.name.toLowerCase().includes(filterValue)
    );
  }
}
