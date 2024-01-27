const fs = require('fs').promises;
const path = require('path');
const asyncHandler = require('express-async-handler');

// declare the file path
const filePath = path.join(__dirname, '../data/users.json');

// generate random id for products

const generateRandomId = () => Math.floor(Math.random() * 1000000);


// function to read users from the file
const readUsersFromFile = async () => {
  try {
    const userData = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(userData);
  } catch (error) {
    return [];
  }
};


// function to write the users in the file
const writeUsersToFile = async (users) => {
  await fs.writeFile(filePath, JSON.stringify(users, null, 2), 'utf8');
};



// endpoint for creating user
const signUpUser   = asyncHandler(async(req,res) => {
  const {name,email,password} = req.body;
  try {
    if(!name || !email || !password){
      return res.status(400).json({message:"All the fields are required"});

    }

    const users = await readUsersFromFile();

    const index = users.findIndex(user => user.email === email);

    if(index !== -1){
      return res.status(400).json({message:"Email already exists. Login Instead!"});

    }

    const UserId = generateRandomId();

    const newUser = {
      id:UserId,
      name:req.body.name,
      email:req.body.email,
      password:req.body.name,
    }


    users.push(newUser);


    await writeUsersToFile(users);

    res.status(200).json({message:"SignUp Successfull"});





  } catch (error) {
    res.status(500).json({error:error.message});
  }
})

//  endpoint for login
const signInUser = asyncHandler(async(req,res) => {
    const {email,password} =  req.body;

    try {
        if(!email || !password){
            return res.status(400).json({message:"Email and Password are required!"});

        }

        const users = await readUsersFromFile();

        const index = users.findIndex(user => user.email === email);

        if(index === -1){
            return res.status(404).json({message:'User not Found'});

        }
        const passwordMatch = await users[index].password;

        if(!passwordMatch){
            return res.status(401).json({message:"Invalid Password"});

        }
        res.status(200).json(users[index]);

    } catch (error) {
        res.status(500).json({message:error.message});
        
    }
});




module.exports= {signInUser,signUpUser}
