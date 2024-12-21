const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/admin.controller");
const isAdmin = require("../middlewares/authenticateAdmin");
const authenticateToken = require("../middlewares/authenticateToken");

// Rota para criar um novo usuario
router.post("/", AdminController.criarUser);

// Rota para atualizar um usuario
router.put(
  "/updateUser/:id",
  authenticateToken,
  isAdmin,
  AdminController.atualizarUserById
);

// Rota para atualizar meu usuario
router.put(
  "/updateMyUser/",
  authenticateToken,
  isAdmin,
  AdminController.atualizarMyUser
);

// Rota para deletar um usuario
router.delete("/:id", authenticateToken, isAdmin, AdminController.deletarUser);

// Rota para listar todos os usuarios
router.get(
  "/getAllUsers/",
  authenticateToken,
  isAdmin,
  AdminController.listarAllUsers
);

// Rota para listar todos os usuarios administradores
router.get(
  "/getAdmins/",
  authenticateToken,
  isAdmin,
  AdminController.listarAdmins
);

// Rota para listar todos os usuarios comuns
router.get("/getComuns/", authenticateToken, AdminController.listarComuns);

// Rota para buscar um usuario por ID
router.get("/:id", authenticateToken, isAdmin, AdminController.buscarUserPorId);

module.exports = router;
