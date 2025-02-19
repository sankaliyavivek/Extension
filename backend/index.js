const express = require('express');
const app = express();

const cors =require('cors');

app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST','DELETE'],
        
    })
)
// app.use(cors);
app.use(express.json());
const port = 7000;

require('./connect');

const router = require('./router/extensionuser');
app.use('/extensionuser',router);

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
});

