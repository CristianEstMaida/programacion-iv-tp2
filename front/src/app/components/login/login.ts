import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
loginForm: FormGroup;
errorMessage = signal('');

  constructor(private fb: FormBuilder, private authService: Auth, private router: Router) {
    this.loginForm = this.fb.group({
      identificador: ['', [Validators.required]],
      // Expresión regular: Mínimo 8 caracteres, al menos una mayúscula y un número
      password: ['', [
        Validators.required,
        Validators.maxLength(64),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/)
      ]]
    });
  }

  // Método para rellenar rápido para pruebas
  cargarDatosPrueba(tipo: 'usuario' | 'admin') {
    if (tipo === 'usuario') {
      this.loginForm.patchValue({
        identificador: 'usuario_test@pulsenet.com',
        password: 'Password123'
      });
    } else {
      this.loginForm.patchValue({
        identificador: 'admin_test@pulsenet.com',
        password: 'Password123'
      });
    }
  }

  onLogin() {
    this.errorMessage.set('');
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          localStorage.setItem('access_token', res.access_token);
          this.router.navigate(['/publicaciones']);
        },
        error: (err) => {
          console.log('👉 Entró al bloque de error:', err);
          this.errorMessage.set('Credenciales incorrectas');
          // alert(err.error.message || 'Credenciales incorrectas'); // Recuerda cambiar por un modal si prefieres
        }
      });
    }
  }
}
