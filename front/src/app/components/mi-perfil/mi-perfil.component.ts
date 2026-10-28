import { Component, OnInit } from '@angular/core';
import { Auth } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent implements OnInit {
  usuario = {
    nombre: 'Cristian',
    apellido: 'Maida',
    username: 'cristian_est_maida',
    descripcion: 'Estudiante de sistemas y programador full-stack.',
    imagenPerfil: ''
  };
  
  constructor(private authService: Auth) {}

  ngOnInit(): void {
    // Aquí puedes llamar a un endpoint de tu backend para obtener los datos del usuario logueado
  }

  actualizarPerfil() {
    console.log('Actualizando datos del usuario...', this.usuario);
    // Mostrar modal de éxito en lugar de alert()
  }
}