const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const multer = require('multer'); // Kuvan lataus
require('dotenv').config();

const app = express();
const PORT = 3000;

// Multer asetus - tallennetaan kuvat images/ kansioon 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'kuvat/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Uniikki nimi
    }
});
const upload = multer({ storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 60 * 1000 }
}));

// Estetään Admin.html suora avaaminen ENNEN express.static
app.get('/Admin.html', (req, res) => {
    res.redirect('/login.html');
});
app.get('/admin.html', (req, res) => {
    res.redirect('/login.html');
});
app.use(express.static(path.join(__dirname)));

function suojattu(req, res, next) {
    if (!req.session.loggedIn) {
        return res.redirect('/login.html');
    }
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
}

// Etusivu
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'HomePage.html'));
});


// Admin sivu (suojattu)
app.get('/admin', suojattu, (req, res) => {
    res.sendFile(path.join(__dirname, 'Admin.html'));
});

// Login
app.post('/login', async (req, res) => {
    const syote = req.body.salasana;
    const ok = await bcrypt.compare(syote, process.env.PASSWORD_HASH);
    if (ok) {
        req.session.loggedIn = true;
        res.redirect('/admin');
    } else {
        res.redirect('/login.html?error=1');
    }
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login.html');
});

// Hae kasvit
app.get('/plants', (req, res) => {
    const data = fs.readFileSync('kasvit/kasvit.json', 'utf-8');
    res.json(JSON.parse(data));
});

// Lisää kasvi + kuva (suojattu)
app.post('/plants', suojattu, upload.single('image'), (req, res) => {
    const plants = JSON.parse(fs.readFileSync('kasvit/kasvit.json', 'utf-8'));
    const newPlant = {
        id: plants.length + 1,
        name: req.body.name,
        color: req.body.color,
        material: req.body.material,
        description: req.body.description,
        image: req.file ? 'kuvat/' + req.file.filename : ''
    };
    plants.push(newPlant);
    fs.writeFileSync('kasvit/kasvit.json', JSON.stringify(plants, null, 2));
    res.json(newPlant);
});

// Poista kasvi (suojattu)
app.delete('/plants/:id', suojattu, (req, res) => {
    let plants = JSON.parse(fs.readFileSync('kasvit/kasvit.json', 'utf-8'));
    plants = plants.filter(p => p.id !== parseInt(req.params.id));
    fs.writeFileSync('kasvit/kasvit.json', JSON.stringify(plants, null, 2));
    res.json({ message: 'Plant deleted' });
});

app.listen(PORT, () => {
    console.log(`Palvelin käynnissä: http://localhost:${PORT}`);
});