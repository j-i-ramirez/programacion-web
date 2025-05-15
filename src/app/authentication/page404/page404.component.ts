import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-page404',
    templateUrl: './page404.component.html',
    styleUrls: ['./page404.component.scss'],
    imports: [
        FormsModule,
        MatButtonModule, // Importa módulos necesarios para el template
    ]
})
export class Page404Component {
  constructor(
    private _router: Router // Inyecta el Router para navegación
  ) {}
  
  redirectHome() {
    this._router.navigate(['/dashboard/main']); // Método para redirigir al dashboard
  }
}