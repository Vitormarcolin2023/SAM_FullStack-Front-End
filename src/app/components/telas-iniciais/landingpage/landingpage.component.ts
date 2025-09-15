import { Component } from '@angular/core';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from "../../design/navbar/navbar.component";

@Component({
  selector: 'app-landingpage',
   standalone: true,
  imports: [MdbCarouselModule, RouterModule, NavbarComponent],
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent {

}
