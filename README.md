# Aplicativo de notas (Back-end)
Trata-se da camada lógica (back-end) de um aplicativo de notas inspirado no Google Keep, que permite a criação, visualização, atualização e exclusão de notas.

## Funcionalidades
* Login seguro com Google OAuth
* Operações básicas (CRUD) para gerenciar notas
* Visualização notas ativas e arquivadas
* Exclusão de conta e notas relacionadas
* Persistência de dados em Banco de Dados.

## Tecnologias utilizadas
* TypeScript
* Node.js
* Express
* Passport.js (Para autenticação com Google)
* JWT (proteção de rotas da API)
* MySQL
* Bcrypt

## Instalação 

Criação de pasta do projeto:
```
mkdir app-de-notas
```

Acessar pasta criada:
```
cd ./app-de-notas
```

Clonar repositório:
```
git clone https://github.com/gabrieltlss/note-app-backend.git .
```

Instalar dependências:
```
npm install
```

Ajustar variáveis de ambiente:
- Criar arquivo .env com as variáveis disponibilizadas em .env.example
- Ajustar variáveis necessárias

Observação: acesse esta [documentação do Google](https://developers.google.com/identity/protocols/oauth2?hl=pt-br) para obter e definir as seguintes variáveis de ambiente:

```
GOOGLE_CLIENT_ID="googleClientID"
GOOGLE_CLIENT_SECRET="googleSecretKey"
GOOGLE_REDIRECT_URI="https://example"
```

Execução do projeto:
```
npm run dev
```

* Este trecho executa o projeto ainda em TypeScript.

Caso queira obter a versão de distribuição do projeto (em JavaScript), execute:
```
npm run build
```

## Uso do projeto
Por tratar-se de uma camada lógica (back-end), este projeto trabalha em conjunto com outro projeto, que provê a interface da página de internet (front-end) e usufrui dos dados aqui retornados.

Acesse-o por este endereço para executá-lo localmente: [App de Notas (front-end)](https://github.com/gabrieltlss/note-app-frontend.git).

Caso prefira uma opção imediata, acesse a página já disponibilizada em https://note-app.gabrieltlss.com.br.

## API / Rotas
|Rotas                   |Descrição                                  |
|------------------------|-------------------------------------------|
|GET `/google`           |Leva usuário para página de login do Google|
|GET `/googleCallback`   |Gerencia tokens e usuário após login       |
|GET `/auth/refresh`     |Emite novo token de acesso                 |
|GET `/auth/logout`      |Realiza logout e revoga tokens JWT         |
|GET `/notes`            |Retorna notas de usuário                   |
|POST `/notes`           |Cria nova nota                             |
|PUT `/notes/:noteId`    |Atualiza nota existente                    |
|DELETE `/notes/:noteId` |Exclui nota específica                     |
|GET `/account/user`     |Retorna informações da conta               |
|DELETE `/account/delete`|Exclui conta de um usuário                 |


## Contribuição
Projeto de código aberto que permite uso livre e modificações quaisquer, mas que, por sua natureza pessoal e expositiva, não aceitará contribuições neste repositório em específico.

## Autoria
Gabriel Teles ([Perfil Github](https://github.com/gabrieltlss))

Contato pelo site: https://gabrieltlss.com.br/

## Licença
Sob licença [MIT](./LICENSE)