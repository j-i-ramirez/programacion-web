import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import Swal from 'sweetalert2';

// Define una interfaz para la respuesta del login
interface LoginResponse {
  token: string;
  // Agrega otras propiedades si las hay
}

interface LoginError {
  error?: {
    message?: string;
  };
  // Agrega otros campos de error si los esperas
}

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss'],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
    ]
})
export class SigninComponent implements OnInit {
  authForm!: UntypedFormGroup;
  submitted = false;
  loading = false;
  returnUrl!: string;
  error = '';
  hide = true;

  email = '';
  password = '';

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService,
  ) { }

  ngOnInit() {
    this.authForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  get f() {
    return this.authForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';
  
    if (this.authForm.invalid) {
      Swal.fire('Error', 'Usuario y contraseña no válidos.', 'error');
      return;
    }
  
    this.authService
      .login(this.authForm.get('username')?.value, this.authForm.get('password')?.value)
      .subscribe({
        next: (res: LoginResponse) => {
          if (res?.token) {
            // Guardar el token
            sessionStorage.setItem('accessToken', res.token);

            // Mostrar en consola para depuración
            console.log('Token recibido:', res.token);

            // Actualizar el usuario en AuthService
            this.authService.setToken(res.token);

            Swal.fire({
              title: 'Inicio de sesión exitoso',
              text: 'Redirigiendo al dashboard...',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false,
            }).then(() => {
              this.router.navigate(['/dashboard/main']);
            });
          } else {
            Swal.fire('Error', 'Credenciales incorrectas.', 'error');
          }
        },
        error: (error: LoginError) => {
          this.submitted = false;
          this.loading = false;
          Swal.fire('Error en el inicio de sesión', error.error?.message || 'Error desconocido', 'error');
        },
      });
  }
}