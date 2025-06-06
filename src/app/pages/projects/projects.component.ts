import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ModalAssignUsersProjectsComponent } from '../modal-assign-users-projects/modal-assign-users-projects.component';
import { ModalCreateProjectComponent } from '../modal-create-project/modal-create-project.component';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ProjectService } from 'app/services/projects/projects.service';
import { BreadcrumbComponent } from "../../shared/components/breadcrumb/breadcrumb.component";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgModule } from '@angular/core'; 


interface Project {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  totalUsers: number;
  admin: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    BreadcrumbComponent,
    MatProgressSpinnerModule,
    MatPaginatorModule,
],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  searchName: string = '';
  selectedProject: Project | null = null;
  isLoading = false;

  
  displayedColumns: string[] = [
    'name',
    'description',
    'createdAt',
    'totalUsers',
    'admin',
    'actions'
  ];
  

  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  
  usersList: any[] = []; 
  adminList: any[] = [];

  breadscrums = [
    {
      title: 'Gestión de proyectos',
      items: [],
      active: 'Datos básicos'
    },
  ];
  
  
  projectFilterForm!: FormGroup;

  trackByFn(index: number, item: any): any {
    return item?.id || index;
  }

  breadcrumsDetails = [
      {
        title: '',
      },
    ];


  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly projectService: ProjectService,
    private readonly dialogModel: MatDialog,
    private readonly _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getAllAdministrators();
    this.getProjectsByUser();
    this.projectFilterForm = this._formBuilder.group({
      name: ['']
    });
    this.projectFilterForm.get('name')?.valueChanges.subscribe(value => {
      this.searchName = value;
      this.filterProjects();
    });
  }
  filterProjects(): void {
    const term = this.searchName.trim().toLowerCase();
    this.filteredProjects = this.projects.filter(project =>
      project.name.toLowerCase().includes(term)
    );
    this.dataSource.data = this.filteredProjects; 
  }
 

  getProjectsByUser(filters?: any): void {
  this.isLoading = true;
  this.projectService.getProjectsByUser(filters).subscribe({
    next: (response) => {
     
      this.projects = (response.projects || []).map((p: any) => {
        const admin = this.adminList.find(a => a.id === p.administrador_id);
        return {
          id: p.id,
          name: p.nombre,
          description: p.descripcion,
          createdAt: p.fecha_creacion,
          totalUsers: p.totalUsers ?? 0,
          admin: admin ? admin.nombre : 'Sin asignar'
        };
      });
      this.filteredProjects = [...this.projects];
      this.dataSource.data = this.filteredProjects;
      this.dataSource.paginator = this.paginator;
      this.isLoading = false;
    },
    error: () => {
      this.isLoading = false;
      this._snackBar.open('Error al cargar los proyectos', 'Cerrar', { duration: 3000 });
    }
  });
}

  getAllAdministrators(): void {
    this.projectService.getAllAdministrator().subscribe({
      next: (res) => {
        this.adminList = res.users || res.data || res; 
      },
      error: (err) => {
        console.error(err);
      }
    });
  }


  openModalCreateProject(): void {
   
    const dialogRef = this.dialogModel.open(ModalCreateProjectComponent, {
      minWidth: '300px',
      maxWidth: '1000px', 
      width: '840px',
      disableClose: true, 
    });
  
  
    dialogRef.afterClosed().subscribe(result => {
   
      if (result) {
        this.getProjectsByUser();
      }
    });
  }

  
  openModalAssignUsers(project: Project): void {
    const dialogRef = this.dialogModel.open(ModalAssignUsersProjectsComponent, {
      minWidth: '300px',
      maxWidth: '1000px',
      width: '840px',
      disableClose: true,
      data: { project } 
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateProject(result); 
      }
    });
  }
  
  viewProjectDetails(project: Project): void {
    this.selectedProject = project;
  }
  
  addProject(project: Project): void {
    this.projects.push(project);
  }

  updateProject(updated: Project): void {
    const idx = this.projects.findIndex(p => p.id === updated.id);
    if (idx > -1) this.projects[idx] = updated;
  }

  deleteProject(id: number): void {
    this.projects = this.projects.filter(p => p.id !== id);
    if (this.selectedProject?.id === id) this.selectedProject = null;
  }
}