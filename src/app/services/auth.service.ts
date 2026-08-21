import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';


// ============================================================
// User
// ============================================================

export interface TmsUser {
  email: string;
  displayName: string;
  role: string;
}


// ============================================================
// Login Request
// ============================================================

export interface LoginRequest {
  email: string;
  password: string;
}


// ============================================================
// Authentication Response
// ============================================================

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}


// ============================================================
// AuthService
// ============================================================

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);


  // ==========================================================
  // JWT Access Token
  //
  // Stored only in memory.
  // It is NOT stored in localStorage/sessionStorage.
  // ==========================================================

  private accessToken = signal<string | null>(null);


  // ==========================================================
  // Current authenticated user
  // ==========================================================

  currentUser = signal<TmsUser | null>(null);


  // ==========================================================
  // Get Access Token
  // Used by the JWT HTTP interceptor.
  // ==========================================================

  getAccessToken(): string | null {
    return this.accessToken();
  }


  // ==========================================================
  // Check Role
  //
  // Admin automatically has access to lower-level role checks.
  // ==========================================================

  hasRole(role: string): boolean {
    const user = this.currentUser();

    return (
      user?.role === role ||
      user?.role === 'Admin'
    );
  }


  // ==========================================================
  // Login
  // ==========================================================

  async login(
    credentials: LoginRequest
  ): Promise<void> {

    const response =
      await firstValueFrom(
        this.http.post<AuthResponse>(
          '/api/auth/login',
          credentials
        )
      );


    // --------------------------------------------------------
    // Store JWT access token in memory
    // --------------------------------------------------------

    this.accessToken.set(
      response.accessToken
    );


    // --------------------------------------------------------
    // Decode JWT payload
    // --------------------------------------------------------

    const payload =
      this.decodeJwtPayload(
        response.accessToken
      );


    // --------------------------------------------------------
    // Extract user information
    // --------------------------------------------------------

    const role =
      this.getRoleFromPayload(payload);

    const email =
      this.getEmailFromPayload(payload);

    const displayName =
      this.getDisplayNameFromPayload(
        payload,
        email
      );


    // --------------------------------------------------------
    // Store current user
    // --------------------------------------------------------

    this.currentUser.set({
      email,
      displayName,
      role
    });
  }


  // ==========================================================
  // Logout
  // ==========================================================

  logout(): void {

    this.accessToken.set(null);

    this.currentUser.set(null);
  }


  // ==========================================================
  // Decode JWT
  // ==========================================================

  private decodeJwtPayload(
    token: string
  ): Record<string, any> {

    try {

      const parts =
        token.split('.');

      if (parts.length !== 3) {
        throw new Error(
          'Invalid JWT format.'
        );
      }


      const base64Url =
        parts[1];

      const base64 =
        base64Url
          .replace(/-/g, '+')
          .replace(/_/g, '/');


      const jsonPayload =
        decodeURIComponent(
          atob(base64)
            .split('')
            .map(
              char =>
                '%' +
                (
                  '00' +
                  char
                    .charCodeAt(0)
                    .toString(16)
                ).slice(-2)
            )
            .join('')
        );


      return JSON.parse(jsonPayload);

    } catch (error) {

      console.error(
        'Unable to decode JWT:',
        error
      );

      throw new Error(
        'Invalid authentication token.'
      );
    }
  }


  // ==========================================================
  // Extract Role
  // ==========================================================

  private getRoleFromPayload(
    payload: Record<string, any>
  ): string {

    const roleClaim =
      'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

    const role =
      payload[roleClaim] ??
      payload['role'] ??
      payload['roles'];


    if (Array.isArray(role)) {
      return role[0] ?? 'Student';
    }


    return role ?? 'Student';
  }


  // ==========================================================
  // Extract Email
  // ==========================================================

  private getEmailFromPayload(
    payload: Record<string, any>
  ): string {

    return (
      payload['email'] ??
      payload[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
      ] ??
      payload['sub'] ??
      ''
    );
  }


  // ==========================================================
  // Extract Display Name
  // ==========================================================

  private getDisplayNameFromPayload(
    payload: Record<string, any>,
    email: string
  ): string {

    return (
      payload['name'] ??
      payload['displayName'] ??
      payload[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
      ] ??
      email ??
      'User'
    );
  }
}