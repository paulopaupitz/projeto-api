const path = require("path");
const AdminModel = require("../models/admin.model");
const { readJSON, writeJSON } = require("../utils/jsonUtils");

// Caminho do arquivo JSON onde os dados dos administradores serão armazenados
const adminFilePath = path.join(__dirname, "../data/admins.json");

/**
 * @swagger
 * /admin:
 *   post:
 *     summary: Criar um novo administrador
 *     tags:
 *       - Admin
 *     requestBody:  # Descreve o corpo da requisição
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do admin
 *                 example: "Jonas Oliveira"
 *     responses:
 *       201:
 *         description: Sucesso
 */
// Criar um novo administrador
exports.criarAdmin = (req, res) => {
  try {
    const dados = req.body;

    // Validação dos dados
    if (
      !AdminModel.validarDados ||
      typeof AdminModel.validarDados !== "function"
    ) {
      return res
        .status(500)
        .send("Validação de dados não implementada no modelo.");
    }
    const validacao = AdminModel.validarDados(dados);
    if (!validacao.valido) {
      return res.status(400).send(validacao.mensagem);
    }

    // Ler administradores existentes
    const admins = readJSON(adminFilePath) || [];
    const adminExists = admins.find(
      (admin) => admin.username === dados.username
    );
    if (adminExists) {
      return res.status(400).send("Administrador já existe.");
    }

    // Criar novo administrador
    const newAdmin = {
      id: Date.now(), // Gerar ID único
      username: dados.username,
      password: dados.password, // Em um cenário real, criptografe a senha
    };
    admins.push(newAdmin);

    // Salvar no arquivo
    writeJSON(adminFilePath, admins);

    res.status(201).send("Administrador criado com sucesso.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao criar administrador.");
  }
};
