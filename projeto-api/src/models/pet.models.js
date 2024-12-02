class Pet {
    constructor(nome, especie, idade, donoId) {
        this.id = null; // O ID será atribuído pelo controlador ao salvar
        this.nome = nome;
        this.especie = especie;
        this.idade = idade;
        this.donoId = donoId; // Relacionamento com o Dono
    }

    static validarDados(dados) {
        if (!dados.nome || typeof dados.nome !== 'string') {
            return { valido: false, mensagem: "Nome do pet inválido." };
        }
        if (!dados.especie || typeof dados.especie !== 'string') {
            return { valido: false, mensagem: "Espécie inválida." };
        }
        if (!Number.isInteger(dados.idade) || dados.idade < 0) {
            return { valido: false, mensagem: "Idade inválida." };
        }
        if (!dados.donoId || typeof dados.donoId !== 'number') {
            return { valido: false, mensagem: "DonoId inválido." };
        }
        return { valido: true };
    }
}

module.exports = Pet;
