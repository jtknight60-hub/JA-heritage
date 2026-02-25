import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  name = '';
  email = '';
  password = '';

  constructor(private router: Router) {}

  register(e: Event) {
    e.preventDefault();
    try {
      const raw = localStorage.getItem('ja_users') || '[]';
      const users = JSON.parse(raw) as any[];
      if (users.find((u) => u.email === this.email)) {
        alert('A user with that email already exists.');
        return;
      }
      users.push({ name: this.name, email: this.email, password: this.password });
      localStorage.setItem('ja_users', JSON.stringify(users));
      alert('Account created. Please sign in.');
      this.router.navigate(['/login']);
    } catch (err) {
      console.error(err);
      alert('Could not create account.');
    }
  }
}
