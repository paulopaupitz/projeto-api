const Admin = require("../models/admin.model");
const { readJSON, writeJSON } = require("../utils/jsonUtils");
const adminFilePath = "../data/admins.json";

const adminController = {
  criarAdmin: (req, res) => {
    const dados = req.body;
    const validacao = Admin.validarDados(dados);

    if (!validacao.valido) {
      return res.status(400).send(validacao.mensagem);
    }

    const admins = readJSON(adminFilePath);
    const adminExists = admins.find(
      (admin) => admin.username === dados.username
    );

    if (adminExists) {
      return res.status(400).send("Administrador já existe.");
    }

    const newAdmin = new Admin(dados.username, dados.password);
    newAdmin.id = Date.now(); // Gerar ID único
    admins.push(newAdmin);
    writeJSON(adminFilePath, admins);

    res.status(201).send("Administrador criado com sucesso.");
  },
};

module.exports = adminController;
