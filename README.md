# Petshop API

Projeto realizado pelos alunos Maria Clara Fadel e Paulo Paupitz para disciplina de Programação Web Back End na UTFPR-CP

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- Node.js (versão LTS recomendada)
- npm ou yarn para gerenciar pacotes.

## Instalação e Inicialização

1. Clone este repositório:
   ```bash
   git clone https://github.com/paulopaupitz/projeto-api.git
   cd petshop-api
   npm install
   npm start
   ```

O servidor estará rodando em http://localhost:3000

## Documentação da API

A documentação da API está disponível via Swagger. Após iniciar o servidor, acesse:

http://localhost:3000/docs

Lá, você encontrará detalhes sobre todas as rotas disponíveis, os parâmetros necessários e os exemplos de respostas.

## Testando a API

Recomenda-se usar uma ferramenta como Postman ou Insomnia para testar os endpoints. Configure os métodos HTTP, cabeçalhos e corpo conforme especificado na documentação do Swagger.

## Usuários Padrão

Aqui estão os usuários padrão disponíveis no sistema para fins de teste:

```
[
  {
    "id": 1734661799034,
    "username": "usuario",
    "password": "123456",
    "admin": false
  },
  {
    "id": 1734662241929,
    "username": "user",
    "password": "707070",
    "admin": false
  },
  {
    "id": 1734662778079,
    "username": "username",
    "password": "password",
    "admin": true
  },
  {
    "id": 1734662811633,
    "username": "admin",
    "password": "admin",
    "admin": true
  }
]
```

## Regras de Negócio

1. Admissão de Pets:

- Pets só podem ser admitidos se o dono não tiver pendências financeiras.
- Caso o dono tenha pendências, o sistema retorna uma mensagem informando o valor das pendências.

2. Retirada de Pets:

- Para retirar um pet, o dono deve pagar parte ou todas as pendências financeiras.
  -O status do pet é atualizado para indicar que ele não está mais no petshop.

3. Quitação de Pendências:

- O dono pode quitar suas pendências financeiras parcialmente ou totalmente.

4. Acesso Administrativo:

- Apenas usuários administradores podem acessar rotas protegidas relacionadas à administração do sistema.
