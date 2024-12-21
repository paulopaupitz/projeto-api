const express = require("express");
const router = express.Router();
const DonoController = require("../controllers/donos.controller");
const authenticateToken = require("../middlewares/authenticateToken");

// Rota para criar um novo dono
router.post("/", authenticateToken, DonoController.criarDono);
// Rota para listar todos os donos
router.get("/", authenticateToken, DonoController.listarDonos);
// Rota para buscar um dono por ID
router.get("/:id", authenticateToken, DonoController.buscarDonoPorId);
// Rota para atualizar um dono
router.put("/:id", authenticateToken, DonoController.atualizarDono);
// Rota para deletar um dono
router.delete("/:id", authenticateToken, DonoController.deletarDono);
module.exports = router;
