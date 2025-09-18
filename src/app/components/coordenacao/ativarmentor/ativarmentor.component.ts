import { Component } from '@angular/core';
import { Mentor } from '../../../models/mentor/mentor';
import { MentorService } from '../../../services/mentores/mentores.service';

@Component({
  selector: 'app-ativarmentor',
  imports: [],
  templateUrl: './ativarmentor.component.html',
  styleUrl: './ativarmentor.component.scss'
})
export class AtivarmentorComponent {
mentores: Mentor[] = [];

  constructor(private mentorService: MentorService) { } 
  
  ngOnInit(): void {
    this.listAll();
  }

    listAll(){
    this.mentorService.listAll().subscribe({
      next: (mentores) => {
        this.mentores = mentores;
      },
      error: (erro) => {
        console.log('Ocorreu um erro!');
      }  
    });
  }
}
