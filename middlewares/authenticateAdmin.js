// Middleware para verificar se o usuário é administrador
function isAdmin(req, res, next) {
  // Verifica se o usuário autenticado é administrador
  if (!req.user || !req.user.admin) {
    return res.status(403).json({
      mensagem:
        "Acesso negado. Somente administradores podem acessar esta rota.",
    });
  }
  next(); // Permite o acesso se for administrador
}

module.exports = isAdmin;
