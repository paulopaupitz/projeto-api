const authService = require("../services/authServise");

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza o login de um usuário.
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: "Nome de usuário."
 *                 example: "admin"
 *               password:
 *                 type: string
 *                 description: "Senha do usuário."
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: "Login realizado com sucesso. Retorna o token de autenticação."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: "Token JWT gerado para o usuário."
 *       401:
 *         description: "Credenciais inválidas."
 */

exports.login = async (req, res) => {
  const { username, password } = req.body;

  // chama a função de login
  const token = await authService.login(username, password);

  // verifica se há um token
  if (token == null) {
    return res.status(401).json({ message: "Credenciais inválidas." });
  }

  return res.status(200).json({ token });
};
