import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard-design',
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './dashboard-design.component.html',
  styleUrls: ['./dashboard-design.component.scss']
})
export class DashboardDesignComponent {

}
