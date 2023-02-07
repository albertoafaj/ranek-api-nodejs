# :construction: Em desenvolvimento :construction:- RANEK API Rest com NodeJs

API REST para o e-commerce fictício Ranek.

## Descrição do projeto: 

API Rest utilizando NodeJS / Express, o Jest para dar para a aplicação a segurança dos testes, o Postgresql como database.

## Funcionalidades do projeto

* `Funcionalidade 1`: Cadastrar e buscar usuários;
* `Funcionalidade 2`: Em desenvolvimento;
* `Funcionalidade 3`: Em desenvolvimento;
* `Funcionalidade 4`: Em desenvolvimento;

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

#### Utilizando a API (Alguns exemplos de uso)


1) consulta lista de usuários
   HTTP: GET /v1/users
   AUTH: Bearer Token
   RESPONSE EXAMPLE: [{ 
      "id": 1,
      "name": "Ranek",
      "email": "ranek@ranek.com",
      "password": "123456",
      "street": "Rua Ali perto",
      "number": "1200",
      "city": "Camaçari",
      "state": "BA",
      "zipCode": "12345678",
      "district": "Arembepe"
    }]


## Tecnologias utilizadas

* NODE
* Express
* Jest
* Supertest
* Knex
* Postgres