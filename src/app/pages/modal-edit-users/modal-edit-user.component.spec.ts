// Importa las herramientas necesarias para realizar pruebas unitarias en Angular.
import { ComponentFixture, TestBed } from '@angular/core/testing';

// Importa el componente que se va a someter a pruebas.
import { ModalEditUsersComponent } from './modal-edit-user.component';

// Define el grupo de pruebas para el componente ModalEditUsersComponent.
describe('ModalEditUsersComponent', () => {

  // Declara una variable para almacenar la instancia del componente.
  let component: ModalEditUsersComponent;

  // Declara una variable para manejar el entorno de pruebas del componente.
  let fixture: ComponentFixture<ModalEditUsersComponent>;

  // Se ejecuta antes de cada prueba. Configura el entorno necesario.
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Registra el componente a probar en el entorno de pruebas.
      // Esta configuración es válida solo si el componente es standalone.
      imports: [ModalEditUsersComponent]
    })
    .compileComponents(); // Compila los componentes declarados o importados.
    
    // Crea una instancia del componente y lo asocia al entorno de pruebas.
    fixture = TestBed.createComponent(ModalEditUsersComponent);

    // Obtiene una referencia a la instancia del componente creado.
    component = fixture.componentInstance;

    // Detecta cambios e inicializa el ciclo de vida del componente.
    fixture.detectChanges();
  });

  // Prueba que verifica que el componente se ha creado correctamente.
  it('should create', () => {
    expect(component).toBeTruthy(); // Valida que la instancia del componente existe.
  });

});
