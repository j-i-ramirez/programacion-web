// Importaciones necesarias para módulos Angular, Material y servicios usados
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UsersService } from 'app/services/users/users.service';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ModalCreateUserComponent } from 'app/pages/modal-create-user/modal-create-user.component';
import { ModalEditUsersComponent } from 'app/pages/modal-edit-users/modal-edit-user.component';

// Interfaz para definir estructura básica de usuario (puede ampliarse)
export interface User {
  name: string;
}

@Component({
  selector: 'app-users',
  standalone: true, // Indica que es componente standalone (sin NgModule)
  imports: [
    CommonModule,
    BreadcrumbComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatInputModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss' // Ojo que debería ser stylesUrls con 's' y array
})
export class UsersComponent {

  // Columnas que se mostrarán en la tabla
  displayedColumns: string[] = [
    'name',
    'email',
    'role',
    'action'
  ];

  // Breadcrumbs para navegación
  breadscrums = [
    {
      title: 'Gestión de usuarios',
      item: [],
      active: 'Datos básicos',
    },
  ];

  breadscrumsDetails = [
    { 
      title: '',
    },
  ];

  // Fuente de datos para la tabla, inicialmente vacía
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator; // Paginador para la tabla

  // Formulario reactivo para búsqueda y filtro de usuarios
  userFormSearchFilter!: FormGroup;
  usersList: any[] = [];

  isLoading = false; // Indicador para mostrar spinner de carga

  // Objeto que mantiene los filtros actuales de búsqueda
  userDefaultFilterSearch: any = {
    name: undefined,
    email: undefined,
  }

  constructor(
    private readonly _formBuilder: FormBuilder,       // Para crear formularios reactivos
    private readonly userService: UsersService,        // Servicio para operaciones con usuarios
    private readonly dialogModel: MatDialog,            // Para abrir modales de Angular Material
    private readonly _sanckBar: MatSnackBar              // Para mostrar mensajes tipo snackbar
  ) { }
  
  ngOnInit(): void {
    this.createUserFormSearchFilter(); // Inicializa el formulario de búsqueda
    this.getAllUserByAdministrator();  // Carga los usuarios inicialmente
    this.handleUserFilterChance('name', 'email'); // Escucha cambios en filtros y actualiza
    this.handleUserFilterChance('name', 'email'); // (Parece repetido, se podría eliminar una línea)
  }

  // Método para crear el formulario reactivo de búsqueda
  createUserFormSearchFilter() {
    this.userFormSearchFilter = this._formBuilder.group({
      name: [''],
      email: ['']
    });
  }

  // Convierte el rol numérico en un texto legible
  getRoleName(rol_id: number): string {
    switch (rol_id) {
      case 1:
        return 'Administrador';
      case 2:
        return 'Usuarios';
      default:
        return 'Desconocido';
    }
  }

  // Escucha los cambios en el formulario para los filtros y hace la petición con debounce y filtro de valores repetidos
  handleUserFilterChance(controlName: string, filterKey: string) {
    this.userFormSearchFilter.controls[controlName].valueChanges.pipe(
      debounceTime(500),          // Espera 500ms para evitar peticiones continuas
      distinctUntilChanged()      // Sólo emite si el valor cambia realmente
    ).subscribe((value: any) => {
      this.userDefaultFilterSearch[filterKey] = value;
      console.log(this.userDefaultFilterSearch);
      this.getAllUserByAdministrator({ ...this.userDefaultFilterSearch, [filterKey]: value }); // Actualiza listado con filtros
    });
  }

  // Llama al servicio para obtener usuarios y actualiza la tabla y lista
  getAllUserByAdministrator(filters?: any): void {
    this.isLoading = true;
    this.userService.getAllUserByAdministrator(filters).subscribe({
      next: (response) => {
        this.usersList = response.users;
        this.dataSource.data = response.users;
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      }
    });
  }

  // Abre el modal para crear un nuevo usuario
  openModalCreateUser(): void {
    const dialogRef = this.dialogModel.open(ModalCreateUserComponent, {
      minWidth: '300px',
      maxWidth: '1000px',
      width: '820px',
      disableClose: true,
    });

    // Cuando se cierra el modal, si hay resultado se refresca la lista
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllUserByAdministrator();
      }
    })
  }

  // Abre el modal para editar un usuario, pasando la información del usuario seleccionado
  openModalUpdateUsers(userIformation: any): void {
    const dialogRef = this.dialogModel.open(ModalEditUsersComponent, {
      minWidth: '300px',
      maxWidth: '1000px',
      width: '820px',
      disableClose: true,
      data: {user: userIformation}
    });

    // Cuando se cierra el modal, si hay resultado se refresca la lista
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllUserByAdministrator();
      }
    }) 
  }

  // Método para eliminar un usuario por su ID
  deleteUser(userId: number): void {
    this.userService.deleteUser(userId).subscribe({
      next: (response) => {
        this._sanckBar.open(response.message, 'Cerrar', { duration: 5000 });
        this.getAllUserByAdministrator();  // Refresca lista tras eliminar
      },
      error: (error) => {
        const errorMessage = error.error?.message || 'Error al eliminar el usuario';
        this._sanckBar.open(errorMessage, 'Cerrar', { duration: 5000 });
      }
    });
  }

}
