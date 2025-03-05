export interface User {
  id?: string;
  avatar?: string;
  username: string;
  email: string;
  birthdate: Date;
  country: string;
  phone: string;
  website: string;
  isVerified?: boolean;
}