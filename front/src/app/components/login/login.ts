import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FadeInDirective } from '../../directives/fade-in.directive';

@Component({
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FadeInDirective],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login implements OnInit {
  loginForm: FormGroup;
  errorMessage = signal('');
  sesionExpirada = false;

  constructor(private fb: FormBuilder, private authService: Auth, private router: Router, private route: ActivatedRoute) {
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

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['expirada'] === 'true') {
        this.sesionExpirada = true;
        setTimeout(() => {
          this.sesionExpirada = false;
        }, 4000); // Desaparece a los 4 segundos
      }
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
          localStorage.setItem('rol', res.usuario.perfil);

          // 2. Calcular y guardar el tiempo de expiración (extraído del payload del JWT)
          const tokenData = JSON.parse(atob(res.access_token.split('.')[1]));
          const expirationTime = tokenData.exp * 1000; // Convertir a milisegundos
          localStorage.setItem('token_expiration', expirationTime.toString());

          // Uso window.location.href en lugar de router.navigate para forzar 
          // la recarga limpia y que el App Component inicie el temporizador al instante.
          window.location.href = '/publicaciones';
        },
        error: (err) => {
          console.log('Entró al bloque de error:', err);
          // Toma el mensaje exacto del backend; si es un array (por ValidationPipe), toma el primero
          const mensajeBackend = Array.isArray(err.error?.message)
            ? err.error.message[0]
            : err.error?.message;

          this.errorMessage.set(mensajeBackend || 'Credenciales incorrectas');
        }
      });
    }
  }
}
