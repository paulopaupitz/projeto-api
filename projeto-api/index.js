require('dotenv').config(); // Carrega as variáveis do .env
const express = require('express');
const app = express();

// Importa os arquivos de rotas específicos
const donoRoutes = require('./src/routes/donos.routes');
const petRoutes = require('./src/routes/pets.routes');
const adminRoutes = require('./src/routes/admin.routes');
const authenticateAdmin = require('./src/middlewares/authenticateAdmin');




app.use(express.json());
// Configura as rotas
app.use('/donos', donoRoutes); // Rotas para donos
app.use('/pets', petRoutes);  // Rotas para pets
app.use('/admin', authenticateAdmin, adminRoutes); //ademirs



// roota raiz
app.get('/', (req, res) => {
    res.send('API de Pets e Donos funcionando!');
});

// tratar erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado!');                   // erro
});



// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
