const express = require("express");
const ActionsController = require("../controllers/actionsPetsho.controller");
const authenticateToken = require("../middlewares/authenticateToken");
const isAdmin = require("../middlewares/authenticateAdmin");

const router = express.Router();

/// Rota para admitir o pet no estabelecimento
router.post(
  "/admitir",
  authenticateToken,
  isAdmin,
  ActionsController.admitirPet
);

// Rota para retirar o pet do estabelecimento
router.post(
  "/retirar",
  authenticateToken,
  isAdmin,
  ActionsController.retirarPet
);

// Rota para quitar pendencias do usuario
router.post(
  "/quitar",
  authenticateToken,
  isAdmin,
  ActionsController.quitarPendencias
);

module.exports = router;
