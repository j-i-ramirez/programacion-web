// Importa los módulos necesarios para realizar pruebas unitarias en Angular.
import { ComponentFixture, TestBed } from '@angular/core/testing';

// Importa el componente que será objeto de prueba.
import { ProjectsComponent } from './projects.component';

// Define el bloque de pruebas para el componente ProjectsComponent.
describe('ProjectsComponent', () => {

  // Variable para almacenar la instancia del componente.
  let component: ProjectsComponent;

  // Variable que facilita la interacción con el componente durante las pruebas.
  let fixture: ComponentFixture<ProjectsComponent>;

  // Se ejecuta antes de cada prueba para configurar el entorno de pruebas.
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Registra el componente para su uso en el entorno de pruebas.
      imports: [ProjectsComponent] 
    })
    .compileComponents(); // Compila los componentes registrados.
    
    // Crea la instancia del componente y lo asocia al entorno de pruebas.
    fixture = TestBed.createComponent(ProjectsComponent);

    // Obtiene la instancia creada del componente.
    component = fixture.componentInstance;

    // Detecta cambios para inicializar el componente y actualizar su vista.
    fixture.detectChanges();
  });

  // Prueba para verificar que el componente se crea sin errores.
  it('should create', () => {
    expect(component).toBeTruthy(); // Verifica que la instancia del componente no sea nula o indefinida.
  });

});
