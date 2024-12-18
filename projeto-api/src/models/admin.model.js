class Admin {
    constructor(username, password) {
        this.id = null; // O ID será atribuído pelo controlador ao salvar
        this.username = username;
        this.password = password;
    }

    static validarDados(dados) {
        if (!dados.username || typeof dados.username !== 'string') {
            return { valido: false, mensagem: "Username inválido." };
        }
        if (!dados.password || typeof dados.password !== 'string') {
            return { valido: false, mensagem: "Senha inválida." };
        }
        return { valido: true };
    }
}

module.exports = Admin;
