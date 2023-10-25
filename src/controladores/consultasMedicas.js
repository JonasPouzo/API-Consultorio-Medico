const { consultorio } = require('../bancodedados');
let { consultas, laudos } = require('../bancodedados');

const listarConsultasMedicas = (req, res) => {
    const { cnes_consultorio, senha_consultorio } = req.query;

    if (!cnes_consultorio) {
        return res.status(400).json({ mensagem: 'É obrigatório informar o cnes de login!' });
    } else if (!senha_consultorio) {
        return res.status(400).json({ mensagem: 'É obrigatório informar a senha de login!' });
    }

    if (consultorio.cnes === cnes_consultorio && consultorio.senha === senha_consultorio) {
        if (consultas.length === 0) {
            return res.status(204).json({ mensagem: `Nenhuma consulta encontrada`, consultas });
        } else if (consultas.length === 1) {
            return res.status(200).json({ mensagem: `${consultas.length} consulta encontrada!`, consultas });
        }

        return res.status(200).json({ mensagem: `${consultas.length} consultas encontradas!`, consultas });

    } else {
        return res.status(401).json({ mensagem: 'Cnes ou senha inválidos!' });
    }
};



const agendamento = (req, res) => {
    let { tipoConsulta, valorConsulta, paciente: { nome, cpf, dataNascimento,
        celular, email, senha } } = req.body;

    if (!tipoConsulta) {
        return res.status(400).json({ mensagem: 'É obrigatório informar o tipo da consulta' });
    }
    if (!valorConsulta) {
        return res.status(400).json({ mensagem: 'É obrigatório informar o valor da consulta' });
    }
    if (!nome) {
        return res.status(400).json({ mensagem: 'É obrigatório informar o nome do paciênte' });
    }
    if (!cpf) {
        return res.status(400).json({ mensagem: 'É obrigatório informar o CPF do paciênte' });
    }
    if (!dataNascimento) {
        return res.status(400).json({ mensagem: 'É obrigatório informar a data de nascimento do paciênte' });
    }
    if (!celular) {
        return res.status(400).json({ mensagem: 'É obrigatório informar o celular do paciênte' });
    }
    if (!email) {
        return res.status(400).json({ mensagem: 'É obrigatório informar o email do paciênte' });
    }
    if (!senha) {
        return res.status(400).json({ mensagem: 'É obrigatório informar a senha do paciênte' });
    }

    valorConsulta = Number(valorConsulta);
    if (isNaN(valorConsulta)) {
        return res.status(400).json({ mensagem: 'Para o valor da consulta, é obrigatório informar um valor numérico válido' });
    }

    const cpfEncontrado = consultas.find(pessoa => { return pessoa.paciente.cpf === cpf });
    if (cpfEncontrado) {
        return res.status(400).json({ mensagem: "Já existe uma consulta em andamento com o cpf informado!" });
    }


    let identificador = consultas.length + 1;

    let finalizada = false;
    e
    let identificadorMedico = 0;

    if (tipoConsulta === "GERAL") {
        identificadorMedico = 1;
    } else if (tipoConsulta === "ODONTOLOGIA") {
        identificadorMedico = 2
    } else {
        return res.status(404).json({ mensagem: 'Tipo de consulta informada não está disponível' });
    }

    consultas.push(
        {
            identificador,
            tipoConsulta,
            identificadorMedico,
            finalizada,
            valorConsulta,
            paciente: {
                nome,
                cpf,
                dataNascimento,
                celular,
                email,
                senha
            }
        }
    );

    return res.status(204).json();
};



const atualizarConsultasMedicas = (req, res) => {
    const { identificadorConsulta } = req.params;
    let { nome, cpf, dataNascimento, celular, email, senha } = req.body;

    //Verificar se foi passado algum ou todos os campos no body da requisição
    if (!nome.trim() && !cpf.trim() && !dataNascimento.trim() && !celular.trim() && !email.trim() && !senha.trim()) {
        return res.status(404).json({ mensagem: 'É obrigatório iformar a propriedade à ser atualizada e seu novo valor' });
    }

    if (isNaN(Number(identificadorConsulta))) {
        return res.status(400).json({ mensagem: 'Digitar valor numérico!' });
    }

    const idconsultaEncontrada = consultas.findIndex(pessoa => {
        return pessoa.identificador === Number(identificadorConsulta);
    });

    const consultaEncontrada = consultas[idconsultaEncontrada];

    if (idconsultaEncontrada === -1) {
        return res.status(404).json({ mensagem: 'Consulta não encontrada' });
    }

    if (consultaEncontrada.finalizada) {
        return res.status(400).json({ mensagem: 'Essa consulta médica já foi finalizada' });
    }

    const cpfEncontrado = consultas.find(pessoa => { return pessoa.paciente.cpf === cpf });
    if (cpfEncontrado && cpfEncontrado.identificador !== Number(identificadorConsulta)) {
        return res.status(400).json({ mensagem: 'Cpf já consta na base!' });
    }

    const emailEncontrado = consultas.find(pessoa => { return pessoa.paciente.email === email });
    if (emailEncontrado && emailEncontrado.identificador !== Number(identificadorConsulta)) {
        return res.status(400).json({ mensagem: 'Email já consta na base!' });
    }

    let pacienteAtualizado = { ...consultaEncontrada.paciente };

    if (nome) {
        pacienteAtualizado.nome = nome;
    }
    if (cpf) {
        pacienteAtualizado.cpf = cpf;
    }
    if (dataNascimento) {
        pacienteAtualizado.dataNascimento = dataNascimento;
    }
    if (celular) {
        pacienteAtualizado.celular = celular;
    }
    if (email) {
        pacienteAtualizado.email = email;
    }
    if (senha) {
        pacienteAtualizado.senha = senha;
    }

    consultaEncontrada.paciente = pacienteAtualizado;

    return res.status(204).json();

};



