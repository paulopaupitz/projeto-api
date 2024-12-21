const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET || "segredo";

function authenticateToken(req, res, next) {
  // Obtém o token do cabeçalho "Authorization"
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // Verifica se o token foi fornecido
  if (!token) {
    return res
      .status(401)
      .json({ mensagem: "Token de autenticação não fornecido." });
  }

  // Verifica e valida o token
  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ mensagem: "Token inválido ou expirado." });
    }

    // Adiciona as informações do usuário à requisição
    req.user = user;
    next(); // Permite o acesso
  });
}

module.exports = authenticateToken;
