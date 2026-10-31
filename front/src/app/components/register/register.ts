import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Auth } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
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
  maxDate: string = new Date().toISOString().split('T')[0];

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef // <-- Inyectamos esto para forzar que el modal se dibuje al primer clic
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      apellido: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      password: ['', [
        Validators.required, 
        Validators.maxLength(64), 
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/)
      ]],
      repetirPassword: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      descripcion: [''],
      perfil: ['usuario', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const repetirPassword = control.get('repetirPassword')?.value;
    return password === repetirPassword ? null : { mismatch: true };
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
      
      Object.keys(this.registerForm.controls).forEach(key => {
        const value = this.registerForm.get(key)?.value;
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      if (this.selectedFile) {
        formData.append('imagenPerfil', this.selectedFile);
      }

      this.authService.register(formData).subscribe({
        next: (res) => {
          // Forzamos la actualización inmediata de la vista al tener éxito
          this.mostrarModal = true;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error en registro:', err);
          // Forzamos la actualización inmediata de la vista al recibir el 409 u otro error
          this.errorMessage = err.error?.message || err.error || 'El correo o usuario ya se encuentran registrados.';
          this.mostrarModalError = true;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  irAlLogin() {
    this.mostrarModal = false;
    this.cdr.detectChanges();
    this.router.navigate(['/login']);
  }

  cerrarModalError() {
    this.mostrarModalError = false;
    this.cdr.detectChanges();
  }
}