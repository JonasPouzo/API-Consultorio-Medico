const express = require('express');
const {
    listarConsultasMedicas,
    agendamento,
    atualizarConsultasMedicas,
    deletarConsultasMedicas,
    finalizarConsultasMedicas,
    listarLaudosConsulta,
    listarLaudosMedico } = require('./controladores/consultasMedicas');

const rotas = express();

rotas.get('/consulta', listarConsultasMedicas);
rotas.post('/consulta', agendamento);
rotas.put('/consulta/:identificadorConsulta/paciente', atualizarConsultasMedicas);
rotas.delete('/consulta/:identificadorConsulta', deletarConsultasMedicas);
rotas.post('/consulta/finalizar', finalizarConsultasMedicas);
rotas.get('/consulta/laudo', listarLaudosConsulta);
rotas.get('/consulta/medico', listarLaudosMedico);

module.exports = rotas;