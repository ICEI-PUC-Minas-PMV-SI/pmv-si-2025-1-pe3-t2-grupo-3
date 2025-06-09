require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

let usersDB = [];
try {
    const usersPath = path.join(__dirname, '..', 'users.json');
    const rawUsers = fs.readFileSync(usersPath);
    usersDB = JSON.parse(rawUsers);
    console.log('Usuários carregados para simulação no backend do users.json.');
} catch (error) {
    console.error('Erro ao carregar users.json para o backend (simulação). Verifique o caminho e a existência do arquivo:', error.message);
    usersDB = [];
}

app.get('/', (req, res) => {
    res.send('Backend do FUTURE STREAMING está funcionando!');
});

app.get('/api/movies/popular', async (req, res) => {
    if (!TMDB_API_KEY) {
        return res.status(500).json({ error: 'TMDB_API_KEY não configurada no ambiente.' });
    }
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
            params: {
                api_key: TMDB_API_KEY,
                language: 'pt-BR',
                page: req.query.page || 1
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Erro ao buscar filmes populares da TMDB:', error.message);
        if (error.response) {
            console.error('Dados do erro da resposta:', error.response.data);
            console.error('Status do erro da resposta:', error.response.status);
        }
        res.status(500).json({ error: 'Erro ao buscar filmes populares.' });
    }
});

app.get('/api/movies/top-rated', async (req, res) => {
    if (!TMDB_API_KEY) {
        return res.status(500).json({ error: 'TMDB_API_KEY não configurada no ambiente.' });
    }
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/top_rated`, {
            params: {
                api_key: TMDB_API_KEY,
                language: 'pt-BR',
                page: req.query.page || 1
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Erro ao buscar filmes top-rated da TMDB:', error.message);
        if (error.response) {
            console.error('Dados do erro da resposta:', error.response.data);
            console.error('Status do erro da resposta:', error.response.status);
        }
        res.status(500).json({ error: 'Erro ao buscar filmes em destaque.' });
    }
});

app.get('/api/movies/by-genre/:genreId', async (req, res) => {
    if (!TMDB_API_KEY) {
        return res.status(500).json({ error: 'TMDB_API_KEY não configurada no ambiente.' });
    }
    const genreId = req.params.genreId;
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
            params: {
                api_key: TMDB_API_KEY,
                language: 'pt-BR',
                with_genres: genreId,
                sort_by: 'popularity.desc',
                page: req.query.page || 1
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error(`Erro ao buscar filmes por gênero ${genreId} da TMDB:`, error.message);
        if (error.response) {
            console.error('Dados do erro da resposta:', error.response.data);
            console.error('Status do erro da resposta:', error.response.status);
        }
        res.status(500).json({ error: 'Erro ao buscar filmes por gênero.' });
    }
});

app.get('/api/movies/by-year/:year', async (req, res) => {
    if (!TMDB_API_KEY) {
        return res.status(500).json({ error: 'TMDB_API_KEY não configurada no ambiente.' });
    }
    const year = req.params.year;
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
            params: {
                api_key: TMDB_API_KEY,
                language: 'pt-BR',
                primary_release_year: year,
                sort_by: 'popularity.desc',
                page: req.query.page || 1
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error(`Erro ao buscar filmes do ano ${year} da TMDB:`, error.message);
        if (error.response) {
            console.error('Dados do erro da resposta:', error.response.data);
            console.error('Status do erro da resposta:', error.response.status);
        }
        res.status(500).json({ error: 'Erro ao buscar filmes por ano.' });
    }
});

app.get('/api/genres', async (req, res) => {
    if (!TMDB_API_KEY) {
        return res.status(500).json({ error: 'TMDB_API_KEY não configurada no ambiente.' });
    }
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
            params: {
                api_key: TMDB_API_KEY,
                language: 'pt-BR'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Erro ao buscar gêneros da TMDB:', error.message);
        if (error.response) {
            console.error('Dados do erro da resposta:', error.response.data);
            console.error('Status do erro da resposta:', error.response.status);
        }
        res.status(500).json({ error: 'Erro ao buscar gêneros.' });
    }
});

app.get('/api/tv/popular', async (req, res) => {
    if (!TMDB_API_KEY) {
        return res.status(500).json({ error: 'TMDB_API_KEY não configurada no ambiente.' });
    }
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/tv/popular`, {
            params: {
                api_key: TMDB_API_KEY,
                language: 'pt-BR',
                page: req.query.page || 1
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Erro ao buscar séries populares da TMDB:', error.message);
        if (error.response) {
            console.error('Dados do erro da resposta:', error.response.data);
            console.error('Status do erro da resposta:', error.response.status);
        }
        res.status(500).json({ error: 'Erro ao buscar séries populares.' });
    }
});

app.post('/api/login', async (req, res) => {
    const { emailOrUsername, hashedPassword } = req.body;

    const user = usersDB.find(u =>
        (u.email === emailOrUsername || u.username === emailOrUsername) &&
        u.password === hashedPassword
    );

    if (user) {
        const safeUser = { ...user };
        delete safeUser.password;

        res.json({ message: 'Login bem-sucedido!', user: safeUser });
    } else {
        res.status(401).json({ error: 'Credenciais inválidas.' });
    }
});

app.post('/api/register', async (req, res) => {
    const { name, email, hashedPassword, username, memberSince, avatar } = req.body;

    if (usersDB.some(u => u.email === email)) {
        return res.status(409).json({ error: 'Este e-mail já está cadastrado.' });
    }

    const newUser = {
        id: 'user' + (usersDB.length > 0 ? (parseInt(usersDB[usersDB.length - 1].id.replace('user', '')) + 1) : 1),
        email: email,
        username: username,
        password: hashedPassword,
        profile: {
            name: name,
            memberSince: memberSince,
            avatar: avatar
        },
        moodPreferences: ""
    };

    usersDB.push(newUser);
    try {
        fs.writeFileSync(path.join(__dirname, '..', 'users.json'), JSON.stringify(usersDB, null, 2));
        console.log('Novo usuário salvo no users.json (simulação de persistência).');
    } catch (writeError) {
        console.error('Erro ao salvar users.json após cadastro:', writeError.message);
    }

    const safeUser = { ...newUser };
    delete safeUser.password;

    res.status(201).json({ message: 'Cadastro realizado com sucesso!', user: safeUser });
});

app.put('/api/users/:userId', async (req, res) => {
    const userId = req.params.userId;
    const { newFullName, newUsername, newPassword, avatar } = req.body;

    const userIndex = usersDB.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    if (newFullName) usersDB[userIndex].profile.name = newFullName;
    if (newUsername) usersDB[userIndex].username = newUsername;
    if (newPassword) usersDB[userIndex].password = newPassword;
    if (avatar) usersDB[userIndex].profile.avatar = avatar;

    try {
        fs.writeFileSync(path.join(__dirname, '..', 'users.json'), JSON.stringify(usersDB, null, 2));
        console.log('Perfil do usuário atualizado no users.json (simulação de persistência).');
    } catch (writeError) {
        console.error('Erro ao salvar users.json após atualização de perfil:', writeError.message);
    }

    const safeUser = { ...usersDB[userIndex] };
    delete safeUser.password;

    res.json({ message: 'Perfil atualizado com sucesso!', user: safeUser });
});

app.listen(PORT, () => {
    console.log(`Servidor backend rodando em http://localhost:${PORT}`);
});