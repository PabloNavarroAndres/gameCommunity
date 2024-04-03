import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { loginAnimation } from './login.animation';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../models/user.interface';
import { UsuarioService } from '../../services/usuarios.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  animations: [loginAnimation]
})
export class LoginComponent {

  private usuarioService = inject(UsuarioService);
  formularioLogin: FormGroup;
  user: User[] = [];

  constructor(private form: FormBuilder) {
    this.formularioLogin = this.form.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {

  }

  // Envio del formulario
  enviar() {
    if (this.formularioLogin.valid) {
      const formData = this.formularioLogin.value;

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
    return this.formularioLogin.get(controlName)?.hasError(errorType) && this.formularioLogin.get(controlName)?.touched;
  }
}
