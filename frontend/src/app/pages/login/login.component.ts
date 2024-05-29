import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { loginAnimation } from './login.animation';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { User } from '../../models/user.interface';
import { UsuarioService } from '../../services/usuarios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  animations: [loginAnimation]
})
export class LoginComponent {

  // Servicio de usuarios
  private usuarioService = inject(UsuarioService);

  // Formulario de login
  formularioLogin: FormGroup;

  // Mostrar mensaje de usuario incorrecto
  usuarioInvalido: boolean = false;

  // Comprobacion del patron correcto de email
  emailInvalido: boolean = false;

  constructor(private form: FormBuilder, private router: Router) {

    // Añadir validadores a los campos de formulario
    this.formularioLogin = this.form.group({
      email: ['', [Validators.required, Validators.email, this.validarEmailExtension]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  // Comprobar si el usuario existe en la BD
  msjUsuarioInvalido() {
    return this.usuarioInvalido;
  }

  // Envio del formulario
  enviar() {
    if (this.formularioLogin.valid) {
      // Obtener datos de formulario
      const formData = this.formularioLogin.value;

      // El usuario con los datos del formulario
      const nuevoUsuario: User = {
        email: formData.email,
        username: formData.nombre,
        password: formData.password
      };

      // Obtener usuarios de la bd
      this.usuarioService.obtenerUsuarios()
        .subscribe({
          // Array de usuarios obtenido
          next: (usuarios: User[]) => {

            // Buscamos si coincide el email del usuario del formulario
            // con un usuario del array de usuarios
            const usuarioEncontrado = usuarios.find(usuario =>
              usuario.email === nuevoUsuario.email && usuario.password === nuevoUsuario.password);

            // El usuario ya existe en la bd
            if (usuarioEncontrado) {
              console.log('el usuario existe, login valido');
              console.log(usuarioEncontrado);

              // Guardamos el usuario iniciado
              this.usuarioService.agregarUsuarioIniciado(usuarioEncontrado);

              // Redireccionar a la biblioteca
              this.router.navigate(['/biblioteca']);

              // El usuario no existe o es incorrecto
            } else {
              console.log('no existe este usuario');

              // Activar la condicion de usuario existe
              // (esto activará el mensaje que lo indica)
              this.usuarioInvalido = true;

              // Desactivar el mensaje después de 5 segundos
              setTimeout(() => {
                this.usuarioInvalido = false;
              }, 5000);

              // Vaciar campos en el formulario
              this.formularioLogin.reset();

            }
          },
          error: (error: any) => {
            console.error('Error al obtener usuarios:', error);
          }
        });

    } else {
      console.error('Formulario inválido. Por favor, complete los campos correctamente.');
    }
  }

  // Función de validación personalizada para el correo electrónico
  validarEmailExtension(control: AbstractControl): ValidationErrors | null {
    // Obtener el valor del email
    const email: string = control.value;
    // Patrón para que detecta las extensiones de dominio de email
    const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Comprobamos si el email supera el test del patrón
    if (!emailRegex.test(email)) {
      // Si no devuelve verdadero es que no supera el patrón
      // devolveremos el mensaje de error personalizado "emailInvalido"
      // a true, para detectarlo en hasErrors()
      return { emailInvalido: true };
    }
    
    // Si no hay error lo devolvemos vacío
    return null;
  }

  // Comprobacion del tipo de errores de formulario:
  // si además de tener el tipo de error indicado en el formulario, tambien
  // el usuario ha interactuado con el campo del formulario (touched)
  hasErrors(controlName: string, errorType: string) {
    // Obtenmos el tipo de campo que queremos controlar
    const control = this.formularioLogin.get(controlName);
    // Comprobamos si nos devuelve el error pasado como parametro,
    // los validadores del formulario devuelven true si el error indicado
    // está presente
    return control?.hasError(errorType) || (controlName === 'email' && this.usuarioInvalido) && control?.touched;
  }
}
