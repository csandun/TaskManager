
export interface LoginRequest {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
