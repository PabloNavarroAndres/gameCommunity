import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ComunidadesService } from '../../services/comunidades.service';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { User } from '../../models/user.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comunidad-crear',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './comunidad-crear.component.html',
  styleUrl: './comunidad-crear.component.css'
})
export class ComunidadCrearComponent {

  // Servicio de comunidades
  private usuarioService = inject(ComunidadesService);

  // Formulario Registro
  formularioComunidad: FormGroup;

  // Mostrar mensaje de usuario existente
  comunidadExiste: boolean = false;

  constructor(private form: FormBuilder) {
    // Añadir validadores a los campos del formulario
    this.formularioComunidad = this.form.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  // Comprobar si el usuario existe en la BD
  msjTituloExiste() {
    return this.comunidadExiste;
  }

  // Envio del formulario
  enviar(event: Event) {

    // Evitar que se envie el formulario automáticamente
    event.preventDefault();

    // Si no hay errores de validacion se procede a enviar
    if (this.formularioComunidad.valid) {
      console.log('es valido');

      // Obtener los datos del formulario
      const formData = this.formularioComunidad.value;

      // El usuario con los datos del formulario
      const nuevoUsuario: User = {
        email: formData.email,
        username: formData.nombre,
        password: formData.password
      };

      // Obtener los usuarios de la BD
      /* this.usuarioService.obtenerUsuarios()
      .subscribe({
        next: (usuarios: User[]) => {

          // Se comprueba si se ha encontrado el usuario del formulario
          const usuarioEncontrado = usuarios.find(usuario => usuario.email === nuevoUsuario.email);

          // El usuario ya existe en la bd
          if (usuarioEncontrado) {
            console.log('el usuario ya existe');

            // Activar la condicion de usuario existe
            // (esto activará el mensaje que lo indica)
            this.comunidadExiste = true;

            // Desactivar el mensaje después de 5 segundos
            setTimeout(() => {
              this.comunidadExiste = false;
            }, 5000);

          // El usuario no existe en la bd
          } else {
            console.log('agregar usuario nuevo');
            
            // Añadir usuario a la bd
            this.usuarioService.agregarUsuario(nuevoUsuario)
            .subscribe({
              next: (response: any) => {
                console.log('Usuario agregado correctamente:', response);

                // Vaciar campos del formulario
                this.formularioComunidad.reset();
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
      }); */

    } else {
      console.error('Formulario inválido. Por favor, complete los campos correctamente.');
    }
  }

  // Comprobar error del campo de nombre
  hasErrors(controlName: string, errorType: string) {
    // Obtenmos el tipo de campo que queremos controlar
    const control = this.formularioComunidad.get(controlName);
    // Comprobamos si nos devuelve el error pasado como parametro,
    // los validadores del formulario devuelven true si el error indicado
    // está presente
    return control?.hasError(errorType) && control?.touched;
  }

  // Imagenes de la carpeta
  imagenes = [
    '../../../assets/community_pers_1.jpeg',
    '../../../assets/community_pers_2.jpg',
    '../../../assets/community_pers_3.png',
    '../../../assets/community_pers_4.webp',
    '../../../assets/community_pers_5.jpeg',
    '../../../assets/community_pers_6.jpeg',
    '../../../assets/community_pers_7.jpeg',
  ];

  // Indice de la posicion de imagen en el array "imagenes"
  i = 0;

  // Propiedad calculada para obtener la imagen seleccionada
  get selectedImage(): string {
    return this.imagenes[this.i];
  }

  // Calcular la posicion anterior de la imagen del carrusel en el array
  anteriorImg() {
    if (this.i === 0) {
      this.i = this.imagenes.length - 1;

    } else {
      this.i--;
    }
  }

  // Calcular la posicion siguiente de la imagen del carrusel en el array
  siguienteImg() {
    if (this.i === this.imagenes.length - 1) {
      this.i = 0;

    } else {
      this.i++;
    }
  }


}
