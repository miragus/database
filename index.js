const express = require('express');
const { Pool } = require('pg');
const path = require('path');
//Criar uma aplicação express
const app = express();
//Define a porta em que o servidor irá escutar
const port = 3000;


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'bancoDeDados',
    password: 'BemVindo!',
    port: 5432,
});


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));


//Rota para server a página html principal
app.get('/', (req,res) =>{
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})


//Rota para cadastrar um veículo
app.post('/veiculos', async (req, res) =>{
     const {marca, modelo, ano} = req.body;
     const queryText = 'INSERT INTO veiculos(marca, modelo, ano) VALUES ($1, $2, $3) RETURNING *'
     const values = [marca, modelo, ano];

     try{
        const result = await pool.query(queryText, values);
        res.status(201).json(result.rows[0]);
     } catch (err){
        console.error('Erro ao cadastrar veiculo:', err);
        res.status(500).send('Erro interno ao processar a solicitação')
     }
});


//Rota para consultar todos os veiculos
app.get('/veiculos', async (req, res) =>{
    try{
        const result = await pool.query('SELECT * FROM veiculos')
        res.json(result.rows);
    } catch (err){
        res.status(400).send(err);
    }
});


// Inicia o servidor 
app.listen(port, ()=>{
    console.log(`Servidor rodando em http://localhost:${port}`);
});