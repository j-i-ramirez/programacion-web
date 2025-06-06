import { CommonModule } from '@angular/common'; // Módulo común de Angular.
import { Component } from '@angular/core'; // Decorador para definir un componente.
import { Event, Router, NavigationStart, NavigationEnd, RouterModule } from '@angular/router'; // Módulos para el control de rutas en Angular.

@Component({
  selector: 'app-root', 
  standalone: true, 
  imports: [CommonModule, RouterModule], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'], 
})
export class AppComponent { 

  currentUrl!: string; 

  constructor(public _router: Router) { 
    this._router.events.subscribe((routerEvent: Event) => { 

      if (routerEvent instanceof NavigationStart) {
        this.currentUrl = routerEvent.url.substring(
          routerEvent.url.lastIndexOf('/') + 1 
        );
      }

      if (routerEvent instanceof NavigationEnd) { 
      }

      window.scrollTo(0, 0); 
    });
  }
}

