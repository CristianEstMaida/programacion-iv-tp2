import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: Auth, private router: Router) {
    this.loginForm = this.fb.group({
      identificador: ['', [Validators.required]],
      // Expresión regular: Mínimo 8 caracteres, al menos una mayúscula y un número
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/)]]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          localStorage.setItem('access_token', res.access_token);
          this.router.navigate(['/publicaciones']);
        },
        error: (err) => {
          alert(err.error.message || 'Credenciales incorrectas'); // Recuerda cambiar por un modal si prefieres
        }
      });
    }
  }
}
