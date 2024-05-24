import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs'; 

@Component({
  selector: 'app-panel-administrador',
  standalone: true,
  imports: [MatTabsModule],
  templateUrl: './panel-administrador.component.html',
  styleUrl: './panel-administrador.component.css'
})
export class PanelAdministradorComponent {

}
