require('dotenv').config(); // Carrega as variáveis do .env
const express = require('express');
const app = express();
const rotas = require('./src/routes'); // Importa o arquivo index.js da pasta routes

// Middleware para permitir receber JSON no corpo da requisição
app.use(express.json());

// Configura as rotas
app.use('/api', rotas);

// Rota raiz para verificar se a API está rodando
app.get('/', (req, res) => {
    res.send('API de Pets e Donos funcionando!');
});

// Configuração do tratamento de erros (opcional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado!'); // Mensagem de erro padrão
});

// Porta definida no arquivo .env, ou 3000 como fallback
const PORT = process.env.PORT || 3000;

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
