import { Component } from '@angular/core';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landingpage',
   standalone: true,
  imports: [MdbCarouselModule, RouterModule],
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent {

}
