const express = require("express");
const router = express.Router();
const DonoController = require("../controllers/donos.controller");

// Rota para criar um novo dono
router.post("/", DonoController.criarDono);
// Rota para listar todos os donos
router.get("/", DonoController.listarDonos);
// Rota para buscar um dono por ID
router.get("/:id", DonoController.buscarDonoPorId);
// Rota para atualizar um dono
router.put("/:id", DonoController.atualizarDono);
// Rota para deletar um dono
router.delete("/:id", DonoController.deletarDono);
module.exports = router;
