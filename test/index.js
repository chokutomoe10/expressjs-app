const express = require('express');
const router = require('./routes');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(router);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})