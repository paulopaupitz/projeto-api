const fs = require("fs");
const path = require("path");
const AdminModel = require("../models/admin.model");
const { readJSON, writeJSON } = require("../utils/jsonUtils");

// Caminho do arquivo JSON onde os dados dos usuarios serão armazenados
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
 * /admin/":
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
 *         description: Usuario criado com sucesso.
 *       501:
 *          description: Validação de dados não implementada no modelo.
 *       401:
 *          description: ERROR!
 *       400:
 *          description: Usuariosjá existe.
 *       502:
 *          description: Erro ao criar Usuario.
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

    // Ler Usuarios existentes
    const admins = readJSON(adminFilePath) || [];
    const adminExists = admins.find(
      (admin) => admin.username === dados.username
    );
    if (adminExists) {
      return res.status(400).send("Usuario já existe.");
    }

    // Criar novo Usuario.
    const newAdmin = {
      id: Date.now(), // Gerar ID único
      username: dados.username,
      password: dados.password,
      admin: false,
    };
    admins.push(newAdmin);

    // Salvar no arquivo
    writeJSON(adminFilePath, admins);

    res.status(201).send("Usuario criado com sucesso.");
  } catch (error) {
    console.error(error);
    res.status(502).send("Erro ao criar Usuario.");
  }
};

/**
 * @swagger
 * /admin/updateUser/{id}:
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
exports.atualizarUserById = (req, res) => {
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

/**
 * @swagger
 * /admin/updateMyUser:
 *   put:
 *     summary: Atualizar o próprio usuário logado
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
 *       200:
 *         description: Sucesso
 *       400:
 *         description: Dados inválidos
 */
exports.atualizarMyUser = (req, res) => {
  // Obtém o ID do usuário logado a partir do token (inserido pelo middleware authenticateToken)
  const userId = req.user.id;

  // Carrega os usuários do banco de dados ou fonte
  const users = carregarUsers();

  // Busca o usuário logado
  const index = users.findIndex((d) => d.id === userId);
  if (index === -1) {
    return res.status(404).json({ mensagem: "Usuário não encontrado" });
  }

  // Valida os dados enviados no corpo da requisição
  const validacao = AdminModel.validarDados(req.body);
  if (!validacao.valido) {
    return res.status(400).json({ mensagem: validacao.mensagem });
  }

  // Atualiza os dados do usuário
  const userAtualizado = { ...users[index], ...req.body };
  users[index] = userAtualizado;

  // Salva as alterações
  salvarUsers(users);

  res.status(200).json(userAtualizado);
};

/**
 * @swagger
 * /admin/makeAdmin/{id}:
 *   put:
 *     summary: Tornar um usuário administrador pelo ID
 *     tags:
 *       - Admin
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do usuário a ser tornado administrador
 *         schema:
 *           type: int
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       403:
 *         description: Permissão negada
 */
exports.tornarAdmin = (req, res) => {
  // Obtém o ID do usuário a ser tornado admin da URL
  const userId = parseInt(req.params.id);

  // Verifica se o usuário logado tem permissão para executar essa ação
  if (!req.user.isAdmin) {
    return res.status(403).json({
      mensagem:
        "Permissão negada. Apenas administradores podem realizar esta ação.",
    });
  }

  // Carrega os usuários do banco de dados ou fonte
  const users = carregarUsers();

  // Busca o usuário pelo ID
  const index = users.findIndex((user) => user.id === userId);
  if (index === -1) {
    return res.status(404).json({ mensagem: "Usuário não encontrado." });
  }

  // Torna o usuário administrador
  users[index].isAdmin = true;

  // Salva as alterações
  salvarUsers(users);

  res.status(200).json({
    mensagem: "Usuário atualizado com sucesso.",
    usuario: users[index],
  });
};

/**
 * @swagger
 * /admin/{id}:
 *   delete:
 *     summary: Deletar um usuario pelo ID
 *     tags:
 *       - Admin
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do usuario para ser deletado
 *         schema:
 *           type: int
 *     responses:
 *       204:
 *         description: Usuario deletado
 *       404:
 *         description: Usuario não encontrado
 *       401:
 *         description: Usuario não pode ser excluido por ser um admin
 */
