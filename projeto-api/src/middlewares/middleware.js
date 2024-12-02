// Middleware para validação do corpo da requisição
exports.validarRequisicao = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ mensagem: error.details[0].message });
        }
        next();
    };
};

// Middleware para autenticação usando JWT
token
const jwt = require('jsonwebtoken');

exports.autenticacao = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ mensagem: 'Token não fornecido' });
    }

    const token = authorization.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ mensagem: 'Token inválido ou expirado' });
        }
        req.usuario = decoded;
        next();
    });
};

// Middleware para log de requisições
exports.logger = (req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
};

// Middleware para tratamento de erros
exports.tratarErro = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ mensagem: 'Algo deu errado! Por favor, tente novamente mais tarde.' });
};
