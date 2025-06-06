//este archivo es el componente modal para crear un nuevo usuario en la aplicacion, contiene el formulario y la logica para enviar los datos al servidor
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { UsersService } from 'app/services/users/users.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { invalid } from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-create-user',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatSelectModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, ReactiveFormsModule
  ],
  templateUrl: './modal-create-user.component.html',
  styleUrls: ['./modal-create-user.component.scss']
})

// ModalCreateUserComponent es una clase que representa el componente de creación de usuarios
export class ModalCreateUserComponent implements OnInit {
  formCreateUser!: FormGroup;
  administratorsValue: any[] = [];
  showFieldAdministrator: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly _formBuilder: FormBuilder,
    private readonly _userService: UsersService,
    private readonly _dialogRef: MatDialogRef<ModalCreateUserComponent>,
    private readonly _snackBar: MatSnackBar,
  )
  {
    // Inicializa el formulario de creación de usuario
    this.createFormUsers();
    this.formCreateUser.controls['confirmPassword'].valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe((value) => {
      this.validatePassword(value);
    });
  }

  // ngOnInit es un método del ciclo de vida de Angular que se ejecuta después de que el componente ha sido inicializado
  ngOnInit(): void {
    this.getAllAdministrator();
  }

  // createFormUsers es un método que crea el formulario de creación de usuario
  createFormUsers() {
    this.formCreateUser = this._formBuilder.group({
      nombre: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      rol_id: ['', Validators.required],
      administrador_id: [undefined, Validators.required]
    });
  }

  // getAllAdministrator es un método que obtiene todos los administradores del sistema
  getAllAdministrator() {
    this._userService.getAllAdministrator().subscribe({
      next: (res) => {
        this.administratorsValue = res.users;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  // onChangeRole es un método que se ejecuta cuando se cambia el rol del usuario
  onChangeRole(event: any) {
    if (event.value === '1') {
      this.hideAdministratorField();
    } else {
      this.showAdministratorField();
    }
  }

  // onSubmit es un método que se ejecuta cuando se envía el formulario de creación de usuario
  onSubmit() {
    if (this.formCreateUser.invalid) {
      Swal.fire('Error', 'Por favor completa todos los campos', 'error');
      return;
    }
    
    // Validar la contraseña
    this.validatePassword(this.formCreateUser.get('password')?.value);
    const userDataInformation = {
      nombre: this.formCreateUser.get('nombre')?.value,
      email: this.formCreateUser.get('email')?.value,
      password: this.formCreateUser.get('password')?.value,
      rol_id: Number(this.formCreateUser.get('rol_id')?.value),
      administrador_id: this.formCreateUser.get('administrador_id')?.value
    };
    
    // Enviar la información del usuario al servicio
    this._userService.createUser(userDataInformation).subscribe({
      next: (response) => {
        this._snackBar.open(response.message, 'Cerrar', { duration: 5000 });
        this.formCreateUser.reset();
        this._dialogRef.close(true);
      },
      error: (error) => {
        const errorMessage = error.error?.result || 'Ocurrió un error inesperado. Por favor, intenta nuevamente.';
        this._snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
      }
    });
  }
  
  //validatePassword es un método que valida si la contraseña y la confirmación de contraseña son iguales
  private validatePassword(confirmPassword: string) {
    const password = this.formCreateUser.get('password')?.value;
    if (password !== confirmPassword) {
      this.formCreateUser.get('confirmPassword')?.setErrors({ invalid: true });
    } else {
      this.formCreateUser.get('confirmPassword')?.setErrors(null);
    }
  }

  //showAdministratorField y hideAdministratorField son métodos que muestran u ocultan el campo de administrador en el formulario
  // dependiendo del rol seleccionado en el formulario
  private showAdministratorField() {
    this.showFieldAdministrator = true;
    this.formCreateUser.get('administrador_id')?.setValidators([Validators.required]);
    this.formCreateUser.get('administrador_id')?.updateValueAndValidity();
  }
  
  private hideAdministratorField() {
    this.showFieldAdministrator = false;
    this.formCreateUser.get('administrador_id')?.clearValidators();
    this.formCreateUser.get('administrador_id')?.setValue(undefined);
  }
  
}

