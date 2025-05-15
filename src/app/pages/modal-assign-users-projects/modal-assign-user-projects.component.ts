import { Component } from '@angular/core'; // Importa el decorador @Component para definir un componente Angular

@Component({
  selector: 'app-modal-assign-users-projects', // Selector HTML que identifica al componente en las plantillas
  standalone: true, // Indica que este componente es independiente y no requiere ser declarado en un NgModule
  imports: [], // Lista de módulos que el componente puede usar; vacío por ahora
  templateUrl: './modal-assign-user-projects.component.html', // Ruta al archivo HTML asociado que define su estructura visual
  styleUrl: './modal-assign-user-projects.component.scss' // Ruta al archivo SCSS que contiene los estilos específicos del componente
})
export class ModalAssignUsersProjectsComponent {
  // Clase del componente; aquí se pueden definir propiedades y métodos para manejar la lógica del modal
}
