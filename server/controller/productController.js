
const fs = require('fs').promises;
const path = require('path');
const asyncHandler = require('express-async-handler');


// declare the file path
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


// endpoint to add products

const addProducts =  asyncHandler(async (req, res) => {
    const { name, price, description, quantity, product_type } = req.body;

    try {
      const products = await readProductsFromFile();
  
      if (!name || !price || !description || !quantity || !product_type) {
        return res.status(400).json({ error: 'All the fields are required' });
      }
    
      const productId = generateRandomId();
    
      const newProduct = {
        id: productId,
        name,
        price,
        description,
        quantity,
        product_type,
      };
    
      products.push(newProduct);
    
      await writeProductsToFile(products);
    
      res.status(201).json(newProduct);
      
    } catch (error) {
      console.log("Error occurred",error);
      res.status(500).json({message:"Inernal Server Error",error});
      
    }
  
 
  });


//    for getting the product but later add the search and sorting logic
const getProducts = asyncHandler(async (req, res) => {
    const { search, sort, filter } = req.query;

    try {
      let products = await readProductsFromFile();
  
      // Function to search products by name or description
      const searchProducts = (products, search) => {
        return search
          ? products.filter(
              (product) =>
                product.name.toLowerCase().includes(search) || product.description.toLowerCase().includes(search)
            )
          : products;
      };
    
      // Function to sort products by price
      const sortProducts = (products, sort) => {
        return sort === 'price'
          ? [...products].sort((a, b) => a.price - b.price)
          : products;
      };
    
      // Function to filter products by product type
      const filterProducts = (products, filter) => {
        return filter
          ? products.filter(
              (product) => product.product_type.toLowerCase() === filter
            )
          : products;
      };
    
      // Apply search, sort, and filter
      products = searchProducts(products, search);
      products = sortProducts(products, sort);
      products = filterProducts(products, filter);
      
      if(products.length === 0 ){
        return res.status(404).json({message:"Products not available"});
      }
    
      res.status(200).json(products);
      
    } catch (error) {
      console.log("Error Occurred While fetching products",error);
      res.status(500).json({message:"Internal Server Error",error});
      
    }

  
   
  });


  // endpoint to get product by id

  const getProductById = asyncHandler(async(req,res) => {
    const productId = parseInt(req.params.productId);

    try {
      const products = await readProductsFromFile();

      const index = products.findIndex(product => product.id === productId);

      if(index === -1){
        return res.status(404).json({message:"Product not found"});


      }
      res.status(200).json(products[index]);

    } catch (error) {
      
    }
  })
  


// endpoint to delete product by id
const deleteProduct = asyncHandler(async(req,res) => {
    const productId = parseInt(req.params.productId);

    try {
        const products = await readProductsFromFile();
        // find the index of the prodct with the given id
        const index  = products.findIndex(product => product.id === productId);


        if(index === -1){
            res.status(404).json({message:"Product not found!"});
        }else{
            products.splice(index,1);

            await writeProductsToFile(products);

            res.status(200).json({message:"Product deleted Successfully"});
        }
    } catch (error) {
        console.log("Error",error);
        res.status(500).json({message:"Internal Server Error"});
    }
});


//  endpoint for getting stocks of products

const getStock = asyncHandler(async(req,res) => {
    try {
       const products = await readProductsFromFile();
       const outofStock = products.filter(product => product.quantity < 5);
       res.status(200).json(outofStock);
    } catch (error) {
        console.log("Internal Server Error",error);
       res.status(400).json({message:"Error finding the products"}); 
    }
});

//  endpoint to update all the fileds using put
const updateProduct  = asyncHandler(async(req,res) => {
    const productId  = parseInt(req.params.productId);
    const updatedProduct = req.body;

    try {
        const products = await readProductsFromFile();
        const index = products.findIndex(product => product.id === productId);

        if(index === -1){
            return res.status(404).json({message:"Product not found"});
        }

        products[index] = {...products[index],...updatedProduct};
        await writeProductsToFile(products);

        res.status(201).json({message:"Product updated Successfullyy",updateProduct:products[index]})
    } catch (error) {
        console.log("Internal Server Error",error);
        res.status(400).json({message:"Error occurred when updating product"})
        
    }
});


//  endpoint to patch the products quantity
const patchProducts = asyncHandler(async(req,res) => {
    const productId = parseInt(req.params.productId);
    const {quantity} = req.body;
    try {
        const products = await readProductsFromFile();
        const index = products.findIndex(product => product.id === productId);


        if(index === -1){
            return res.status(404).json({message:"Product not found"});

        }
        products[index].quantity = quantity;

        await writeProductsToFile(products);
        res.status(200).json({message:"Product Quantity patch successfully",updatedProduct:products[index]});
    } catch (error) {
        
    }
})



module.exports = {getProducts,getProductById,addProducts,deleteProduct,getStock,updateProduct,patchProducts}