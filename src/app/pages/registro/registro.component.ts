import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { registroAnimation } from './registro.animation';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
  animations: [registroAnimation]
})
export class RegistroComponent {
  formularioRegistro: FormGroup;

  constructor(private form: FormBuilder) {
    this.formularioRegistro = this.form.group({
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {

  }

  enviar() {
    console.log(this.formularioRegistro);
  }

  hasErrors(controlName: string, errorType: string) {
    return this.formularioRegistro.get(controlName)?.hasError(errorType) && this.formularioRegistro.get(controlName)?.touched;
  }
}
