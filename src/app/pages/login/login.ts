import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  email = '';
  password = '';

  constructor(private router: Router, private auth: AuthService) {}

  login(e: Event) {
    e.preventDefault();
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        // backend may return token and user info
        try {
          if (res && res.token) this.auth.saveToken(res.token);
          const user = res.user || res.userData || (res.email ? { email: res.email, name: res.name } : null);
          if (user) localStorage.setItem('ja_session', JSON.stringify({ email: user.email, name: user.name }));
          this.router.navigate(['/']);
        } catch (err) {
          console.error('Login processing error', err);
          alert('Login succeeded but failed to process response.');
        }
      },
      error: (err) => {
        console.error('Login failed', err);
        alert('Invalid credentials or server error.');
      }
    });
  }
}
