const express = require("express");
const ActionsController = require("../controllers/actionsPetsho.controller");

const router = express.Router();

/// Rota para admitir o pet no estabelecimento
router.post("/admitir", ActionsController.admitirPet);

// Rota para retirar o pet do estabelecimento
router.post("/retirar", ActionsController.retirarPet);

// Rota para quitar pendencias do usuario
router.post("/quitar", ActionsController.quitarPendencias);

module.exports = router;
