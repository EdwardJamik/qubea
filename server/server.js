const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const authRoute = require('./Routes/auth.router');
const managerRoute = require('./Routes/manager.router');
const notificationRoute = require('./Routes/notification.router');
const multer = require("multer");
const fs = require("fs");
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

const imagesFolder = path.join(__dirname, 'uploads/product_image');

app.use('/images', express.static(imagesFolder));

//middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());

app.use(cors({
    origin: true,
    credentials: true,
}));


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/product_image/');
    },
    filename: function (req, file, cb) {
        const originalFileName = file.originalname;
        const ext = path.extname(originalFileName);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const newFileName = uniqueSuffix + ext;

        req.oldFileName = originalFileName;
        req.newFileName = newFileName;

        cb(null, newFileName);
    },
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
    res.json({ oldFileName: req.oldFileName, newFileName: req.newFileName });
});

app.post('/delete', async (req, res) => {
    const { filename } = req.body;

    if (!filename) {
        return res.status(400).send('Old file name not provided');
    }

    const filePath = path.join(__dirname, 'uploads/product_image', filename);

    try {
        await fs.unlinkSync(filePath);
        res.send('File deleted');
    } catch (error) {
        res.status(500).send('Error deleting file');
    }
});

app.use('/api/v1/', authRoute);
app.use('/api/v1/notification', notificationRoute);
app.use('/api/v1/manager', managerRoute);
app.use('*', (req, res) => res.status(404).json({ error: 'not found' }));

module.exports = app;
