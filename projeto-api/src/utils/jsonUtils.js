const fs = require('fs');
const path = require('path');

function readJSON(filePath) {
    try {
        const absolutePath = path.resolve(__dirname, filePath);
        const data = fs.readFileSync(absolutePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Erro ao ler o arquivo JSON: ${error.message}`);
        return [];
    }
}

function writeJSON(filePath, data) {
    try {
        const absolutePath = path.resolve(__dirname, filePath);
        fs.writeFileSync(absolutePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error(`Erro ao escrever no arquivo JSON: ${error.message}`);
    }
}

module.exports = { readJSON, writeJSON };