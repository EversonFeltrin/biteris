# Projeto Biteris

O projeto biteris tem o objetivo de desenvolver uma solução em formato de API com a utilização de node.js e Typescript, simulando o comportamento de um caixa eletrônico com operações de saque e depósito em Conta Corrente e Conta Poupança.

## Tecnologias utilizadas

- Node.js
- MySQL
- Npm

## Dependências

Para iniciar você deve instalar as dependências:

```
npm i
```

## Como executar este projeto

Para rodar este projeto:

- É necessário criar um banco e dados "biteris".
- Atualizar o arquido database.json que se encontra na pasta "src" com as configurações de acesso ao banco de dados mysql.
- Atualizar o arquivo env que se encontra na pasta "src/config" com as configurações de acesso ao banco de dados mysql.

- Executar os seguintes comandos:

```
cd src
db-migrate up --config database.json -e
npm run dev
```

O acesso para desenvolvimento pode ser efetuado através do link: http://localhost:5000

## Rotas

- Rotas para depósito em conta corrente e conta poupança:

```
http://localhost:5000/conta-corrente/depositar
http://localhost:5000/conta-poupanca/depositar
```

- Rotas para saque em conta corrente e conta poupança:

```
http://localhost:5000/conta-corrente/sacar
http://localhost:5000/conta-poupanca/sacar
```

As rotas devem utilizar o método POST, passando um objeto JSON no corpo da requisição. O objeto deve estar de acordo com o seguinte formato:

```
{
    "account": "12345678",
    "value": 0.10
}
```

