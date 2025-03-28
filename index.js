const express = require('express')
const config = require('./models/config');
const cors = require('cors');
const process = require('process');
const dotenv = require('dotenv');
const path = require('path');
const router = require('./routes/auth');

dotenv.config();
config();
const app = express();
const PORT = process.env.PORT ||5000;;

app.use(express.json());
app.use(cors());

app.use('/api/auth',require('./routes/auth'));
app.use('/api/hnotes',require('./routes/hnotes'));
app.use('/api/feedback',require('./routes/feedback'));

app.get('/',(req,res)=>{
    res.send("Open Your Hearts is running successfully");
})
app.listen(PORT,()=>{
    console.log(`Open Your Heart app is listening at http://localhost:${PORT}`);
})