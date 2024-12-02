const express = require('express');
const userRoutes = require('./routes/userRoutes');
const petRoutes = require('./routes/petRoutes');
const donoRoutes = require('./routes/donoRoutes');
const restrictAccessMiddleware = require('./middlewares/restrictAccessMiddleware');
const validateDataMiddleware = require('./middlewares/validateDataMiddleware');
const errorHandlerMiddleware = require('./middlewares/errorHandlerMiddleware');

const app = express();
app.use(express.json());
app.use(validateDataMiddleware);

app.use('/pets', restrictAccessMiddleware, petRoutes);
app.use('/donos', restrictAccessMiddleware, donoRoutes);
app.use('/users', restrictAccessMiddleware, userRoutes);

app.use(errorHandlerMiddleware);

// Inicialização do servidor
app.listen(3000, () => {
  console.log('Servidor ouvindo a porta 3000');
});
