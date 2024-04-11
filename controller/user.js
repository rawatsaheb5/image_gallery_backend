
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const signup = async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      // Check if the user with the given email or username already exists
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "User with this email or username already exists" });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user with the hashed password
      const newUser = new User({ username, email, password: hashedPassword });
      const savedUser = await newUser.save();
  
      // You may generate a JWT token here and send it in the response for user authentication
  
      res.status(201).json(savedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const signin = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if the user with the given email exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
  
      // Verify the password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
  
      // Generate a JWT token
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      }); // Replace 'your-secret-key' with a strong secret key
      res.status(201).send({
        message: "sign in successfully",
        username: user.username,
        email: user.email,
        token,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
module.exports = {
    signup,
    signin ,
}