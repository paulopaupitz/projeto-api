const fs = require("fs").promises;
const jwt = require("jsonwebtoken");

// função para gerar o token
const generateToken = (user) => {
  // define as informações que serão guardadas no token
  const payload = {
    id: user.id,
    username: user.username,
    isAdmin: user.isAdmin,
  };

  // gera o token
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TIME,
  });
};

// função para realizar login
exports.login = async (username, password) => {
  try {
    const data = await fs.readFile("./data/admins.json", "utf-8");
    const users = JSON.parse(data);

    const user = users.find((u) => u.username === username);

    if (!user || user.password !== password) {
      return null;
    }

    return generateToken(user);
  } catch (error) {
    return null;
  }
};
