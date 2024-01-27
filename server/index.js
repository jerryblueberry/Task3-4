const express = require('express');
const user = require('./routes/user');
const cart = require('./routes/cart');
const product = require('./routes/product');
const bodyParser = require('body-parser');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());

const PORT = 8080;


app.use('/products',product);
app.use('/users',user);
app.use('/carts',cart)


app.listen(PORT,() =>{
    console.log(`Listening on Port ${PORT}`);

})