import User from "../Models/user.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

export const signup = async (req, res,next) => {
  const { username, email, password } = req.body;
const newpassword= bcrypt.hashSync(password,10)
  try {

    const newUser = new User({ username, email, password:newpassword });

    await newUser.save();
    res.status(201).json({ message: "User created successfully!" }); 
  } catch (err) {
   next(err)
  }
};

// sign in
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ success: false, message: "User not found!" });
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ success: false, message: "Incorrect password!" });
    }

    // 🔒 Generate JWT token
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET);

    // 🧁 Set cookie
    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // change to true in production (https)
    });

    // ✅ Return user info
    res.status(200).json({
      success: true,
      message: "Logged in successfully!",
      user: {
        id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        avator: existingUser.avator,
      },
    });
  } catch (err) {
    next(err);
  }
};




export const google = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password, ...rest } = user._doc;

      res.cookie("access_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      }).status(200).json({
        success: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avator: user.avator,
        }
      });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);

    const newUser = new User({
  username:
    req.body.name.split(" ").join("").toLowerCase() +
    Math.random().toString(36).slice(-4),
  email: req.body.email,
  password: hashedPassword,
  avator: req.body.photo || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
});


      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password, ...rest } = newUser._doc;

      res.cookie("access_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      }).status(200).json({
        success: true,
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          avator: newUser.avator ,
        }
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Google sign-in failed");
  }
};
