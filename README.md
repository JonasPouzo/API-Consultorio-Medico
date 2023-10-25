API Consultório Médico

Uma api para um Consultório Médico. Esse é um pojeto **MVP** (Produto Viável Mínimo), ou seja, em um futuro próximo outras funcionalidade surgirão para agregar ainda mais ao projeto, sendo assim os dados do banco (nomePaciente, consultório, etc.) serão imutáveis (estáticos).

Essa RESTful API vai permitir:

- Listar consultas médicas
- Criar consulta médica
- Atualizar os dados de uma consulta médica
- Excluir uma consulta médica
- Finalizar uma consulta médica
- Listar o laudo de uma consulta
- Listar as consultas que um médico atendeu


## Persistências dos dados

Os dados serão persistidos em memória, no objeto existente dentro do arquivo `bancodedados.js`. **Todas as informações e consultas médicas serâo inseridas dentro deste objeto, seguindo a estrutura que já existe.**

### Estrutura do objeto no arquivo `bancodedados.js`

```javascript
{
  consultorio: {
    nome: "Cubos Healthcare",
    identificador: 1,
    cnes: "1001",
    senha: "CubosHealth@2022",
    medicos: [
      {
        identificador: 1,
        nome: "Bill",
        especialidade: "GERAL",
      },
      {
        identificador: 2,
        nome: "Irineu",
        especialidade: "ODONTOLOGIA"
      },
    ]
  },
  consultas: [
    // array de consultas médicas
  ],
  consultasFinalizadas: [
    // array de consultas finalizadas
  ],
  laudos: [
    // array de laudos médicos
  ]
}
```

## Informações adicionais

- Essa API segue o padrão REST
- Qualquer valor (dinheiro) será representado em centavos (Ex.: R$ 10,00 reais = 1000).
- Quando o enunciado do end-point frizar o armazenamento em memória, o mesmo esta se referindo ao arquivo **_bancodedados.js_**, ou seja, a persistência é feita no arquivo **_bancodedados.js_**.


## Endpoints

### Listar consultas médicas

#### `GET` `.kl`

Esse end-point deverá listar todas as consultas médicas.

- O código deverá, **OBRIGATORIAMENTE**:

  - Verificar se o cnes e a senha do consultório foram informados (passado como query params na url).
  - Validar se o cnes a senha do consultório estão corretos.

- **Requisição** - query params (Siga o padrão de nomenclatura)

  - cnes_consultorio
  - senha_consultorio

- **Resposta**
  - Listagem de todas as consultas.

#### Exemplo de resposta

```javascript
// HTTP Status 200 - Success
// 3 consultas encontradas
[
  {
    identificador: 1,
    tipoConsulta: "GERAL",
    identificadorMedico: 1,
    finalizada: true,
    valorConsulta: 3000,
    paciente: {
      nome: "John Doe",
      cpf: "55132392051",
      dataNascimento: "2022-02-02",
      celular: "11999997777",
      email: "john@doe.com",
      senha: "1234",
    },
  },
  {
    identificador: 2,
    tipoConsulta: "ODONTOLOGIA",
    identificadorMedico: 1,
    finalizada: false,
    valorConsulta: 5000,
    paciente: {
      nome: "John Doe 3",
      cpf: "55132392053",
      dataNascimento: "2022-02-02",
      celular: "11999997777",
      email: "john@doe3.com",
      senha: "1234",
    }
  }
];
```

```javascript
// Nenhuma consulta encontrada
// HTTP Status 204 - No Content
```

```javascript
// Senha do consultorio errada
// HTTP Status 401 - Unauthorized
{
  "mensagem": "Cnes ou senha inválidos!"
}
```

### Criar consulta médica

#### `POST` `/consulta`

Esse endpoint deverá criar uma consulta médica, onde será gerado um identificador único para identificação da consulta (identicador da consulta).

- O código deverá, **OBRIGATORIAMENTE**:

  - Verificar se todos os campos foram informados (todos são obrigatórios) 
  - Verifica se o valor da consulta é numérico
  - Verificar se o CPF informado já não está vinculado a nenhuma consulta que não foi finalizada
  - Validar se o tipo da consulta informado consta nas especialidade dos médicos na base
  - Vincular o identificador do médico especializado que irá atender a consulta em questão no momento de criação da consulta
  - Definir _finalizada_ como false
  - Criar uma consulta médica cuja o identificador é único

