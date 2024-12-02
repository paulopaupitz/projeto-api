const fs = require('fs');
const path = require('path');
const Pet = require('../models/pet.model');

// Caminho do arquivo JSON onde os dados dos pets serão armazenados
const petsDbPath = path.join(__dirname, '../data/pets.json');

// Função para carregar os dados dos pets do arquivo JSON
const carregarPets = () => {
    if (fs.existsSync(petsDbPath)) {
        const dadosBrutos = fs.readFileSync(petsDbPath, 'utf-8');
        return JSON.parse(dadosBrutos);
    }
    return [];
};

// Função para salvar os dados dos pets no arquivo JSON
const salvarPets = (dados) => {
    const dadosFormatados = JSON.stringify(dados, null, 2);
    fs.writeFileSync(petsDbPath, dadosFormatados);
};

// Controlador para criar um novo pet
exports.criarPet = (req, res) => {
    const validacao = Pet.validarDados(req.body);
    if (!validacao.valido) {
        return res.status(400).json({ mensagem: validacao.mensagem });
    }

    const pets = carregarPets();
    const novoPet = new Pet(req.body.nome, req.body.especie, req.body.idade, req.body.donoId);
    novoPet.id = pets.length > 0 ? pets[pets.length - 1].id + 1 : 1;

    pets.push(novoPet);
    salvarPets(pets);
    res.status(201).json(novoPet);
};

// Controlador para listar todos os pets
exports.listarPets = (req, res) => {
    const pets = carregarPets();
    res.status(200).json(pets);
};

// Controlador para buscar um pet por ID
exports.buscarPetPorId = (req, res) => {
    const pets = carregarPets();
    const pet = pets.find(p => p.id === parseInt(req.params.id));
    if (!pet) {
        return res.status(404).json({ mensagem: 'Pet não encontrado' });
    }
    res.status(200).json(pet);
};

// Controlador para atualizar um pet
exports.atualizarPet = (req, res) => {
    const pets = carregarPets();
    const index = pets.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ mensagem: 'Pet não encontrado' });
    }
    const validacao = Pet.validarDados(req.body);
    if (!validacao.valido) {
        return res.status(400).json({ mensagem: validacao.mensagem });
    }
    const petAtualizado = { ...pets[index], ...req.body };
    pets[index] = petAtualizado;
    salvarPets(pets);
    res.status(200).json(petAtualizado);
};

// Controlador para deletar um pet
exports.deletarPet = (req, res) => {
    const pets = carregarPets();
    const novosPets = pets.filter(p => p.id !== parseInt(req.params.id));
    if (novosPets.length === pets.length) {
        return res.status(404).json({ mensagem: 'Pet não encontrado' });
    }
    salvarPets(novosPets);
    res.status(204).send();
};
