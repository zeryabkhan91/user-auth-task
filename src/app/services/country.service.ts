import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Country } from '../models/country.model';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private countries: Country[] = [
    { name: 'United States', code: 'US' },
    { name: 'United Kingdom', code: 'UK' },
    { name: 'Canada', code: 'CA' },
    { name: 'Australia', code: 'AU' },
    { name: 'Germany', code: 'DE' },
    { name: 'France', code: 'FR' },
    { name: 'Japan', code: 'JP' },
    { name: 'China', code: 'CN' },
    { name: 'India', code: 'IN' },
    { name: 'Brazil', code: 'BR' },
    { name: 'Mexico', code: 'MX' },
    { name: 'South Africa', code: 'ZA' },
    { name: 'Russia', code: 'RU' },
    { name: 'Italy', code: 'IT' },
    { name: 'Spain', code: 'ES' }
  ];

  getCountries(): Observable<Country[]> {
    return of(this.countries);
  }

  filterCountries(query: string): Observable<Country[]> {
    const filteredCountries = this.countries.filter(country => 
      country.name.toLowerCase().includes(query.toLowerCase())
    );
    return of(filteredCountries);
  }
}