const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/admin.controller");

// Rota para criar um novo usuario
router.post("/", AdminController.criarUser);

// Rota para atualizar um usuario
router.put("/:id", AdminController.atualizarUser);

// Rota para excluir um usuário não administrador
//router.delete("/:id", AdminController.excluirUsuario);

// Rota para listar todos os administradores
//router.get("/", AdminController.listarAdmins);

// Rota para listar todos os usuários
//router.get("/", AdminController.listarUsuarios);

module.exports = router;
