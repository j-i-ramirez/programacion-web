import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validators, ReactiveFormsModule, FormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogActions } from '@angular/material/dialog';
import { MatDialogTitle } from '@angular/material/dialog';
import { MatDialogContent } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { ProjectService } from '../../services/projects/projects.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-create-project',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogActions,
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
  ],
  templateUrl: './modal-create-project.component.html',
  styleUrls: ['./modal-create-project.component.scss']
})
export class ModalCreateProjectComponent implements OnInit {
  formCreateProject!: FormGroup;
  administrador_idList: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly _formBuilder: FormBuilder,
    private readonly _projectService: ProjectService,
    private readonly dialogRef: MatDialogRef<ModalCreateProjectComponent>,
    private readonly _snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.createFormProject();
    this.getAllAdministrator();
  }

  getAllAdministrator() {
    this._projectService.getAllAdministrator().subscribe({
      next: (res) => {
        this.administrador_idList = (res.users || res.data || res).filter((user: any) => user.rol_id === 1);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  createFormProject(): void {
    this.formCreateProject = this._formBuilder.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      administrador_id: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.formCreateProject.invalid) {
      Swal.fire('Error', 'Por favor completa todos los campos', 'error');
      return;
    }

    const projectDataInformation = {
      nombre: this.formCreateProject.get('nombre')?.value,
      descripcion: this.formCreateProject.get('descripcion')?.value,
      administrador_id: this.formCreateProject.get('administrador_id')?.value
    };

    this._projectService.createProject(projectDataInformation).subscribe({
      next: (response) => {
        const admin = this.administrador_idList.find(admin => admin.id === projectDataInformation.administrador_id);
        if (admin) {
          response.message = `Proyecto creado exitosamente para ${admin.nombre}`;
        } else {
          response.message = 'Proyecto creado exitosamente';
        }
        console.log('Datos enviados:', projectDataInformation);
        this._snackBar.open(response.message, 'Cerrar', { duration: 5000 });
        this.formCreateProject.reset();
        this.dialogRef.close(true);
      },
      error: (error) => {
        const errorMessage = error.error?.result || 'Ocurrio un error inesperado. Por favor, intenta nuevamente.';
        this._snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
      }
    });
  }

  validateDates() {
    const fechaInicio = new Date(this.formCreateProject.get('fecha_inicio')?.value);
    const fechaFin = new Date(this.formCreateProject.get('fecha_fin')?.value);

    if (fechaInicio && fechaFin && fechaInicio > fechaFin) {
      this.formCreateProject.get('fecha_fin')?.setErrors({ invalidDateRange: true });
    } else {
      const currentErrors = this.formCreateProject.get('fecha_fin')?.errors;
      if (currentErrors) {
        delete currentErrors['invalidDateRange'];
        this.formCreateProject.get('fecha_fin')?.setErrors(
          Object.keys(currentErrors).length ? currentErrors : null
        );
      }
    }
  }
}
