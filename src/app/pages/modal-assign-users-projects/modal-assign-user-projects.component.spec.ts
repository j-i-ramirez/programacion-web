import { ComponentFixture, TestBed } from '@angular/core/testing'; // Herramientas para configurar y manipular pruebas unitarias

import { ModalAssignUsersProjectsComponent } from './modal-assign-user-projects.component'; // Componente a testear

describe('ModalAssignUsersProjectsComponent', () => {

  let component: ModalAssignUsersProjectsComponent; // Instancia del componente
  let fixture: ComponentFixture<ModalAssignUsersProjectsComponent>; // Entorno de pruebas para acceder al DOM y al componente

  beforeEach(async () => {
    // Configura el módulo de pruebas con los recursos necesarios
    await TestBed.configureTestingModule({
      imports: [ModalAssignUsersProjectsComponent] // Este uso sugiere que el componente es standalone (no necesita declarations)
    }).compileComponents(); // Compila los componentes y plantillas para usarlos en las pruebas

    // Crea una instancia del componente en el entorno de prueba
    fixture = TestBed.createComponent(ModalAssignUsersProjectsComponent);
    component = fixture.componentInstance; // Obtiene la instancia del componente
    fixture.detectChanges(); // Ejecuta la detección de cambios inicial para actualizar el DOM
  });

  it('should create', () => {
    // Verifica que el componente haya sido instanciado correctamente
    expect(component).toBeTruthy();
  });

});
