import { Component } from '@angular/core';
import { SidebarComponent } from "../../../design/sidebar/sidebar.component";
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-aprovar-mentor',
  imports: [SidebarComponent, RouterModule],
  templateUrl: './aprovar-mentor.component.html',
  styleUrl: './aprovar-mentor.component.scss'
})
export class AprovarMentorComponent {

}
