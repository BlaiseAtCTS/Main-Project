import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { userName: '', password: '' };

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http.post('http://localhost:8080/user/login', this.credentials, {
      responseType: 'text'  // 👈 expect plain text token
    })
    .subscribe({
      next: (token) => {
        console.log('✅ Login successful. Token:', token);
        alert('Login successful!');
        localStorage.setItem('authToken', token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('❌ Login failed:', err);
        alert('Invalid credentials or login error.');
      }
    });
  }
}
