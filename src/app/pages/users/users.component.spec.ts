// Importaciones necesarias para configurar y ejecutar pruebas unitarias en Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';

// Importación del componente que se va a probar
import { UsersComponent } from './users.component';

describe('UsersComponent', () => {  // Bloque principal de pruebas para el componente UsersComponent

  let component: UsersComponent;  // Variable para guardar la instancia del componente
  let fixture: ComponentFixture<UsersComponent>;  // Permite manipular y probar el componente

  // Se ejecuta antes de cada prueba
  beforeEach(async () => {
    // Configura el módulo de pruebas con el componente a testear
    await TestBed.configureTestingModule({
      imports: [UsersComponent]  // Aquí se importa el componente standalone
    })
    .compileComponents();  // Compila el componente y sus dependencias

    fixture = TestBed.createComponent(UsersComponent);  // Crea la instancia del componente
    component = fixture.componentInstance;  // Obtiene la instancia creada
    fixture.detectChanges();  // Aplica la detección de cambios para actualizar la vista
  });

  // Prueba simple para verificar que el componente se crea correctamente
  it('should create', () => {
    expect(component).toBeTruthy();  // Espera que la instancia no sea null ni undefined
  });
});
