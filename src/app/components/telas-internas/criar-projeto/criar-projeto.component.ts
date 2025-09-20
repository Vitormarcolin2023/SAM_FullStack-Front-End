import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup,ReactiveFormsModule,Validators } from "@angular/forms";
import { Projeto } from "../../../models/projeto/projeto";
import { MentorService } from "../../../services/mentores/mentores.service";
import { AreaDeAtuacaoService } from "../../../services/areaDeAtuacao/area-de-atuacao.service";
import { CommonModule } from "@angular/common";
import { Mentor } from "../../../models/mentor/mentor";
import { AreaDeAtuacao } from "../../../models/areadeatuacao/areadeatuacao";
import { ProjetoService } from "../../../services/projeto/projeto.service";
import Swal from "sweetalert2";
import { NavbarTelasInternasComponent } from "../../design/navbar-telas-internas/navbar-telas-internas.component";
import { SidebarComponent } from "../../design/sidebar/sidebar.component";
//IMPORTAR O SERVICE DO GRUPO

@Component({
  selector: 'app-criar-projeto',
  templateUrl: './criar-projeto.component.html',
  styleUrl:'./criar-projeto.component.scss',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarTelasInternasComponent, SidebarComponent],
  
})

export class CriarProjetoComponent implements OnInit {
  formProjeto!: FormGroup;
 
  mentores: any[] = [];
  areasDeAtuacao: any[] = [];
   //grupos: any[] = [];  == GRUPO

   constructor(
    private fb: FormBuilder,
    private mentorService: MentorService,
    private areaService: AreaDeAtuacaoService,
    private projetoService: ProjetoService,
     //private grupoService: GrupoService  ===  GRUPO

  
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.carregarDados();
  }

   initForm() {
    this.formProjeto = this.fb.group({
      nomeDoProjeto: ['', Validators.required],
      descricao: [''],
      periodo: [''],
      dataInicioProjeto: [''],
      dataFinalProjeto: [''],
      areaDeAtuacao: [null, Validators.required],
      mentor: [null],
     // grupo: [null]

});

}
 carregarDados() {
   this.mentorService.listAll().subscribe(data => this.mentores = data);
   this.areaService.findAll().subscribe(data => this.areasDeAtuacao = data);
  //this.grupoService.listAll().subscribe(data => this.grupos = data); 
 
 }

onSubmit() {
  if (this.formProjeto.valid) {
    const projeto: Projeto = this.formProjeto.value;

    this.projetoService.save(projeto).subscribe({
      next: (projetoSalvo) => {
        Swal.fire({
          icon: 'success',
          title: 'Projeto Cadastrado!',
          text: 'O projeto foi salvo com sucesso!',
        });
        this.formProjeto.reset();
      },
      
      error: (err) => {
        const errorMessage =
          err.error?.message ||
          'Não foi possível salvar o projeto. Verifique os dados e tente novamente.';

        Swal.fire({
          icon: 'error',
          title: 'Erro ao Salvar',
          text: errorMessage,
        });

        console.error(err);
      },
    });
  }
}

  hasError(campo: string, erro: string): boolean {
  const controle = this.formProjeto.get(campo);
  if (!controle) return false;
  return controle.hasError(erro) && controle.touched;
}

  voltar() {
    // colocar funcao para voltar
  }
}
