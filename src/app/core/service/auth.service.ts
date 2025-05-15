import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import * as jwt from 'jwt-decode';
import { URL_SERVICIOS } from '@core/models/config';
import { ROLES } from '@shared/models/enums';
import { User } from '@core/models/user';

// Define una interfaz para la respuesta del login
interface LoginResponse {
  token: string;
  // Agrega otras propiedades según la respuesta del backend
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private urlBaseServices: string = URL_SERVICIOS;

  private readonly currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private readonly http: HttpClient, private readonly router: Router) {
    // Inicializa el BehaviorSubject con el valor almacenado en sessionStorage o null si no existe
    const storedUser = sessionStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    const accessToken = sessionStorage.getItem('accessToken');
    return accessToken !== null;
  }

  getAuthFromSessionStorage(): any {
    try {
      const lsValue = sessionStorage.getItem('accessToken');
      if (!lsValue) {
        return undefined;
      }
      const decodedToken: any = jwt.jwtDecode(lsValue);
      return decodedToken;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  getRoleInfoByToken(): { roleId: number; roleName: string } | undefined {
    try {
      const decodedToken: any = this.getAuthFromSessionStorage();
      const roleId = decodedToken.rol_id;
      let roleName = '';

      if (roleId === 1) {
        roleName = 'Administrador';
      } else if (roleId === 2) {
        roleName = 'Usuario';
      } else {
        return undefined;
      }

      return { roleId, roleName };
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('currentUser'); // También limpia el usuario almacenado
    this.currentUserSubject.next(null); // Actualiza el BehaviorSubject
    this.router.navigate(['/authentication/signin'], {
      queryParams: {},
    });
  }

  getTokenFromSessionStorage(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  login(email: string, password: string): Observable<LoginResponse> {
    const endpoint = `${this.urlBaseServices}/api/v1/auth/login`;
    return this.http.post<LoginResponse>(endpoint, { email, password });
  }

  setToken(token: string): void {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('accessToken', token); // Asegura consistencia con los métodos
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  isAdminLogged(): boolean {
    const userInfo = this.getAuthFromSessionStorage();
    return userInfo?.rol_id === ROLES.ADMIN;
  }

  isUserLogged(): boolean {
    const userInfo = this.getAuthFromSessionStorage();
    return userInfo?.rol_id === ROLES.USER;
  }
}