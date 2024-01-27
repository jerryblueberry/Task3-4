const fs = require('fs').promises;
const path = require('path');
const asyncHandler = require('express-async-handler');

// Declare file path
const filePath = path.join(__dirname, '../data/carts.json');
const filePathProduct = path.join(__dirname, '../data/products.json');

// Generate random id for the cart item
const generateRandomId = () => Math.floor(Math.random() * 1000);

// Function to read the cart data
const readCartsFromFile = async () => {
  try {
    const cartData = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(cartData);
  } catch (error) {
    console.log('Error occurred while reading file', error);
    return [];
  }
};

// Function to read products from the data
const readProductsFromFile = async () => {
  try {
    const productData = await fs.readFile(filePathProduct, 'utf-8');

    // Check if the file is not empty
    if (!productData.trim()) {
      console.log('Error: Products file is empty');
      return [];
    }

    return JSON.parse(productData);
  } catch (error) {
    console.log('Error occurred while reading file', error);
    return [];
  }
};

// Function to write the cart data
const writeCartsToFile = async (carts) => {
  await fs.writeFile(filePath, JSON.stringify(carts, null, 2), 'utf8');
};

// Endpoint to add products to cart
const addCart = asyncHandler(async (req, res) => {
  try {
    const { userId, product, quantity } = req.body;

    // Find the user's carts or create a new array if it does not exist
    let carts = await readCartsFromFile();

    const index = carts.findIndex((cart) => cart.userId === userId);
    const cartId = generateRandomId();

    let newCart;

    if (index === -1) {
      // It means the user does not have a cart
      // Create a new one
      newCart = {
        id: cartId,
        userId,
        products: [{ product, quantity }],
        total_price: 0, // Set total_price to 0
      };
      carts.push(newCart);
    } else {
      const existingProductIndex = carts[index].products.findIndex(
        (item) => item.product === product
      );

      if (existingProductIndex !== -1) {
        // If the product already exists, update the quantity
        carts[index].products[existingProductIndex].quantity += parseInt(
          quantity,
          10
        );
      } else {
        // If the product doesn't exist, add it to the cart with the specified quantity
        carts[index].products.push({
          product,
          quantity: parseInt(quantity, 10),
        });
      }
      newCart = carts[index];
    }

    const products = await readProductsFromFile();

    // Calculate the total price
    // Since every product has the "price" field
    // Calculate the total price
    // Since every product has the "price" field
    newCart.total_price = products.reduce((total, product) => {
      const cartProduct = newCart.products.find(
        (p) => p && p.product === product.id
      );
      const productPrice =
        typeof product.price === 'number'
          ? product.price
          : parseFloat(product.price);

      return (
        total +
        productPrice *
          (cartProduct && cartProduct.quantity ? cartProduct.quantity : 0)
      );
    }, 0);

    console.log('new cart', newCart);

    await writeCartsToFile(carts);

    res.status(200).json(newCart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = { addCart };
