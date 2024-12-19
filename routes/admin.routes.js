const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/admin.controller");

// Rota para criar um novo administrador
router.post("/create", AdminController.criarAdmin);

// Rota para excluir um usuário não administrador
//router.delete("/delete-user/:id", AdminController.excluirUsuario);

// Rota para listar todos os administradores
//router.get("/admins", AdminController.listarAdmins);

// Rota para listar todos os usuários
//router.get("/users", AdminController.listarUsuarios);

module.exports = router;
