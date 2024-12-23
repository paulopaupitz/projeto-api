const fs = require("fs");
const path = require("path");
const Dono = require("../models/donos.model");

// Caminho do arquivo JSON onde os dados dos donos serão armazenados
const dbPath = path.join(__dirname, "../data/donos.json");

// Função para carregar os dados do arquivo JSON
const carregarDonos = () => {
  if (fs.existsSync(dbPath)) {
    const dadosBrutos = fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(dadosBrutos);
  }
  return [];
};

// Função para salvar os dados no arquivo JSON
const salvarDonos = (dados) => {
  const dadosFormatados = JSON.stringify(dados, null, 2);
  fs.writeFileSync(dbPath, dadosFormatados);
};

/**
 * @swagger
 * /donos:
 *   post:
 *     summary: Criar um novo dono
 *     tags:
 *       - Dono
 *     requestBody:  # Descreve o corpo da requisição
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do dono.
 *                 example: "João Silva"
 *               telefone:
 *                 type: string
 *                 description: Telefone do dono.
 *                 example: "12345-6789"
 *               endereco:
 *                 type: string
 *                 description: Endereço do dono.
 *                 example: "Rua Exemplo, 123"
 *     responses:
 *       201:
 *         description: Sucesso
 *       400:
 *         description: Erro
 */
// Controlador para criar um novo dono
exports.criarDono = (req, res) => {
  const dado = req.body;
  const validacao = Dono.validarDados(req.body);
  if (!validacao.valido) {
    return res.status(400).json({ mensagem: validacao.mensagem });
  }

  const donos = carregarDonos();
  const novoDono = {
    nome: dado.nome,
    telefone: dado.telefone,
    endereco: dado.endereco,
    pendencias: 0,
  };
  novoDono.id = donos.length > 0 ? donos[donos.length - 1].id + 1 : 1;

  donos.push(novoDono);
  salvarDonos(donos);
  res.status(201).json(novoDono);
};

/**
 * @swagger
 * /donos:
 *   get:
 *     summary: Listar todos os donos com paginação.
 *     tags:
 *       - Dono
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
 *         description: "Sucesso."
 */
// Controlador para listar todos os donos com paginação
exports.listarDonos = (req, res) => {
  const donos = carregarDonos(); // Carrega a lista de donos
  const { limite, pagina } = req.query; // Extrai os parâmetros de paginação

  // Valida os parâmetros limite e página
  const limiteValido = [5, 10, 30].includes(parseInt(limite, 10))
    ? parseInt(limite, 10)
    : 5;
  const paginaValida = Math.max(parseInt(pagina, 10) || 1, 1);

  // Calcula a posição inicial e retorna os registros paginados
  const inicio = (paginaValida - 1) * limiteValido;
  const donosPaginados = donos.slice(inicio, inicio + limiteValido);

  res.status(200).json(donosPaginados); // Retorna os dados paginados
};

/**
 * @swagger
 * /donos/{id}:
 *   get:
 *     summary: Buscar um dono por ID
 *     tags:
 *       - Dono
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do dono buscado
 *         schema:
 *           type: int
 *     responses:
 *       200:
 *         description: Sucesso
 *       404:
 *         description: Dono não encontrado
 */
// Controlador para buscar um dono por ID
exports.buscarDonoPorId = (req, res) => {
  const donos = carregarDonos();
  const dono = donos.find((d) => d.id === parseInt(req.params.id));
  if (!dono) {
    return res.status(404).json({ mensagem: "Dono não encontrado" });
  }
  res.status(200).json(dono);
};

/**
 * @swagger
 * /donos/{id}:
 *   put:
 *     summary: Atualizar um dono pelo ID
 *     tags:
 *       - Dono
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do dono para ser atualizado
 *         schema:
 *           type: int
 *     requestBody:  # Descreve o corpo da requisição
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: ID do dono (opcional).
 *                 example: 1
 *               nome:
 *                 type: string
 *                 description: Nome do dono.
 *                 example: "João Silva"
 *               telefone:
 *                 type: string
 *                 description: Telefone do dono.
 *                 example: "12345-6789"
 *               endereco:
 *                 type: string
 *                 description: Endereço do dono.
 *                 example: "Rua Exemplo, 123"
 *     responses:
 *       200:
 *         description: Sucesso
 *       404:
 *         description: Dono não encontrado
 *       400:
 *         description: Erro
 */
// Controlador para atualizar um dono
exports.atualizarDono = (req, res) => {
  const donos = carregarDonos();
  const index = donos.findIndex((d) => d.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ mensagem: "Dono não encontrado" });
  }
  const validacao = Dono.validarDados(req.body);
  if (!validacao.valido) {
    return res.status(400).json({ mensagem: validacao.mensagem });
  }
  const donoAtualizado = { ...donos[index], ...req.body };
  donos[index] = donoAtualizado;
  salvarDonos(donos);
  res.status(200).json(donoAtualizado);
};

/**
 * @swagger
 * /donos/{id}:
 *   delete:
 *     summary: Deletar um dono pelo ID
 *     tags:
 *       - Dono
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do dono para ser deletado
 *         schema:
 *           type: int
 *     responses:
 *       204:
 *         description: Dono deletado
 *       404:
 *         description: Dono não encontrado
 */
// Controlador para deletar um dono
exports.deletarDono = (req, res) => {
  const donos = carregarDonos();
  const novosDonos = donos.filter((d) => d.id !== parseInt(req.params.id));
  if (novosDonos.length === donos.length) {
    return res.status(404).json({ mensagem: "Dono não encontrado" });
  }
  salvarDonos(novosDonos);
  res.status(204).send("Dono deletado");
};
