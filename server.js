const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para consultas
app.post('/query', async (req, res) => {
    const { username, password, query } = req.body;
    console.log('Recebida requisição:', { username, query });

    if (!username || !password || !query) {
        return res.status(400).json({
            message: 'Usuário, senha e query são obrigatórios'
        });
    }

    // Validação básica de segurança
    if (!query.toLowerCase().trim().startsWith('select')) {
        return res.status(403).json({
            message: 'Apenas consultas SELECT são permitidas'
        });
    }

    let connection;
    try {
        connection = await mysql.createConnection({
            host: 'holymolly.mysql.database.azure.com',
            user: Guilherme,
            password: password,
            ssl: { rejectUnauthorized: false }
        });

        const [results] = await connection.execute(query);
        res.json(results);

    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({
            message: error.message
        });
    } finally {
        if (connection) {
            try {
                await connection.end();
            } catch (err) {
                console.error('Erro ao fechar conexão:', err);
            }
        }
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});