import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { registroAnimation } from './registro.animation';
import { UsuarioService } from '../../services/usuarios.service';
import { User } from '../../models/user.interface';
import { map } from 'rxjs';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
  animations: [registroAnimation]
})
export class RegistroComponent {
  private usuarioService = inject(UsuarioService);
  formularioRegistro: FormGroup;
  user: User[] = [];


  constructor(private form: FormBuilder,) {
    this.formularioRegistro = this.form.group({
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {

  }

  // Envio del formulario
  enviar() {
    if (this.formularioRegistro.valid) {
      const formData = this.formularioRegistro.value;

      const nuevoUsuario: User = {
        email: formData.email,
        username: formData.nombre,
        password: formData.password
      };

      
      this.usuarioService.obtenerUsuarios()
      .subscribe({
        next: (usuarios: User[]) => {

          const usuarioEncontrado = usuarios.find(usuario => usuario.email === nuevoUsuario.email);

          // El usuario ya existe en la bd
          if (usuarioEncontrado) {
            console.log('el usuario ya existe');
          // El usuario no existe en la bd
          } else {
            console.log('agregar usuario nuevo');
            
            this.usuarioService.agregarUsuario(nuevoUsuario)
            .subscribe({
              next: (response: any) => {
                console.log('Usuario agregado correctamente:', response);
              },
              error: (error: any) => {
                console.error('Error al agregar usuario:', error);
              }
            });

          }
        },
        error: (error: any) => {
          console.error('Error al obtener usuarios:', error);
        }
      });
      

      // this.router.navigate(['/']);

    } else {
      console.error('Formulario inválido. Por favor, complete los campos correctamente.');
    }
  }

  // Comprobacion del tipo de errores de formulario
  hasErrors(controlName: string, errorType: string) {
    return this.formularioRegistro.get(controlName)?.hasError(errorType) && this.formularioRegistro.get(controlName)?.touched;
  }
}

