import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ɵɵRouterOutlet } from "@angular/router/testing";
import { SidebarComponent } from "../../design/sidebar/sidebar.component";

@Component({
  selector: 'app-reuniao',
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './reuniao.component.html',
  styleUrl: './reuniao.component.scss'
})
export class ReuniaoComponent {

}
