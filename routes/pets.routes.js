const express = require("express");
const router = express.Router();
const PetController = require("../controllers/pets.controller");
const authenticateToken = require("../middlewares/authenticateToken");

// Rota para criar um novo pet.
router.post("/", authenticateToken, PetController.criarPet);
// Rota para listar todos os pets
router.get("/", authenticateToken, PetController.listarPets);
// Rota para buscar um pet por ID
router.get("/:id", authenticateToken, PetController.buscarPetPorId);
// Rota para atualizar um pet
router.put("/:id", authenticateToken, PetController.atualizarPet);
// Rota para deletar um pet
router.delete("/:id", authenticateToken, PetController.deletarPet);

module.exports = router;
