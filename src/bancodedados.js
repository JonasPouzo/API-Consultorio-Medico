module.exports = {
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
        senha: "1234"
      }
    },
    {
      identificador: 2,
      tipoConsulta: "ODONTOLOGIA",
      identificadorMedico: 2,
      finalizada: false,
      valorConsulta: 5000,
      paciente: {
        nome: "John Doe 3",
        cpf: "55132392053",
        dataNascimento: "2022-02-02",
        celular: "11999997777",
        email: "john@doe3.com",
        senha: "1234"
      }
    }
  ],
  consultasFinalizadas: [],
  laudos: []
}