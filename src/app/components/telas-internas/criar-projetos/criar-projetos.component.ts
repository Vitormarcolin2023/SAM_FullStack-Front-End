import { Component } from '@angular/core';
import { Projeto } from '../../../models/projeto/projeto';
import { ProjetoService } from '../../../services/projeto/projeto.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-criar-projetos',
  imports: [FormsModule],
  templateUrl: './criar-projetos.component.html',
  styleUrl: './criar-projetos.component.scss'
})
export class CriarProjetosComponent {
  projeto: Projeto = new Projeto();

  constructor(private projetoService: ProjetoService, private router: Router) {}

  salvar() {
    this.projetoService.save(this.projeto).subscribe({
      next: () => {
        alert('Projeto salvo com sucesso!');
        this.router.navigate(['/visual-projeto']);
      },
       error: erro => {
        console.error('Erro ao salvar projeto:', erro);
        alert('Erro ao salvar projeto!');
      }
    });
  }
}
