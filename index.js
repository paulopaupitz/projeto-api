require("dotenv").config(); // Carrega as variáveis do .env
const express = require("express");
const bodyParser = require("body-parser");

const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const app = express();

// Importa os arquivos de rotas específicos
const donoRoutes = require("./routes/donos.routes");
const petRoutes = require("./routes/pets.routes");
const adminRoutes = require("./routes/admin.routes");
const authRoutes = require("./routes/auth.routes");
const acoesRoutes = require("./routes/actionsPetshop.routes");
const authenticateAdmin = require("./middlewares/authenticateAdmin");

app.use(express.json());
// Configura as rotas
app.use("/donos", donoRoutes); // Rotas para donos
app.use("/pets", petRoutes); // Rotas para pets
app.use("/admin", authenticateAdmin, adminRoutes); //admins
app.use("/auth", authRoutes); //auth
app.use("/actions", acoesRoutes); //actions

// Configurações do Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Minha API",
      version: "1.0.0",
      description: "Documentação da API usando Swagger",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./controllers/*.js"],
};

// Gerar a documentação com base nas opções
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Rota do Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// roota raiz
app.get("/", (req, res) => {
  res.send("API de Pets e Donos funcionando!");
});

// tratar erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Algo deu errado!"); // erro
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
