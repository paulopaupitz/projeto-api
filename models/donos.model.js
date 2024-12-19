class Dono {
  constructor(nome, telefone, endereco, pendencias) {
    this.id = null; // O ID será atribuído pelo controlador ao salvar
    this.nome = nome;
    this.telefone = telefone;
    this.endereco = endereco;
    this.pendencias = pendencias;
  }

  static validarDados(dados) {
    if (!dados.nome || typeof dados.nome !== "string") {
      return { valido: false, mensagem: "Nome inválido." };
    }
    if (!dados.telefone || typeof dados.telefone !== "string") {
      return { valido: false, mensagem: "Telefone inválido." };
    }
    if (!dados.endereco || typeof dados.endereco !== "string") {
      return { valido: false, mensagem: "Endereço inválido." };
    }
    return { valido: true };
  }
}

module.exports = Dono;
