const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" }); // Fixed process.env
};

// Register User
exports.registerUser = async (req, res) => { // Fixed arrow function syntax
    const { fullName, email, password, profileImageUrl } = req.body;

    // Validation: Check for missing Fields
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "All Fields are Required" }); // Fixed typo "mesage"
    }

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
        
        // Create the User (fixed method name)
        const user = await User.create({
            fullName,
            email,
            password,
            profileImageUrl,
        });

        // Send response without password
        res.status(201).json({
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id),
        });
    } catch (err) {
        res.status(500).json({
            message: "Error in Registering user",
            error: err.message
        });
    }
};

// Login User
exports.loginUser = async (req, res) => { 
    const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required"});
  }
  try {
    const user = await User.findOne({ email });
    if ( !user || !(await user.comparePassword(password))){
        return res.status(400).json({ message: "Invalid Credentials "});
    }

    res.status(200).json({
        id: user._id,
        user,
        token: generateToken(user._id),
    });
    }catch (err) {
        res.status(500).json({
            message: "Error in Registering user",
            error: err.message}
    );

    }
};

// Get User Info
exports.getUserInfo = async (req, res) => { // Fixed arrow function syntax
    try{
        const user = await User.findById(req.user.id).select("-password");

    if (!user){
        return res.status(404).json({ message: "User Not Found"});
    }
    res.status(200).json(user)
    }catch (err) {
        res.status(500).json({
            message: "Error in Registering user",
            error: err.message
        });
    }  
};