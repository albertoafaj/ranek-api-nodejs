# RANEK - API Rest com NodeJs

Uma API REST para potencializar a sua experiência de compra no site fictício RANEK.

## Descrição do projeto: 

A API REST Ranek é uma plataforma desenvolvida em NodeJS e Express para aprimorar a experiência de compra no site fictício RANEK. Utiliza Jest para testes automatizados e Postgresql como banco de dados principal. 

## Funcionalidades do projeto

| MÉTODO HTTP | ROTA | FUNCIONALIDADE |
|--- |--- |--- |
| POST | /auth/signup | Cadastrar usuários |
| POST | /auth/signin | Obter token de autenticação |
| GET | /v1/users | Buscar todos os usuários  |
| PUT | /v1/users:id | Atualizar usuários por Id do produto |
| GET | /v1/products | Buscar todos os produtos |
| GET | /v1/products:id | Buscar produto por Id |
| GET | /v1/products?userId= | Buscar produto por Id do usuário |
| GET | /v1/products?keywors= | Buscar produto por palavra-chave |
| GET | /v1/products?limit= | Limitar numero de produtos por requisição |
| GET | /v1/products?page= | Paginar lista de produtos buscados |
| POST | /v1/products | Salvar produto |
| PUT | /v1/products:Id | Atualizar produto por Id |
| DELETE | /v1/products:Id | Atualizar produto por Id |
| GET | /v1/address:Id | Buscar endereço por Id |
| POST | /v1/address | Salvar endereço |
| PUT | /v1/address:Id | Atualizar endereço por Id |
| DELETE | /v1/address:Id | Atualizar endereço por Id |
| GET | /v1/photos:Id | Buscar fotos por Id |
| POST | /v1/photos | Salvar fotos |
| DELETE | /v1/photos:Id | Atualizar fotos por Id |
| GET | /v1/transactions:Id | Buscar transações por Id |
| POST | /v1/transactions | Salvar transações |
| PUT | /v1/transactions:Id | Atualizar transações por Id |
| DELETE | /v1/transactions:Id | Atualizar transações por Id |
## Site do projeto:

## Instação:

### Clonar o repositório:
```
$ git clone https://github.com/albertoafaj/ranek-api-nodejs.git
```
### Instalar as dependências:
```
$ npm install
```
### Instalar Postgresql / PGADIM

https://www.postgresql.org/download/

https://www.pgadmin.org/download/

#### Casdastrar Bancos de dados no Postgres

* tst_ranek
* prd_ranek
   
### Cadastre as variáveis de ambiente

Crie o arquivo ```.env``` na raiz do projeto:
```
DB_HOST="Host cadastrado no postgres"
DB_PORT="Porta do serviço postgres"
DB_USER="Usuário cadastrado no postgres"
DB_PASS="Senha cadastrada no postgres"
DB_PROD="prd_ranek"
DB_TEST="tst_ranek"
```

### Rodando a aplicação:
```
$ npm start
```

### Testando a aplicação:
```
$ npm run test
```

## Tecnologias utilizadas

* NODE
* Express
* Jest
* Supertest
* Knex
* Postgres