
const jwt = require("jsonwebtoken");
const otpGenerator = require('otp-generator');

//import ValidationError from '../errors/ValidationError';
const mailLoginOtp = require("../mail/loginotp.js");
const mailWelcomeEmail = require("../mail/welcome_email.js");



const db = require("../models/index.js");
const Users = db.Users;
const Op = db.Sequelize.Op;


const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
  //    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const generateOTP = () => {
  const otp = otpGenerator.generate(6, { 
    upperCaseAlphabets: false, 
    specialChars: false,
    lowerCaseAlphabets: false // Set to false if you want only numbers
  });
  return otp;
};

const getFirstTwoLetters = (inputString) => {
  // Step 1: Remove special characters
  const cleanedString = inputString.replace(/[^a-zA-Z0-9]/g, '');

  // Step 2: Get the first two characters
  const firstTwoLetters = cleanedString.slice(0, 2);

  return firstTwoLetters.toUpperCase();
};

//user response
const usersResponse = (user, message) => {
  const data = {
    message: message,
    userId: user.id,
    role: user.role,
    name: user.name,
    initial: user.initial,
    email: user.email,
    image: user.image,
    access_token: user.token,
    createdAt: user.createdAt
  }
  return data;
};




// user details
exports.login = async (req, res) => {
  // Validate request
  const { email } = req.body;
  
  Users.findOne({ where: { email: email } })
    .then(data => {
      if (data) {
        const access_token = generateAccessToken(data.id);

        data.token = access_token;
        data.save();

        const userRes = usersResponse(data, 'LogedIn successfully!');
        return res.status(200).json(userRes);
        

      } else {
        return res.status(401).json({ error: "Invalid credentials" });
      }
    })
    .catch(err => {
      return res.status(500).json({ error: err.message });
    });

};


exports.findOrCreate = async (req, res) => {

  const { email, role, type } = req.body;
  // Check if user already exists
  const newOtp = generateOTP();
  const initial = getFirstTwoLetters(email);

  const existingUser = await Users.findOne({ where: { email: email } });
  if (existingUser) {
    
    if(existingUser.status == false){
      return res.status(500).json({ message: "User blocked" });
    }

    const access_token = generateAccessToken(existingUser.id);

    // existingUser.token = access_token;
    existingUser.otp = newOtp;
    existingUser.save();

    //send mail
    mailLoginOtp.loginOtp({ email: email, otp: newOtp });

    return res.status(200).json({
      message: "OTP send successfully!"
    });
  }


  const user = {
    // name: initial,
    initial: initial,
    email: email,
    role: role,
    type: type,
    image: '1.jpeg',
    status: true
  };
  
  // Save User in the database
  Users.create(user)
    .then(data => {

      data.otp = newOtp;
      data.save();

      //send mail
      mailWelcomeEmail.sendWelcomeEmail({ email: email });
      mailLoginOtp.loginOtp({ email: email, otp: newOtp });

      return res.status(200).json({
        message: "OTP send successfully!"
      });
    })
    .catch(err => {
      return res.status(401).json({ error: err.message });
    });

};

//login with OTP
exports.otpLogin = async (req, res) => {

  const { email, otp } = req.body;

  const existingUser = await Users.findOne({ where: { email: email, otp: otp } });
  if (existingUser) {
    
    const access_token = generateAccessToken(existingUser.id);

    existingUser.token = access_token;
    existingUser.otp = '';
    existingUser.save();

    const userRes = usersResponse(existingUser, 'LogedIn successfully!');
    return res.status(200).json(userRes);


  } else {
    return res.status(401).json({ error: "Invalid credentials" });
  }

};



// user profile update
exports.updateProfile = async (req, res) => {
  // Validate request
  const { name, image } = req.body;
  const userId = req.userId;

  const existingUsername = await Users.findOne({ where: { id: { [Op.ne]: userId }, name: name } });
  if(existingUsername){
    return res.status(500).send({
        message: "Username already exist"
      });
  }


  const initial = getFirstTwoLetters(name);

  Users.findOne({ where: { id: userId } })
    .then(data => {
      if (data) {
        //...
        data.name = name;
        
        if(image){
          data.image = image;
        }

        data.initial = initial;
        data.save();

        const userRes = usersResponse(data, 'Profile updated successfully!');
        return res.status(200).json(userRes);
        
      }
    })
    .catch(err => {
      return res.status(500).json({ error: err.message });
    });

};


// all users without admin
exports.findAll = async (req, res) => {

  const { page = 1, limit = 10, role } = req.query; // Default to page 1, size 10
  const offset = (parseInt(page) - 1) * limit;



  const data = await Users.findAndCountAll({
    limit: limit,
    offset: offset,
    where: { role: role},
    order: [
      ['id', 'DESC']
    ],
    attributes: { exclude: ['password', 'token', 'otp', 'role'] } // Excludes 'password' and 'username' columns
  });

  // Calculate total pages
  const totalPages = Math.ceil(data.count / limit);

  return res.status(200).json({
    message: "All Users!",
    content: data.rows,
    totalPages: totalPages,
    currentPage: parseInt(page),
    totalItems: data.count,
    limit: limit,
  });

};

//refreshToken
exports.refreshToken = async (req, res) => {

  const access_token = req.headers.authorization.split(' ')[1];

  if(!access_token){
    return res.status(401).json({ error: "Invalid credentials" });
  }

  //check token in users table
  Users.findOne({ where: { token: access_token } })
    .then(data => {
      if (data) {
        //...
        const access_token = generateAccessToken(data.id);

        data.token = access_token;
        data.save();

        const userRes = usersResponse(data, 'Token Refreshed');
        return res.status(200).json(userRes);
        
      }
    })
    .catch(err => {
      return res.status(500).json({ error: err.message });
    });

};




// Create and Save a new user
exports.createAadmin = async (req, res) => {

  const existingUser = await Users.findOne({ where: { email: req.body.email } });
  if(existingUser){
    return res.status(500).json({ message: "User already exist" });
  }

  const existingUsername = await Users.findOne({ where: { name: req.body.name } });
  if(existingUsername){
    return res.status(500).send({
        message: "Username already exist"
      });
  }

  // Create
  const initial = getFirstTwoLetters(req.body.name);

  const userData = {
    name: req.body.name,
    initial: initial,
    email: req.body.email,
    image: req.body.image,
    role: 'admin',
    type: 'register',
    status: req.body.status ? req.body.status : false
  };



  // Save Category in the database
  Users.create(userData)
    .then(data => {
      return res.status(200).json({
        message: "User created successfully.",
        // data: data
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    });
};

// Update a user by the id in the request
exports.updateAdmin = async (req, res) => {
  const id = req.params.id;

  const existingUsername = await Users.findOne({ where: { id: { [Op.ne]: id }, name: req.body.name } });
  if(existingUsername){
    return res.status(500).send({
        message: "Username already exist"
      });
  }

  const initial = getFirstTwoLetters(req.body.name);
  req.body.initial = initial;

  Users.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User with id=" + id
      });
    });
};