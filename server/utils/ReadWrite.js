const fs = require('fs').promises;
const path = require('path');
const asyncHandler = require('express-async-handler');
const filePath = path.join(__dirname, '../data/products.json');

// generate random id for products

const generateRandomId = () => Math.floor(Math.random() * 1000000);


// function to read products from the file
const readProductsFromFile = async () => {
  try {
    const productsData = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(productsData);
  } catch (error) {
    return [];
  }
};


// function to write the products in the file
const writeProductsToFile = async (products) => {
  await fs.writeFile(filePath, JSON.stringify(products, null, 2), 'utf8');
};


// endpoint to signup user
const createUser = asyncHandler((async(req,res) => {
    
}))