- **Requisição** - O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

  - tipoConsulta
  - valorConsulta
  - paciente
    - nome
    - cpf
    - dataNascimento
    - celular
    - email
    - senha

- **Resposta**

  Em caso de **sucesso**, não deveremos enviar conteúdo no corpo (body) da resposta.  
   Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.

#### Exemplo de Requisição

```javascript
// POST /consulta
{
  "tipoConsulta": "ODONTOLOGIA",
  "valorConsulta": 5000,
  "paciente": {
    "nome": "John Doe 3",
    "cpf": "55132392053",
    "dataNascimento": "2022-02-02",
    "celular": "11999997777",
    "email": "john@doe3.com",
    "senha": "1234"
  }
}
```

#### Exemplo de Resposta

```javascript
// HTTP Status 204 - No Content
// Sem conteúdo no corpo (body) da resposta
```

```javascript
// HTTP Status 400
{
    "mensagem": "Já existe uma consulta em andamento com o cpf ou e-mail informado!"
}
```

### Atualizar os dados de uma consulta médica

#### `PUT` `/consulta/:identificadorConsulta/paciente`

Esse endpoint deverá atualizar apenas os dados do paciente de uma consulta médica que não esteja finalizada.

- O código deverá, **OBRIGATORIAMENTE**:

  - Verificar se foi passado todos os campos no body da requisição
  - Verificar se o identificador da consulta passado como parametro na URL é válido
  - Se o CPF for informado, verificar se já existe outro registro com o mesmo CPF
  - Se o E-mail for informado, verificar se já existe outro registro com o mesmo E-mail
  - Verifica se a consulta não esta finalizada
  - Atualizar os dados do usuário de uma consulta médica

- **Requisição** - O corpo (body) deverá possuir um objeto com todas as seguintes propriedades (respeitando estes nomes):

  - nome
  - cpf
  - dataNascimento
  - celular
  - email
  - senha

- **Resposta**

  Em caso de **sucesso**, não deveremos enviar conteúdo no corpo (body) da resposta.
  Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.

#### Exemplo de Requisição

```javascript
// PUT /consulta/:identificadorConsulta/paciente
{
  "nome": "John Doe",
  "cpf": "55132392051",
  "dataNascimento": "2022-02-02",
  "celular": "11999997777",
  "email": "john@doe.com",
  "senha": "1234"
}
```

#### Exemplo de Resposta

```javascript
// HTTP Status 204 - No Content
// Sem conteúdo no corpo (body) da resposta
```

```javascript
// HTTP Status 400
{
    "mensagem": "Cpf já consta na base!"
}
```

### Excluir uma consulta médica

#### `DELETE` `/consulta/:identificadorConsulta`

Esse endpoint deve excluir uma consulta médica existente, esta consulta não pode estar _finalizada_.

- O código deverá, **OBRIGATORIAMENTE**:

  - Verificar se o identificador da consulta médica passado como parametro na URL é válido
  - Permitir excluir uma consulta apenas se _finalizada_ for igual a false
  - Remover a consulta do objeto de persistência de dados

- **Requisição**

  - Identificador da consulta (passado como parâmetro na rota)

- **Resposta**

  Em caso de **sucesso**, não deveremos enviar conteúdo no corpo (body) da resposta.  
  Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.

#### Exemplo de Resposta

```javascript
// HTTP Status 204 - No Content
// Sem conteúdo no corpo (body) da resposta
```

```javascript
// HTTP Status 400
{
  "mensagem": "A consulta só pode ser removida se a mesma não estiver finalizada"
}
```

### Finalizar uma consulta médica

#### `POST` `/consulta/finalizar`

Esse endpoint deverá finalizar uma consulta com um texto de laudo válido do médico e registrar esse laudo e essa consulta finalizada.

- O código deverá, **OBRIGATORIAMENTE**:

  - Verificar se foi passado todos os campos no body da requisição
  - Verificar se o identificador da consulta existe
  - Verificar se a consulta já esta finalizada
  - Verificar se o texto do médico possui um tamanho > 0 e <= 200 carácteres
  - Armazenar as informações do laudo na persistência de dados
  - Armazenar a consulta médica finalizada na persistência de dados

- **Requisição** - O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

  - identificadorConsulta
  - textoMedico

