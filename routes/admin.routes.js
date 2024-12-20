const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/admin.controller");

// Rota para criar um novo usuario
router.post("/", AdminController.criarUser);

// Rota para atualizar um usuario
router.put("/:id", AdminController.atualizarUser);

// Rota para deletar um usuario
router.delete("/:id", AdminController.deletarUser);

// Rota para listar todos os usuarios
router.get("/getAllUsers/", AdminController.listarAllUsers);

// Rota para listar todos os usuarios administradores
router.get("/getAdmins/", AdminController.listarAdmins);

// Rota para listar todos os usuarios comuns
router.get("/getComuns/", AdminController.listarComuns);

module.exports = router;
