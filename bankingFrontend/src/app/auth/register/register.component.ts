import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = {
    userName: '',
    password: '',
    firstName: '',
    lastName: ''
  };

  constructor(private http: HttpClient) {}

register() {
  this.http.post('http://localhost:8080/user/register', this.user, { observe: 'response' })
    .subscribe({
      next: (res) => {
        if (res.status === 200 || res.status === 201) {
          console.log('✅ User created:', res);
          alert('User created successfully!');
        } else {
          console.warn('Unexpected response:', res);
          alert('User created (backend returned unexpected status).');
        }
      },
      error: (err) => {
        console.error('❌ Registration failed:', err);
        // sometimes backend responds with empty 200 but Angular misreads it
        if (err.status === 200 || err.status === 201) {
          alert('User created successfully! (handled fallback)');
          this.http.post('http://localhost:8080/user/login', this.user).subscribe(); // dummy call to avoid unused error
        } else {
          alert('Registration failed. Check backend.');
        }
      }
    });
}

}
