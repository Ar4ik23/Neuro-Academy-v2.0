export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface UserDto {
  id: string;
  telegramId: string; // Stored as string to avoid JS BigInt issues
  username?: string;
  firstName: string;
  lastName?: string;
  role: UserRole;
  createdAt: Date;
}

export interface LoginDto {
  initData: string;
}

export interface AuthResponseDto {
  user: UserDto;
  token: string;
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}
