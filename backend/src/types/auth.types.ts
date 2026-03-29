export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
}