const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
    const { username, password } = req.body;

    // Aqui você faria a verificação do usuário e senha (no banco de dados, por exemplo)
    if (username === 'usuarioTeste' && password === 'senhaSegura') {
        // Gera o token se a autenticação for bem-sucedida
        const token = jwt.sign({ id: 1, username: 'usuarioTeste' }, process.env.JWT_SECRET, {
            expiresIn: '1h', // Token expira em 1 hora
        });
        return res.status(200).json({ token });
    } else {
        return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }
};
