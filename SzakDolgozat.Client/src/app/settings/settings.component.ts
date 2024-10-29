import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  template: `
    
    <div class="container mx-auto mt-8 p-4">
      <h1 class="text-3xl font-bold mb-4">Beállítások</h1>
      <p class="text-lg">Valami még kerül ide is.</p>
      
    </div>
  `,
})
export class SettingsComponent { }
