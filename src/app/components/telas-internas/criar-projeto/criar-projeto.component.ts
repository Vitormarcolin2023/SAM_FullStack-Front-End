import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup,FormsModule,ReactiveFormsModule,ValidationErrors,Validators, ValidatorFn, AbstractControl } from "@angular/forms";
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
  imports: [CommonModule, ReactiveFormsModule, NavbarTelasInternasComponent, SidebarComponent ],
  
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
    this.carregarGrupos();

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
      descricao: ['', Validators.required],
      periodo: ['', Validators.required],
      dataInicioProjeto: ['', Validators.required],
      dataFinalProjeto: ['', Validators.required],
      areaDeAtuacao: [null, Validators.required],
      mentor: [null, Validators.required],
      grupo: [null, Validators.required],
      professores: [[], Validators.required]
}, {
     Validators: [this.validarDatasProjeto()]
});
}
 carregarDados() {
   this.mentorService.listAll().subscribe(data => this.mentores = data);
   this.areaService.findAll().subscribe(data => this.areasDeAtuacao = data);
   
 
 }
    carregarGrupos(): void {
  this.grupoService.getGrupos().subscribe({
    next: (res) => {
      this.grupos = res;
    },
    error: (err) => {
      console.error('Erro ao carregar grupos:', err);
    }
  });
}
  
    carregarProjeto(id: number) {
      this.projetoService.findById(id).subscribe(projeto => {
        this.formProjeto.patchValue(projeto);
      });
    }

    validarDatasProjeto(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const inicio = group.get('dataInicioProjeto')?.value;
      const fim = group.get('dataFinalProjeto')?.value;
      if (!inicio || !fim) return null;
      return new Date(inicio) > new Date(fim) ? { dataInvalida: true } : null;
    };
  }


 onSubmit() {
  if (this.formProjeto.valid) {
    const projeto: Projeto = this.formProjeto.value;

    const acao = this.modoEdicao && this.idProjeto
      ? this.projetoService.update(this.idProjeto, projeto)
      : this.projetoService.save(projeto);

    acao.subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: this.modoEdicao ? 'Projeto Atualizado!' : 'Projeto Cadastrado!',
          text: this.modoEdicao
            ? 'As informações do projeto foram salvas.'
            : 'O projeto foi salvo com sucesso!',
        });

        this.modoEdicao ? this.router.navigate(['/tela-inicial']) : this.formProjeto.reset();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: this.modoEdicao ? 'Erro ao Atualizar' : 'Erro ao Salvar',
          text: err.error?.message || 'Erro desconhecido.',
        });
        console.error(err);
      },
    });

  } else {
    this.formProjeto.markAllAsTouched();

    Swal.fire({
      icon: 'warning',
      title: 'Formulário inválido',
      text: 'Por favor, preencha todos os campos obrigatórios corretamente antes de continuar.',
    });

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
