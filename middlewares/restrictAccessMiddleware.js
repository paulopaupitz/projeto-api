const jwt = require('jsonwebtoken');
const jwtUtils = require('../utils/jwtUtils');

const restrictAccessMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado: token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, jwtUtils.secretKey); // jwtUtils.secretKey contém a chave secreta usada para gerar os tokens
    req.user = decoded; // Armazena as informações do usuário decodificadas no request
    next(); // Permite que o próximo middleware ou controlador seja chamado
  } catch (error) {
    res.status(403).json({ message: 'Acesso negado: token inválido.' });
  }
};

module.exports = restrictAccessMiddleware;
