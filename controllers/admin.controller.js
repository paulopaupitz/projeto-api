const fs = require("fs");
const path = require("path");
const AdminModel = require("../models/admin.model");
const { readJSON, writeJSON } = require("../utils/jsonUtils");

// Caminho do arquivo JSON onde os dados dos administradores serão armazenados
const adminFilePath = path.join(__dirname, "../data/admins.json");

// Função para carregar os dados do arquivo JSON
const carregarUsers = () => {
  if (fs.existsSync(adminFilePath)) {
    const dadosBrutos = fs.readFileSync(adminFilePath, "utf-8");
    return JSON.parse(dadosBrutos);
  }
  return [];
};

// Função para salvar os dados no arquivo JSON
const salvarUsers = (dados) => {
  const dadosFormatados = JSON.stringify(dados, null, 2);
  fs.writeFileSync(adminFilePath, dadosFormatados);
};

/**
 * @swagger
 * /admin/createAdmin":
 *   post:
 *     summary: Criar um novo usuario
 *     tags:
 *       - Admin
 *     requestBody:  # Descreve o corpo da requisição
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nome do Usuario
 *                 example: "user"
 *               password:
 *                 type: string
 *                 description: Senha do Usuario
 *                 example: "senha"
 *     responses:
 *       201:
 *         description: Administrador criado com sucesso.
 *       501:
 *          description: Validação de dados não implementada no modelo.
 *       401:
 *          description: ERROR!
 *       400:
 *          description: Administrador já existe.
 *       502:
 *          description: Erro ao criar administrador.
 */
// Criar um novo usuario
exports.criarUser = (req, res) => {
  try {
    const dados = req.body;

    // Validação dos dados
    if (
      !AdminModel.validarDados ||
      typeof AdminModel.validarDados !== "function"
    ) {
      return res
        .status(501)
        .send("Validação de dados não implementada no modelo.");
    }
    const validacao = AdminModel.validarDados(dados);
    if (!validacao.valido) {
      return res.status(401).send(validacao.mensagem);
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
      password: dados.password,
      admin: false,
    };
    admins.push(newAdmin);

    // Salvar no arquivo
    writeJSON(adminFilePath, admins);

    res.status(201).send("Administrador criado com sucesso.");
  } catch (error) {
    console.error(error);
    res.status(502).send("Erro ao criar administrador.");
  }
};

/**
 * @swagger
 * /admin/{id}:
 *   put:
 *     summary: Atualizar um usuario pelo ID
 *     tags:
 *       - Admin
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do usuario para ser atualizado
 *         schema:
 *           type: int
 *     requestBody:  # Descreve o corpo da requisição
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nome do Usuario
 *                 example: "user"
 *               password:
 *                 type: string
 *                 description: Senha do Usuario
 *                 example: "senha"
 *     responses:
 *       200:
 *         description: Sucesso
 *       404:
 *         description: Usuario não encontrado
 *       400:
 *         description: Erro
 */
// Controlador para atualizar um usuario
exports.atualizarUser = (req, res) => {
  const users = carregarUsers();
  const index = users.findIndex((d) => d.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ mensagem: "Usuario não encontrado" });
  }
  const validacao = AdminModel.validarDados(req.body);
  if (!validacao.valido) {
    return res.status(400).json({ mensagem: validacao.mensagem });
  }
  const userAtualizado = { ...users[index], ...req.body };
  users[index] = userAtualizado;
  salvarUsers(users);
  res.status(200).json(userAtualizado);
};
