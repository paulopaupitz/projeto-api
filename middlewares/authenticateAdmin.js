require("dotenv").config();

const authenticateAdmin = (req, res, next) => {
  const token = req.headers["authorization"]; //pega o token do cabeçalho Authorization
  if (token === process.env.ADMIN_TOKEN) {
    next();
  } else {
    res
      .status(403)
      .send("Acesso negado: Apenas administradores podem acessar esta rota.");
  }
};

module.exports = authenticateAdmin;