// Controlador para deletar um dono
exports.deletarUser = (req, res) => {
  const users = carregarUsers(); // Carrega todos os usuários
  const userId = parseInt(req.params.id); // Obtém o ID do usuário da rota

  // Encontra o usuário pelo ID
  const userEncontrado = users.find((u) => u.id === userId);

  if (!userEncontrado) {
    // Verifica se o usuário existe
    return res.status(404).json({ mensagem: "Usuário não encontrado" });
  }

  if (userEncontrado.admin === true) {
    // Verifica se o usuário é administrador
    return res
      .status(401)
      .json({ mensagem: "Usuário não pode ser excluído por ser um admin" });
  }

  // Filtra a lista de usuários removendo o usuário correspondente ao ID
  const novosUsers = users.filter((u) => u.id !== userId);

  // Salva a lista atualizada
  salvarUsers(novosUsers);

  // Retorna a resposta de exclusão bem-sucedida
  res.status(204).json({ mensagem: "Usuário deletado" });
};

/**
 * @swagger
 * /admin/getAllUsers:
 *   get:
 *     summary: Listar todos os usuários com paginação.
 *     tags:
 *       - Admin
 *     parameters:
 *       - name: limite
 *         in: query
 *         description: "Número de registros a serem retornados (valores possíveis: 5, 10, 30)."
 *         required: true
 *         schema:
 *           type: integer
 *           enum: [5, 10, 30]
 *       - name: pagina
 *         in: query
 *         description: "Número da página de resultados (inicia em 1)."
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sucesso
 */
exports.listarAllUsers = (req, res) => {
  const users = carregarUsers(); // Carrega todos os usuários
  const { limite, pagina } = req.query;

  // Valida limite e página
  const limiteValido = [5, 10, 30].includes(parseInt(limite, 10))
    ? parseInt(limite, 10)
    : 5;
  const paginaValida = Math.max(parseInt(pagina, 10) || 1, 1);

  // Paginação
  const inicio = (paginaValida - 1) * limiteValido;
  const paginatedUsers = users.slice(inicio, inicio + limiteValido);

  res.status(200).json(paginatedUsers);
};

/**
 * @swagger
 * /admin/getAdmins:
 *   get:
 *     summary: Listar todos os usuários administradores com paginação.
 *     tags:
 *       - Admin
 *     parameters:
 *       - name: limite
 *         in: query
 *         description: "Número de registros a serem retornados (valores possíveis: 5, 10, 30)."
 *         required: true
 *         schema:
 *           type: integer
 *           enum: [5, 10, 30]
 *       - name: pagina
 *         in: query
 *         description: "Número da página de resultados (inicia em 1)."
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sucesso
 */
exports.listarAdmins = (req, res) => {
  const users = carregarUsers(); // Carrega todos os usuários
  const { limite, pagina } = req.query;

  const admins = users.filter((user) => user.admin === true); // Filtra apenas administradores

  // Valida limite e página
  const limiteValido = [5, 10, 30].includes(parseInt(limite, 10))
    ? parseInt(limite, 10)
    : 5;
  const paginaValida = Math.max(parseInt(pagina, 10) || 1, 1);

  // Paginação
  const inicio = (paginaValida - 1) * limiteValido;
  const paginatedAdmins = admins.slice(inicio, inicio + limiteValido);

  res.status(200).json(paginatedAdmins);
};

/**
 * @swagger
 * /admin/getComuns:
 *   get:
 *     summary: Listar todos os usuários comuns com paginação.
 *     tags:
 *       - Admin
 *     parameters:
 *       - name: limite
 *         in: query
 *         description: "Número de registros a serem retornados (valores possíveis: 5, 10, 30)."
 *         required: true
 *         schema:
 *           type: integer
 *           enum: [5, 10, 30]
 *       - name: pagina
 *         in: query
 *         description: "Número da página de resultados (inicia em 1)."
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sucesso
 */
exports.listarComuns = (req, res) => {
  const users = carregarUsers(); // Carrega todos os usuários
  const { limite, pagina } = req.query;

  const comuns = users.filter((user) => user.admin === false); // Filtra apenas usuários comuns

  // Valida limite e página
  const limiteValido = [5, 10, 30].includes(parseInt(limite, 10))
    ? parseInt(limite, 10)
    : 5;
  const paginaValida = Math.max(parseInt(pagina, 10) || 1, 1);

  // Paginação
  const inicio = (paginaValida - 1) * limiteValido;
  const paginatedComuns = comuns.slice(inicio, inicio + limiteValido);

  res.status(200).json(paginatedComuns);
};

/**
 * @swagger
 * /admin/{id}:
 *   get:
 *     summary: Buscar um usuario pelo ID
 *     tags:
 *       - Admin
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do usuario a ser buscado
 *         schema:
 *           type: int
 *     responses:
 *       200:
 *         description: Sucesso
 *       404:
 *         description: Usuario não encontrado
 */
// Controlador para buscar um usuario por ID
exports.buscarUserPorId = (req, res) => {
  const users = carregarUsers();
  const user = users.find((p) => p.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ mensagem: "Usuario não encontrado" });
  }
  res.status(200).json(user);
};
