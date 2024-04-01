import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { loginAnimation } from './login.animation';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  animations: [loginAnimation]
})
export class LoginComponent {

  formularioLogin: FormGroup;

  constructor(private form: FormBuilder) {
    this.formularioLogin = this.form.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {

  }

  enviar() {
    console.log(this.formularioLogin);
  }

  hasErrors(controlName: string, errorType: string) {
    return this.formularioLogin.get(controlName)?.hasError(errorType) && this.formularioLogin.get(controlName)?.touched;
  }
}
