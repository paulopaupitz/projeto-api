const express = require('express');
const router = express.Router();
const PetController = require('../controllers/pets.controller');

// Rota para criar um novo pet
router.post('/', PetController.criarPet);

// Rota para listar todos os pets
router.get('/', PetController.listarPets);

// Rota para buscar um pet por ID
router.get('/:id', PetController.buscarPetPorId);

// Rota para atualizar um pet
router.put('/:id', PetController.atualizarPet);

// Rota para deletar um pet
router.delete('/:id', PetController.deletarPet);

module.exports = router;
