class Admin {
  constructor(username, password, admin) {
    this.id = null;
    this.username = username;
    this.password = password;
    this.admin = admin;
  }

  static validarDados(dados) {
    if (!dados.username || typeof dados.username !== "string") {
      return { valido: false, mensagem: "Username inválido." };
    }
    if (!dados.password || typeof dados.password !== "string") {
      return { valido: false, mensagem: "Senha inválida." };
    }
    return { valido: true };
  }
}

module.exports = Admin;
