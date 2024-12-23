const fs = require("fs");
const path = require("path");
const Pet = require("../models/pet.models");

// Caminho do arquivo JSON onde os dados dos pets serão armazenados
const petsDbPath = path.join(__dirname, "../data/pets.json");

// Função para carregar os dados dos pets do arquivo JSON
const carregarPets = () => {
  if (fs.existsSync(petsDbPath)) {
    const dadosBrutos = fs.readFileSync(petsDbPath, "utf-8");
    return JSON.parse(dadosBrutos);
  }
  return [];
};

// Função para salvar os dados dos pets no arquivo JSON
const salvarPets = (dados) => {
  const dadosFormatados = JSON.stringify(dados, null, 2);
  fs.writeFileSync(petsDbPath, dadosFormatados);
};

/**
 * @swagger
 * /pets:
 *   post:
 *     summary: Criar um novo pet
 *     tags:
 *       - Pets
 *     requestBody:  # Descreve o corpo da requisição
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do Pet
 *                 example: "Lulu"
 *               especie:
 *                 type: string
 *                 description: Especie do pet.
 *                 example: "Cachorro"
 *               idade:
 *                 type: integer
 *                 description: Idade do pet
 *                 example: 3
 *               donoId:
 *                 type: integer
 *                 description: ID do dono.
 *                 example: 123
 *     responses:
 *       201:
 *         description: Sucesso
 *       400:
 *         description: Erro
 */
// Controlador para criar um novo pet
exports.criarPet = (req, res) => {
  const dado = req.body;
  const validacao = Pet.validarDados(req.body);
  if (!validacao.valido) {
    return res.status(400).json({ mensagem: validacao.mensagem });
  }

  const pets = carregarPets();
  const novoPet = {
    nome: dado.nome,
    especie: dado.especie,
    idade: dado.idade,
    donoId: dado.donoId,
    noPetshop: false,
  };
  novoPet.id = pets.length > 0 ? pets[pets.length - 1].id + 1 : 1;

  pets.push(novoPet);
  salvarPets(pets);
  res.status(201).json(novoPet);
};

/**
 * @swagger
 * /pets:
 *   get:
 *     summary: Listar todos os pets com paginação.
 *     tags:
 *       - Pets
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
// Controlador para listar todos os pets com paginação
exports.listarPets = (req, res) => {
  const pets = carregarPets(); // Carrega a lista de pets
  const { limite, pagina } = req.query; // Extrai os parâmetros de paginação

  // Valida os parâmetros limite e página
  const limiteValido = [5, 10, 30].includes(parseInt(limite, 10))
    ? parseInt(limite, 10)
    : 5;
  const paginaValida = Math.max(parseInt(pagina, 10) || 1, 1);

  // Calcula a posição inicial e retorna os registros paginados
  const inicio = (paginaValida - 1) * limiteValido;
  const petsPaginados = pets.slice(inicio, inicio + limiteValido);

  res.status(200).json(petsPaginados); // Retorna os dados paginados
};

/**
 * @swagger
 * /pets/{id}:
 *   get:
 *     summary: Buscar um pet por ID
 *     tags:
 *       - Pets
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do pet a ser buscado
 *         schema:
 *           type: int
 *     responses:
 *       200:
 *         description: Sucesso
 *       404:
 *         description: Pet não encontrado
 */
// Controlador para buscar um pet por ID
exports.buscarPetPorId = (req, res) => {
  const pets = carregarPets();
  const pet = pets.find((p) => p.id === parseInt(req.params.id));
  if (!pet) {
    return res.status(404).json({ mensagem: "Pet não encontrado" });
  }
  res.status(200).json(pet);
};

/**
 * @swagger
 * /pets/{id}:
 *   put:
 *     summary: Atualizar um pet pelo ID
 *     tags:
 *       - Pets
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do pet para ser atualizado
 *         schema:
 *           type: int
 *     requestBody:  # Descreve o corpo da requisição
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do Pet
 *                 example: "Lulu"
 *               especie:
 *                 type: string
 *                 description: Especie do pet.
 *                 example: "Cachorro"
 *               idade:
 *                 type: integer
 *                 description: Idade do pet
 *                 example: 3
 *               donoId:
 *                 type: integer
 *                 description: ID do dono.
 *                 example: 123
 *     responses:
 *       200:
 *         description: Sucesso
 *       404:
 *         description: Pet não encontrado
 *       400:
 *         description: Erro
 */
// Controlador para atualizar um pet
exports.atualizarPet = (req, res) => {
  const pets = carregarPets();
  const index = pets.findIndex((p) => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ mensagem: "Pet não encontrado" });
  }
  const validacao = Pet.validarDados(req.body);
  if (!validacao.valido) {
    return res.status(400).json({ mensagem: validacao.mensagem });
  }
  const petAtualizado = { ...pets[index], ...req.body };
  pets[index] = petAtualizado;
  salvarPets(pets);
  res.status(200).json(petAtualizado);
};

/**
 * @swagger
 * /pets/{id}:
 *   delete:
 *     summary: Deletar um pet pelo ID
 *     tags:
 *       - Pets
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do pet para ser deletado
 *         schema:
 *           type: int
 *     responses:
 *       204:
 *         description: Pet deletado
 *       404:
 *         description: Pet não encontrado
 */
// Controlador para deletar um pet
exports.deletarPet = (req, res) => {
  const pets = carregarPets();
  const novosPets = pets.filter((p) => p.id !== parseInt(req.params.id));
  if (novosPets.length === pets.length) {
    return res.status(404).json({ mensagem: "Pet não encontrado" });
  }
  salvarPets(novosPets);
  res.status(204).send("Pet deletado");
};
