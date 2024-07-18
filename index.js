const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const dotenv = require('dotenv');



dotenv.config();

// Adatbázis kapcsolat létrehozása pool használatával
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'mysql',
    database: process.env.DB_NAME || 'utolso_kitalysaghomework',
   
});

// Statikus fájlok szolgáltatása
app.use(express.static('static'));


app.set('view engine', 'ejs');


// Adatbázis kapcsolat ellenőrzése
db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database.');
    
});

// Index oldal: karakterek lekérése adatbázisból és megjelenítése
app.get('/', async (req, res) => {
    try {
        const data = {
            H1title: 'The Last Kingdom'
        };
        
        const [results, fields] = await db.execute('SELECT * FROM charters');
        data.charters = results;
        res.render('index', data);
    } catch (error) {
        console.error('Error querying database:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/charters/:id', async (req, res) => {
    const id = req.params.id;
    try {
       
        const [result, fields] = await db.execute('SELECT * FROM charters WHERE id = ?', [id]);
        if (result.length === 0) {
            return res.status(404).send('Character not found');
        }
        const data = {
            charter: result[0]
        };
        res.render('charters', data);
    } catch (error) {
        console.error('Error querying database:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Útvonalak definíciója
app.get('/castle-page', (req, res) => {
    res.render('castle', { H1title: 'The Last Kingdom' });
});

app.get('/episode-page', (req, res) => {
    res.render('episode', { H1title: 'The Last Kingdom' });
});

// Szerver indítása 
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});