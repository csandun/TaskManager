import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest, User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly API_URL = `${environment.apiBaseUrl}/Users`;

    private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
    private currentUserSubject = new BehaviorSubject<any>(this.getCurrentUser());

    public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    login(credentials: LoginRequest): Observable<User> {
        const basicAuthHeader = this.createBasicAuthHeader(credentials.username, credentials.password);

        const headers = {
            'Authorization': `Basic ${basicAuthHeader}`,
            'Content-Type': 'application/json'
        };

        return this.http.post<User>(`${this.API_URL}/login`, credentials, { headers })
            .pipe(
                tap(response => {
                    this.setSession(response, basicAuthHeader);
                    this.isAuthenticatedSubject.next(true);
                    this.currentUserSubject.next(response);
                })
            );
    }

    private setSession(authResponse: User, headerToken: string): void {
        localStorage.setItem('authUser', JSON.stringify(authResponse));
        localStorage.setItem('token', headerToken);
    }


    public getToken() {
        return localStorage.getItem('token');
    }

    public getCurrentUser(){
        const user = localStorage.getItem('authUser');
        return user ? JSON.parse(user) : null;
    }

    public isAuthenticated() {
        return this.hasValidToken();
    }

    private hasValidToken(){
        const token = this.getToken();
        return !!token; 
    }

    private createBasicAuthHeader(username: string, password: string){
        const credentials = `${username}:${password}`;
        const encodedCredentials = btoa(credentials);
        return `${encodedCredentials}`;
    }

    public getBasicAuthHeader(){
        const user = this.getCurrentUser();
        if (user && user.username && user.password) {
            return this.createBasicAuthHeader(user.username, user.password);
        }

        return null;
    }

    public getBasicAuthHeaderByToken(){
        const token = this.getToken();
        if (token) {
            return `Basic ${token}`;
        }

        return null;
    }

}
