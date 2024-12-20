const fs = require("fs");
const path = require("path");
const Dono = require("../models/donos.model");
const Pet = require("../models/pet.models");

// Caminho do arquivo JSON onde os dados dos donos estão armazenados
const dbPath = path.join(__dirname, "../data/donos.json");

// Caminho do arquivo JSON onde os dados dos pets estão armazenados
const petsDbPath = path.join(__dirname, "../data/pets.json");

// Função para carregar os donos do JSON
const carregarDonos = () => {
  if (fs.existsSync(dbPath)) {
    const dadosBrutos = fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(dadosBrutos);
  }
  return [];
};

// Função para salvar os donos no arquivo JSON
const salvarDonos = (dados) => {
  const dadosFormatados = JSON.stringify(dados, null, 2);
  fs.writeFileSync(dbPath, dadosFormatados);
};

// Função para carregar os pets do arquivo JSON
const carregarPets = () => {
  if (fs.existsSync(petsDbPath)) {
    const dadosBrutos = fs.readFileSync(petsDbPath, "utf-8");
    return JSON.parse(dadosBrutos);
  }
  return [];
};

// Função para salvar os pets no arquivo JSON
const salvarPets = (dados) => {
  const dadosFormatados = JSON.stringify(dados, null, 2);
  fs.writeFileSync(petsDbPath, dadosFormatados);
};

/**
 * Admitir o pet no estabelecimento
 * @swagger
 * /actions/admitir:
 *   post:
 *     summary: Admitir o pet no petshop.
 *     tags:
 *       - Action
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               petId:
 *                 type: integer
 *                 description: ID do pet a ser admitido.
 *               precoServico:
 *                 type: number
 *                 description: Valor do serviço prestado.
 *     responses:
 *       200:
 *         description: Pet admitido com sucesso.
 */
exports.admitirPet = (req, res) => {
  const { petId, precoServico } = req.body;

  const pets = carregarPets();
  const donos = carregarDonos();

  const pet = pets.find((p) => p.id === petId);
  if (!pet) {
    return res.status(404).json({ message: "Pet não encontrado." });
  }

  const dono = donos.find((d) => d.id === pet.donoId);
  if (!dono) {
    return res.status(404).json({ message: "Dono não encontrado." });
  }

  // Verificar se o dono tem pendências
  if (dono.pendencias > 0) {
    return res.status(400).json({
      message:
        "O pet não pode ser admitido porque o dono possui pendências financeiras.",
      pendencias: dono.pendencias,
    });
  }

  // Admitir o pet no estabelecimento
  pet.noPetshop = true;
  dono.pendencias += precoServico;

  salvarPets(pets);
  salvarDonos(donos);

  res.status(200).json({ message: "Pet admitido com sucesso." });
};

/**
 * Retirar o pet do estabelecimento
 * @swagger
 * /actions/retirar:
 *   post:
 *     summary: Retirar o pet do petshop.
 *     tags:
 *       - Action
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               petId:
 *                 type: integer
 *                 description: ID do pet a ser retirado.
 *               valorPago:
 *                 type: number
 *                 description: Valor pago pelo dono na retirada.
 *     responses:
 *       200:
 *         description: Pet retirado com sucesso.
 */
exports.retirarPet = (req, res) => {
  const { petId, valorPago } = req.body;

  const pets = carregarPets();
  const donos = carregarDonos();

  const pet = pets.find((p) => p.id === petId);
  if (!pet) {
    return res.status(404).json({ message: "Pet não encontrado." });
  }

  const dono = donos.find((d) => d.id === pet.donoId);
  if (!dono) {
    return res.status(404).json({ message: "Dono não encontrado." });
  }

  // Certifique-se de que `pendencias` seja inicializado
  if (typeof dono.pendencias !== "number") {
    dono.pendencias = 0; // Valor padrão se `pendencias` não estiver definido
  }

  // Atualize a pendência do dono
  dono.pendencias -= valorPago;

  // Atualize o status do pet
  pet.noPetshop = false;

  salvarPets(pets);
  salvarDonos(donos);

  res.status(200).json({
    message: "Pet retirado com sucesso.",
    pendenciasAtualizadas: dono.pendencias, // Retorne o valor atualizado para verificar
  });
};

/**
 * Quitar pendências do dono
 * @swagger
 * /actions/quitar:
 *   post:
 *     summary: Quitar pendências do dono.
 *     tags:
 *       - Action
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               donoId:
 *                 type: integer
 *                 description: ID do dono que está quitando pendências.
 *               valorQuitado:
 *                 type: number
 *                 description: Valor que está sendo quitado.
 *     responses:
 *       200:
 *         description: Pendências quitadas com sucesso.
 */
exports.quitarPendencias = (req, res) => {
  const { donoId, valorQuitado } = req.body;

  const donos = carregarDonos();

  const dono = donos.find((d) => d.id === donoId);
  if (!dono) {
    return res.status(404).json({ message: "Dono não encontrado." });
  }

  dono.pendencias -= valorQuitado;

  salvarDonos(donos);

  res.status(200).json({ message: "Pendências quitadas com sucesso." });
};
