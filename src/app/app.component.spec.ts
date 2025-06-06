import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

// Importación del componente principal de la aplicación.
import { AppComponent } from './app.component';

describe('AppComponent', () => { 
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({ 
      imports: [RouterTestingModule], 
      declarations: [AppComponent] 
    }).compileComponents(); 
  }));

  // Prueba para verificar que el componente de la aplicación se crea correctamente.
  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance; 
    expect(app).toBeTruthy(); 
  });

  // Prueba para verificar que la propiedad "title" del componente tiene el valor esperado.
  it(`should have as title 'angulardark'`, () => {
    const fixture = TestBed.createComponent(AppComponent); 
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('angulardark'); 
  });

  // Prueba para verificar que el título se renderiza en una etiqueta <h1>.
  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(AppComponent); 
    fixture.detectChanges(); 
    const compiled = fixture.debugElement.nativeElement; 
    expect(compiled.querySelector('h1').textContent).toContain(
      'Welcome to angulardark!'
    );
  });

});

