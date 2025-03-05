import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { User } from '../../../models/user.model';
import { Country } from '../../../models/country.model';
import { AuthService } from '../../../services/auth.service';
import { CountryService } from '../../../services/country.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-profile-edit-dialog',
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
    MatDialogModule,
  ],
  templateUrl: './profile-edit.component.html',
  styleUrl: './proflie-edit.component.scss',
})
export class ProfileEditDialogComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  editForm: FormGroup;
  user: User;
  countries: Country[] = [];
  filteredCountries: Observable<Country[]>;
  avatarPreview: string | undefined = undefined;

  constructor(
    private fb: FormBuilder,
    private countryService: CountryService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    this.user = this.authService.getCurrentUser() as User;
    this.avatarPreview = this.user.avatar;

    this.editForm = this.fb.group({
      username: [this.user.username, Validators.required],
      birthdate: [this.user.birthdate, Validators.required],
      country: [this.user.country, Validators.required],
      website: [this.user.website],
      avatar: [this.user.avatar],
    });

    this.filteredCountries = this.editForm.get('country')!.valueChanges.pipe(
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

  onAvatarSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // In a real app, we would upload this file to a server
      // For this demo, we'll just create a data URL
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result as string;
        this.editForm.patchValue({ avatar: this.avatarPreview });
      };
      reader.readAsDataURL(file);
    }
  }

  onSave(): void {
    if (this.editForm.valid) {
      const updatedUser: Partial<User> = {
        ...this.editForm.value,
        avatar: this.avatarPreview,
      };

      this.authService
        .updateUserProfile(updatedUser)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.dialog.closeAll();
        });
    }
  }

  private _filterCountries(value: string): Country[] {
    const filterValue = value.toLowerCase();
    return this.countries.filter((country) =>
      country.name.toLowerCase().includes(filterValue)
    );
  }
}
