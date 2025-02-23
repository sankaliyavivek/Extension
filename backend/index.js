const express = require('express');
const cors = require('cors');

const app = express();

// ✅ Properly configure CORS
const corsOptions = {
    origin: ['http://localhost:5173', 'https://myextensionproject.netlify.app'], // Added "https://"
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

// Apply CORS middleware globally
app.use(cors(corsOptions));

// ✅ Explicitly handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json());

const port = 7000;
require('./connect');

const router = require('./router/extensionuser');
app.use('/extensionuser', router);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
