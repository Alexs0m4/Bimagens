const express = require('express');
const morgan = require('morgan');
const multer = require('multer');
const uuid = require('uuid/v4');
const { format } = require('timeago.js');
//
const jwt = require("jsonwebtoken");
const path = require('path');

// intializations
const app = express();
require('./database');

//Token o autenticación LOGIN 

app.post("/login", (req , res) => {
    const user = {
        nombre: "mageAdmin",
        clave: "12345"
    }

    jwt.sign({user}, 'secretkey', {expiresIn: '60m'}, (err, token) => {
        res.json({ 
            token
        });
    });

});

app.post("/posts", verifyToken, (req , res) => {
       
        jwt.verify(req.token, 'secretkey', (error, authData) => {
            if(error){
                res.sendStatus(403);
            }else{
                res.json({
                    mensaje: "Usuario con acceso",
                    authData
                });
            }
        });
    });

    //Autorización: Bearer <token>

    function verifyToken (req, res, next){
        const bearerHeader = req.headers['authorization'];
    
        if(typeof bearerHeader !== 'undefined'){
            const bearerToken = bearerHeader.split(" ")[1];
            req.token = bearerToken
            next();
        }else{
            res.sendStatus(403);
        }
    }

// settings
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);

// middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/img/uploads'),
    filename: (req, file, cb, filename) => {
        console.log(file);
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
}) 
app.use(multer({storage}).single('image'));

// Global variables
app.use((req, res, next) => {
    app.locals.format = format;
    next();
});

// routes
app.use(require('./routes/index'));

// static files
app.use(express.static(path.join(__dirname, 'public')));

// start
app.listen(3000, () => {
    console.log(`Server on port ${app.get('port')}`);
});
