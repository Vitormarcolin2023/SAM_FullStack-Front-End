# SAM - Sistema de Acompanhamento de Mentorias (Front-end)

## 📌 Proposta do Projeto

O **SAM - Sistema de Acompanhamento de Mentorias** é uma solução web desenvolvida como parte de um Projeto Integrador de Extensão do **Centro Universitário União das Américas Descomplica - UniAmérica**.

Esta aplicação representa a camada de **Front-end** (Interface do Usuário) da evolução do sistema SAM. Enquanto a versão anterior focava em desktop, esta nova etapa visa tornar o acesso universal e distribuído, conectando-se a uma API RESTful. O objetivo permanece sendo facilitar a gestão, validação e certificação de mentores voluntários e suas interações com os alunos.

## 👥 Quem Desenvolveu o Projeto

Este projeto foi realizado por acadêmicos dos cursos de Engenharia de Software e Análise e Desenvolvimento de Sistemas:

* Cecília de Moura Cezar Quaresma
* Josiane Cristina Marins Steiernagel
* Samara Achterberg da Silva
* Vitor Hugo Marcolin

## ❗ Problema Apresentado

A gestão descentralizada das mentorias de projetos de extensão dificulta a rastreabilidade e a formalização das atividades. A necessidade de uma interface acessível via navegador tornou-se crucial para permitir que mentores e alunos acessem o sistema de qualquer lugar, não limitando-se a instalações locais, garantindo agilidade no cadastro e na validação das horas complementares.

## 💡 Como Foi Resolvido (Arquitetura Front-end)

Para solucionar o problema de acessibilidade e interface, foi desenvolvida uma **Single Page Application (SPA)** moderna e responsiva. A aplicação consome a API do Back-end (Spring Boot) e gerencia a experiência do usuário utilizando:

* **Angular 19:** Framework principal para componentização e reatividade.
* **MDB (Material Design Bootstrap):** Kit de bibliotecas gráficas para layout responsivo e profissional.
* **Integração via Services:** Comunicação assíncrona com o Back-end.

## 🛠️ Tecnologias e Funcionalidades

O desenvolvimento focou em boas práticas de componentização e segurança no lado do cliente:

* **Data Binding Avançado:** Uso intenso de Interpolação, Property Binding, Event Binding e Two-Way Data Binding para sincronia em tempo real.
* **Comunicação entre Componentes:** Uso de Modais para envio e retorno de objetos (Input/Output).
* **Segurança e Rotas:**
* Implementação de **Guards (CanActivate)** para proteção de rotas.
* Controle de visualização de templates baseado em **Roles** (permissões de acesso).
* Gerenciamento de Token JWT para autenticação.

## 🚀 Instalação e Execução

Para rodar este projeto localmente:

1. Clone o repositório:
```bash
git clone https://github.com/Vitormarcolin2023/SAM_FullStack-Front-End.git

```

2. Instale as dependências:
```bash
npm install

```

3. Execute o servidor de desenvolvimento:
```bash
ng serve

```

4. Acesse `http://localhost:4200/` no seu navegador.

## 👨‍🏫 Orientadores do Projeto

**Willian Bogler da Silva**
- Mestre em Tecnologia Ambiental e docente do curso de Engenharia de Software.

**Edrian Silva**
- Especialista em Gestão em Modelos Educacionais Inovadores e docente do curso de Engenharia de Software.

## 👨‍🏫 Mentor do Projeto

**Wellington de Oliveira**
- Mestre em Tecnologias Computacionais e docente do curso de Engenharia de Software.

## ✅ Conclusões

A implementação do Front-end em **Angular 19** elevou o nível do projeto SAM, proporcionando uma interface amigável, rápida e segura. A separação entre Front-end e Back-end permitiu uma arquitetura mais escalável, cumprindo a proposta de evolução tecnológica planejada anteriormente e entregando uma ferramenta robusta para a comunidade acadêmica.
