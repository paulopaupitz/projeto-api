const express = require('express');
const userRoutes = require('./routes/userRoutes');
const petRoutes = require('./routes/petRoutes');
const donoRoutes = require('./routes/donoRoutes');
const restrictAccessMiddleware = require('./middlewares/restrictAccessMiddleware');

const app = express();
app.use(express.json());

app.use('/pets', petRoutes);
app.use('/donos', donoRoutes);
app.use('/users', restrictAccessMiddleware, userRoutes);


app.listen(3000, () => {
  console.log(`Servidor ouvindo a porta 3000`);
});