import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], // 👈 Necesario para formularios reactivos y enlaces
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  registerForm: FormGroup;
  selectedFile: File | null = null;
  mostrarModal: boolean = false;
  mostrarModalError: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/)]],
      // repetirPassword: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      descripcion: [''],
      // perfil: ['usuario', Validators.required]
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      const formData = new FormData();
      
      // Agrega todos los campos del formulario reactivo
      Object.keys(this.registerForm.controls).forEach(key => {
        formData.append(key, this.registerForm.get(key)?.value);
      });

      // Agrega la imagen si fue seleccionada
      if (this.selectedFile) {
        formData.append('imagenPerfil', this.selectedFile);
      }

      this.authService.register(formData).subscribe({
        next: (res) => {
          // Éxito: Activamos el modal de éxito en lugar de alert()
          this.ngZone.run(() => {
            this.mostrarModal = true;
            this.cdr.detectChanges();
          });
        },
        error: (err) => {
          console.error(err);
          // Error: Capturamos el mensaje del backend y mostramos el modal de error
          this.ngZone.run(() => {
            this.errorMessage = err.error?.message || 'Error al registrar usuario';
            this.mostrarModalError = true;
            this.cdr.detectChanges();
          });
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  irAlLogin() {
    this.mostrarModal = false;
    this.router.navigate(['/login']);
  }

  cerrarModalError() {
    this.mostrarModalError = false;
  }
}