- **Resposta**

  Em caso de **sucesso**, não deveremos enviar conteúdo no corpo (body) da resposta.  
  Em caso de **falha na validação**, a resposta deverá possuir **_status code_** apropriado, e em seu corpo (body) deverá possuir um objeto com uma propriedade **mensagem** que deverá possuir como valor um texto explicando o motivo da falha.

#### Exemplo de Requisição

```javascript
// POST /consulta/finalizar
{
	"identificadorConsulta": 1,
	"textoMedico": "XPTO"
}
```

#### Exemplo de Resposta

```javascript
// HTTP Status 204 - No Content
// Sem conteúdo no corpo (body) da resposta
```

```javascript
// HTTP Status 400
{
    "mensagem": "O tamanho do textoMedico não está dentro do esperado"
}
```

#### Exemplo do registro de uma consulta médica finalizada

```javascript
{
  "identificador": 1,
  "tipoConsulta": "GERAL",
  "identificadorMedico": 1,
  "finalizada": true,
  "identificadorLaudo": 1,
  "valorConsulta": 3000,
  "paciente": {
    "nome": "John Doe",
    "cpf": "55132392051",
    "dataNascimento": "2022-02-02",
    "celular": "11999997777",
    "email": "john@doe.com",
    "senha": "1234"
   }
}
```

#### Exemplo do registro de um laudo

```javascript
{
  "identificador": 1,
  "identificadorConsulta": 3,
  "identificadorMedico": 2,
  "textoMedico": "XPTO",
  "paciente": {
     "nome": "John Doe",
     "cpf": "55132392051",
     "dataNascimento": "2022-02-02",
     "celular": "11999997777",
     "email": "john@doe.com",
     "senha": "1234"
  }
}
```

### Listar o laudo de uma consulta

#### `GET` `/consulta/laudo?identificador_consulta=1&senha=1234`

Esse endpoint deverá retornar informações do laudo de uma consulta junto as informações adicionais das entidades relacionadas aquele laudo.

- O código deverá, **OBRIGATORIAMENTE**:

  - Verificar se o identificador da consulta e a senha foram informados (passado como query params na url)
  - Verificar se a consulta médica informada existe
  - Verificar se a senha informada é uma senha válida
  - Verificar se existe um laudo para consulta informada
  - Exibir o laudo da consulta médica em questão junto as informações adicionais

- **Requisição** - query params

  - identificador_consulta
  - senha

- **Resposta**

  - Informações do laudo e das entidades relacionadas

#### Exemplo de Resposta

```javascript
// HTTP Status 200 - Success
{
  "identificador":1,
  "identificadorConsulta": 3,
  "identificadorMedico": 2,
  "textoMedico": "XPTO",
  "paciente": {
    "nome": "John Doe",
    "cpf": "55132392051",
    "dataNascimento": "2022-02-02",
    "celular": "11999997777",
    "email": "john@doe.com",
    "senha": "1234"
  }
}
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
  "mensagem": "Consulta médica não encontrada!"
}
```

### Listar as consultas que um médico atendeu

#### `GET` `/consultas/medico?identificador_medico=1`

Esse endpoint deverá retornar todas as consultas que um profissional **_atendeu_**, ou seja, finalizadas.

- O código deverá, **OBRIGATORIAMENTE**:

  - Verificar se o identificador do medico foi informado (passado como query params na url)
  - Verificar se o médico existe
  - Exibir as consultas vinculadas ao médico

- **Requisição** - query params

  - identificador_medico

- **Resposta**

  - Listagem das consultas vinculadas ao médico

#### Exemplo de Resposta

```javascript
// HTTP Status 200 - Success
[
  {
    identificador: 1,
    tipoConsulta: "GERAL",
    identificadorMedico: 1,
    finalizada: true,
    identificadorLaudo: 1,
    valorConsulta: 3000,
    paciente: {
      nome: "John Doe",
      cpf: "55132392051",
      dataNascimento: "2022-02-02",
      celular: "11999997777",
      email: "john@doe.com",
      senha: "1234",
    },
  },
  {
    identificador: 3,
    tipoConsulta: "GERAL",
    identificadorMedico: 1,
    finalizada: true,
    identificadorLaudo: 1,
    valorConsulta: 5000,
    paciente: {
      nome: "John Doe 3",
      cpf: "55132392053",
      dataNascimento: "2022-02-02",
      celular: "11999997777",
      email: "john@doe3.com",
      senha: "1234",
    },
  },
];
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
  "mensagem": "O médico informado não existe na base!"
}
```