const deletarConsultasMedicas = (req, res) => {
    const { identificadorConsulta } = req.params;

    if (isNaN(Number(identificadorConsulta))) {
        return res.status(404).json({ mensagem: 'Digitar valor numérico!' });
    }

    const idconsultaEncontrada = consultas.findIndex(pessoa => {
        return pessoa.identificador === Number(identificadorConsulta);
    });

    if (idconsultaEncontrada === -1) {
        return res.status(404).json({ mensagem: 'Consulta médica não encontrada' });
    }

    const consultaEncontrada = consultas[idconsultaEncontrada];

    if (consultaEncontrada.finalizada) {
        return res.status(400).json({ mensagem: "A consulta só pode ser removida se a mesma não estiver finalizada" });
    }

    consultas = consultas.filter(consulta => {
        return consulta.identificador !== Number(identificadorConsulta);
    })

    return res.status(204).json();
};



const finalizarConsultasMedicas = (req, res) => {
    let { identificadorConsulta, textoMedico } = req.body;

    if (!identificadorConsulta) {
        return res.status(400).json({ mensagem: 'É obrigatório informar o identificador da consulta!' })
    }
    if (!textoMedico) {
        return res.status(400).json({ mensagem: 'É obrigatório informar o texto de laudo válido do médico!' })
    }

    if (isNaN(Number(identificadorConsulta))) {
        return res.status(404).json({ mensagem: 'Digitar valor numérico!' });
    }

    let consultaEncontrada = consultas.find(pessoa => {
        return pessoa.identificador === Number(identificadorConsulta);
    });

    if (!consultaEncontrada) {
        return res.status(404).json({ mensagem: 'Consulta não encontrada' });
    }

    if (consultaEncontrada.finalizada) {
        return res.status(400).json({ mensagem: 'Consulta já foi finalizada!' });
    }

    if (textoMedico.length === 0 || textoMedico.length > 200) {
        return res.status(404).json({ mensagem: "O tamanho do textoMedico não está dentro do esperado" });
    }

    let pacienteAtualizado = { ...consultaEncontrada };
    const novoLaudo = {
        identificador: laudos.length + 1,
        identificadorConsulta,
        identificadorMedico: pacienteAtualizado.identificadorMedico,
        textoMedico,
        paciente: pacienteAtualizado.paciente
    }
    laudos.push({ ...novoLaudo });

    pacienteAtualizado = {
        identificador: identificadorConsulta,
        tipoConsulta: consultaEncontrada.tipoConsulta,
        identificadorMedico: consultaEncontrada.identificadorMedico,
        finalizada: true,
        identificadorLaudo: laudos.identificador,
        valorConsulta: consultaEncontrada.valorConsulta,
        paciente: consultaEncontrada.paciente
    }

    consultaEncontrada = { ...pacienteAtualizado };
    identificadorConsulta = consultas.findIndex(pessoa => { return pessoa.identificador === identificadorConsulta })
    consultas[identificadorConsulta] = consultaEncontrada;

    return res.status(204).json();
};



const listarLaudosConsulta = (req, res) => {
    const { identificador_consulta, senha } = req.query;

    if (!identificador_consulta) {
        return res.status(400).json({ mensagem: "Informar o identificador da consulta!" });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: "Informar a senha da consulta!" });
    }

    const consultaEncontrada = consultas.find(pessoa => {
        return pessoa.identificador === Number(identificador_consulta)
    });

    if (!consultaEncontrada) {
        return res.status(404).json({ mensagem: "Consulta médica não encontrada" });
    }

    if (Number(senha) !== Number(consultaEncontrada.paciente.senha)) {
        return res.status(401).json({ mensagem: "Senha incorreta!" });
    }

    const laudoEncontrado = laudos.find(consulta => {
        return consulta.identificadorConsulta === Number(identificador_consulta)
    });

    if (!laudoEncontrado) {
        return res.status(404).json({ mensagem: "Não há laudo médico para essa consulta!" });
    }

    return res.status(200).json(laudoEncontrado);
};



const listarLaudosMedico = (req, res) => {
    const { identificador_medico } = req.query;

    if (!identificador_medico) {
        return res.status(400).json({ mensagem: "Informar o identificador do médico!" });
    }

    const medicoEncontrado = consultorio.medicos.find(medico => {
        return medico.identificador === Number(identificador_medico);
    });

    if (!medicoEncontrado) {
        return res.status(404).json({ mensagem: "Médico(a) não encontrado(a)" });
    }

    const listaConsultas = consultas.filter(pessoa => {
        return pessoa.identificadorMedico === Number(identificador_medico) && pessoa.finalizada
    });

    return res.status(200).json(listaConsultas);
};



module.exports = {
    listarConsultasMedicas,
    agendamento,
    atualizarConsultasMedicas,
    deletarConsultasMedicas,
    finalizarConsultasMedicas,
    listarLaudosConsulta,
    listarLaudosMedico
};