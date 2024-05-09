const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");


// Controller functions
async function signup(req, res) {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();

    // Generate a token for the newly created user
    const token = user.generateAuthToken();

    res
      .header("x-auth-token", token) 
      .send({ message: "User created successfully", user, token }); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ message: "Invalid email or password" });
    const token = user.generateAuthToken();
    console.log("Generated Token:", token);
    res
      .header("x-auth-token", token)
      .send({ message: "Login successful", user, token }); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function logout(req, res) {
  try {
    const token = req.body.token;
    res.send("Logout successful");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getUserInfo(req, res) {
  try {
    const userId = req.user._id; 
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const token = user.generateAuthToken(); 
    const userInfo = {
      user,
      token, 
    };
    res.json(userInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id; 
    const { username, email, password } = req.body; 

    
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;

   
    const user = await User.findByIdAndUpdate(
      userId,
      { username, email, ...(hashedPassword && { password: hashedPassword }) },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Optionally, you can generate a new token if needed
    const token = user.generateAuthToken();

   
    const userInfo = {
      user,
      token, 
    };

    res.json(userInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { signup, login, logout, getUserInfo, updateUserProfile };
