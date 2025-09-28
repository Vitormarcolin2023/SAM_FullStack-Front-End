import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup,FormsModule,ReactiveFormsModule,Validators } from "@angular/forms";
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
import { ActivatedRoute, Route, Router } from "@angular/router";
import { GrupoService } from "../../../services/grupo/grupo.service";



@Component({
  selector: 'app-criar-projeto',
  templateUrl: './criar-projeto.component.html',
  styleUrl:'./criar-projeto.component.scss',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarTelasInternasComponent, SidebarComponent],
  
})

export class CriarProjetoComponent implements OnInit {
  formProjeto!: FormGroup;
   modoEdicao = false;
  idProjeto: number | null = null;
 
  mentores: any[] = [];
  areasDeAtuacao: any[] = [];
   grupos: any[] = []; 

   constructor(
    private fb: FormBuilder,
    private mentorService: MentorService,
    private areaService: AreaDeAtuacaoService,
    private projetoService: ProjetoService,
    private router: Router,
    private route: ActivatedRoute,
    private grupoService: GrupoService,
    

  
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.carregarDados();

    this.route.params.subscribe(params => {
    const id = params['id'];
    if (id) {
      this.modoEdicao = true;
      this.idProjeto = +id;
      this.carregarProjeto(this.idProjeto);
    }
  });
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
      grupo: [null],
      
});

}
 carregarDados() {
   this.mentorService.listAll().subscribe(data => this.mentores = data);
   this.areaService.findAll().subscribe(data => this.areasDeAtuacao = data);
   
 
 }

    carregarProjeto(id: number) {
      this.projetoService.findById(id).subscribe(projeto => {
        this.formProjeto.patchValue(projeto);
      });
    }

 onSubmit() {
  if (this.formProjeto.valid) {
    const projeto: Projeto = this.formProjeto.value;

    if (this.modoEdicao && this.idProjeto) {
      this.projetoService.update(this.idProjeto, projeto).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Projeto Atualizado!',
            text: 'As informações do projeto foram salvas.',
          });
          this.router.navigate(['/tela-inicial']);
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Erro ao Atualizar',
            text: err.error?.message || 'Erro desconhecido.',
          });
        }
      });
    } else {
      this.projetoService.save(projeto).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Projeto Cadastrado!',
            text: 'O projeto foi salvo com sucesso!',
          });
          this.formProjeto.reset();
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Erro ao Salvar',
            text: err.error?.message || 'Erro desconhecido.',
          });
          console.error(err);
        },
      });
    }

  } else {
    console.warn('❌ Formulário inválido, botão clicado mas não enviado.');
  }
}

  hasError(campo: string, erro: string): boolean {
  const controle = this.formProjeto.get(campo);
  if (!controle) return false;
  return controle.hasError(erro) && controle.touched;
}

  voltar() {
    this.router.navigate(['/tela-inicial']);
  }
}
