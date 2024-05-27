import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ComunidadesService } from '../../services/comunidades.service';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { User } from '../../models/user.interface';
import { CommonModule } from '@angular/common';
import { Comunidad } from '../../models/comunidad.interface';
import { UsuarioService } from '../../services/usuarios.service';
import { NavegacionService } from '../../services/navegacion.service';

@Component({
  selector: 'app-comunidad-crear',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './comunidad-crear.component.html',
  styleUrl: './comunidad-crear.component.css'
})
export class ComunidadCrearComponent {

  // Servicio de comunidades
  private _comunidadService = inject(ComunidadesService);

  // Servicio de usuarios
  private _usuarioService = inject(UsuarioService);

  // Servicio de navegacion
  private _navegacionService = inject(NavegacionService);

  // Servicio ruta parametros
  private route = inject(ActivatedRoute);

  // Activar modo edicion de comunidad
  modoEditar: boolean = false;

  // Usuario iniciado
  usuarioIniciado!: User;

  // Formulario Registro
  formularioComunidad: FormGroup;

  // Mostrar mensaje de usuario existente
  comunidadExiste: boolean = false;

  // Mostrar mensaje de comunidad creada
  comunidadCreada: boolean = false;

  // Mostrar mensaje de comunidad creada
  comunidadActualizada: boolean = false;

  // Array comunidades
  comunidades: Comunidad[] = [];

  // Comunidad activa
  comunidadActiva?: Comunidad;

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

  constructor(private form: FormBuilder) {

    // Añadir validadores a los campos del formulario
    this.formularioComunidad = this.form.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: [''],
    });

  }

  ngOnInit(): void {


    // Comprobamos si se han pasado parametros, de ver comunidad personalizada
    this.route.params.subscribe(params => {

      // Parametro de id de comunidad activa
      const idComunidad: number = +params['comunidadId'];

      // Si hay parametros de id de comunidad
      // significa que estamos en modo editar comunidad activa
      if (idComunidad) {

        // Activamos la vista de modo editar
        this.modoEditar = true;

        // Obtener comunidad activa de la BD
        this._comunidadService.obtenerComunidad(idComunidad)
        .subscribe({
          next: (comunidad: Comunidad) => {

            // Establecemos la comunidad activa obtenida
            this.comunidadActiva = comunidad;

            console.log('comunidad activa:');
            console.log(this.comunidadActiva);
          },
          error: (error: any) => {
            console.error('Error al obtener comunidad activa:', error);
          }
        });

      } else {

        this.modoEditar = false;

        // Usuario iniciado
        this.usuarioIniciado = this._usuarioService.obtenerUsuarioIniciado() as User;

        // Obtener las comunidades de la BD
        this._comunidadService.obtenerComunidades()
          .subscribe({
            next: (comunidades: Comunidad[]) => {
              this.comunidades = comunidades;
              console.log('Comunidad cargada desde la BD:');
              console.log(this.comunidades)
            },
            error: (error: any) => {
              console.error('Error al obtener comunidades:', error);
            }
          });
      }

    });

  }

  // Comprobar si el usuario existe en la BD
  msjTituloExiste() {
    return this.comunidadExiste;
  }

  // Activar mensaje de comunidad creada
  msjComunidadCreada() {
    return this.comunidadCreada;
  }

  // Activar mensaje de comunidad actualizada
  msjComunidadActualizada() {
    return this.comunidadActualizada;
  }

  // Envio del formulario
  enviar(event: Event) {

    // Evitar que se envie el formulario automáticamente
    event.preventDefault();

    // Si no hay errores de validacion se procede a enviar
    if (this.formularioComunidad.valid) {

      // Obtener los datos del formulario
      const formData = this.formularioComunidad.value;

      // El usuario con los datos del formulario
      const nuevaComunidad: Comunidad = {
        title: formData.nombre,
        description: formData.descripcion,
        image: this.imagenes[this.i],
        creator_email: this.usuarioIniciado.email
      };

      // Se comprueba si se ha encontrado una comunidad con el mismo nombre
      const comunidadEncontrada = this.comunidades?.find(
        comunidad => comunidad.title === nuevaComunidad.title
      );

      // El nombre de la comunidad ya existe en la bd
      if (comunidadEncontrada) {
        console.log('la comunidad ya existe');

        // Activar la condicion de comunidad ya existe
        // (esto activará el mensaje que lo indica)
        this.comunidadExiste = true;

        // Desactivar el mensaje de error después de 5 segundos
        setTimeout(() => {
          this.comunidadExiste = false;
        }, 4000);

        // La comunidad no existe en la bd
      } else {
        console.log('agregar comunidad nueva');

        // Añadir comunidad a la bd
        this._comunidadService.agregarComunidad(nuevaComunidad)
          .subscribe({
            next: (response: any) => {
              console.log('Comunidad agregada correctamente:', response);

              this.comunidadCreada = true;

              // Desactivar el mensaje de éxito después de 5 segundos
              setTimeout(() => {
                this.comunidadCreada = false;
              }, 4000);

              // Vaciar campos del formulario
              this.formularioComunidad.reset();

            },
            error: (error: any) => {
              console.error('Error al agregar comunidad:', error);
            }
        });

      }

    } else {
      console.error('Formulario inválido. Por favor, completa los campos correctamente');
    }
  }

  // Envio del formulario de actualizar
  actualizar() {

    // Si no hay errores de validacion se procede a enviar
    if (this.formularioComunidad.valid) {

      // Obtener los datos del formulario
      const formData = this.formularioComunidad.value;

      // El usuario con los datos del formulario
      const comunidadActualizada: Comunidad = {
        community_id: this.comunidadActiva?.community_id,
        title: formData.nombre,
        description: formData.descripcion,
        image: this.imagenes[this.i],
      };

      // Se comprueba si se ha encontrado una comunidad con el mismo nombre
      const comunidadEncontrada = this.comunidades?.find(
        comunidad => comunidad.title === comunidadActualizada.title
      );

      // El nombre de la comunidad ya existe en la bd
      if (comunidadEncontrada) {
        console.log('la comunidad ya existe');

        // Activar la condicion de comunidad ya existe
        // (esto activará el mensaje que lo indica)
        this.comunidadExiste = true;

        // Desactivar el mensaje de error después de 5 segundos
        setTimeout(() => {
          this.comunidadExiste = false;
        }, 4000);

        // La comunidad no existe en la bd
      } else {
        console.log('agregar comunidad nueva');

        this._comunidadService.actualizarComunidad(comunidadActualizada)
        .subscribe({
          next: (response: any) => {

            console.log('comunidad agregada:');
            console.log(response);

            this.comunidadActualizada = true;

            // Desactivar el mensaje de éxito después de 5 segundos
            setTimeout(() => {
              this.comunidadActualizada = false;
            }, 4000);
          },
          error: (error: any) => {
            console.error('Error al obtener comunidad activa:', error);
          }
        });
      }

    } else {
      console.error('Formulario inválido. Por favor, completa los campos correctamente');
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

  cambiarIndice(indice: number) {
    this.i = indice;
  }

  // Volver hacia atras
  goBack(): void {
    this._navegacionService.goBack();
  }

}
