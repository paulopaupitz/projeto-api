const fs = require('fs');
const path = require('path');
const Dono = require('../models/donos.model');

// Caminho do arquivo JSON onde os dados dos donos serão armazenados
const dbPath = path.join(__dirname, '../data/donos.json');

// Função para carregar os dados do arquivo JSON
const carregarDonos = () => {
    if (fs.existsSync(dbPath)) {
        const dadosBrutos = fs.readFileSync(dbPath, 'utf-8');
        return JSON.parse(dadosBrutos);
    }
    return [];
};

// Função para salvar os dados no arquivo JSON
const salvarDonos = (dados) => {
    const dadosFormatados = JSON.stringify(dados, null, 2);
    fs.writeFileSync(dbPath, dadosFormatados);
};

// Controlador para criar um novo dono
exports.criarDono = (req, res) => {
    const validacao = Dono.validarDados(req.body);
    if (!validacao.valido) {
        return res.status(400).json({ mensagem: validacao.mensagem });
    }

    const donos = carregarDonos();
    const novoDono = new Dono(req.body.nome, req.body.telefone, req.body.endereco);
    novoDono.id = donos.length > 0 ? donos[donos.length - 1].id + 1 : 1;

    donos.push(novoDono);
    salvarDonos(donos);
    res.status(201).json(novoDono);
};

// Controlador para listar todos os donos
exports.listarDonos = (req, res) => {
    const donos = carregarDonos();
    res.status(200).json(donos);
};

// Controlador para buscar um dono por ID
exports.buscarDonoPorId = (req, res) => {
    const donos = carregarDonos();
    const dono = donos.find(d => d.id === parseInt(req.params.id));
    if (!dono) {
        return res.status(404).json({ mensagem: 'Dono não encontrado' });
    }
    res.status(200).json(dono);
};

// Controlador para atualizar um dono
exports.atualizarDono = (req, res) => {
    const donos = carregarDonos();
    const index = donos.findIndex(d => d.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ mensagem: 'Dono não encontrado' });
    }
    const validacao = Dono.validarDados(req.body);
    if (!validacao.valido) {
        return res.status(400).json({ mensagem: validacao.mensagem });
    }
    const donoAtualizado = { ...donos[index], ...req.body };
    donos[index] = donoAtualizado;
    salvarDonos(donos);
    res.status(200).json(donoAtualizado);
};

// Controlador para deletar um dono
exports.deletarDono = (req, res) => {
    const donos = carregarDonos();
    const novosDonos = donos.filter(d => d.id !== parseInt(req.params.id));
    if (novosDonos.length === donos.length) {
        return res.status(404).json({ mensagem: 'Dono não encontrado' });
    }
    salvarDonos(novosDonos);
    res.status(204).send();
};
