import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-info',
  standalone: true,
  template: `
 
    <div class="container mx-auto mt-8 p-4">
      <h1 class="text-3xl font-bold mb-4">Információk</h1>
      <p class="text-lg">GDKGBF Szakdolgozat</p>
    </div>
  `,
})
export class InfoComponent { }
