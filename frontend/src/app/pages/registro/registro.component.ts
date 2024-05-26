import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { registroAnimation } from './registro.animation';
import { UsuarioService } from '../../services/usuarios.service';
import { User } from '../../models/user.interface';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
  animations: [registroAnimation]
})
export class RegistroComponent {
  // Servicio de usuarios
  private usuarioService = inject(UsuarioService);

  // Formulario Registro
  formularioRegistro: FormGroup;

  // Mostrar mensaje de usuario existente
  usuarioExiste: boolean = false;

  // Mostrar mensaje de usuario registrado
  usuarioRegistrado: boolean = false;

  // Comprobacion del patron correcto de email
  emailInvalido: boolean = false;

  constructor(private form: FormBuilder) {
    // Añadir validadores a los campos del formulario
    this.formularioRegistro = this.form.group({
      email: ['', [Validators.required, Validators.email, this.validarEmailExtension]],
      nombre: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(12)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  // Comprobar si el usuario existe en la BD
  msjUsuarioExiste() {
    return this.usuarioExiste;
  }

  msjUsuarioRegistrado() {
    return this.usuarioRegistrado;
  }

  // Envio del formulario
  enviar(event: Event) {

    // Evitar que se envie el formulario automáticamente
    event.preventDefault();

    // Si no hay errores de validacion se procede a enviar
    if (this.formularioRegistro.valid) {

      // Obtener los datos del formulario
      const formData = this.formularioRegistro.value;

      // El usuario con los datos del formulario
      const nuevoUsuario: User = {
        email: formData.email,
        username: formData.nombre,
        password: formData.password
      };

      // Obtener los usuarios de la BD
      this.usuarioService.obtenerUsuarios()
      .subscribe({
        next: (usuarios: User[]) => {

          // Se comprueba si se ha encontrado el usuario del formulario
          const usuarioEncontrado = usuarios.find(usuario => usuario.email === nuevoUsuario.email);

          // El usuario ya existe en la bd
          if (usuarioEncontrado) {
            console.log('el usuario ya existe');

            // Activar la condicion de usuario existe
            // (esto activará el mensaje que lo indica)
            this.usuarioExiste = true;

            // Desactivar el mensaje después de 5 segundos
            setTimeout(() => {
              this.usuarioExiste = false;
            }, 5000);

          // El usuario no existe en la bd
          } else {
            console.log('agregar usuario nuevo');
            
            // Añadir usuario a la bd
            this.usuarioService.agregarUsuario(nuevoUsuario)
            .subscribe({
              next: (response: any) => {
                console.log('Usuario agregado correctamente:', response);

                // Activar la condicion de usuario registrado
                // (esto activará el mensaje que lo indica)
                this.usuarioRegistrado = true;

                // Desactivar el mensaje después de 5 segundos
                setTimeout(() => {
                  this.usuarioRegistrado = false;
                }, 4000);

                // Vaciar campos del formulario
                this.formularioRegistro.reset();
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
    const control = this.formularioRegistro.get(controlName);
    // Comprobamos si nos devuelve el error pasado como parametro,
    // los validadores del formulario devuelven true si el error indicado
    // está presente
    return control?.hasError(errorType) || (controlName === 'email' && this.emailInvalido) && control?.touched;
  }
}

