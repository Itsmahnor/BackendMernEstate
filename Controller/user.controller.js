import User from "../Models/user.model.js";
import { ErrorHandler } from "../utils/error.js";
import bcrypt from "bcrypt";

export const test = (req, res) => {
  res.send("Test route working!");
};

export const updateUser = async (req, res, next) => {
  // Make sure the ID in token matches param ID
  if (req.user?.id !== req.params.id) {
    return next(ErrorHandler(401, "You can only update your account"));
  }

  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json({ success: true, ...rest });
  } catch (error) {
    next(error);
  }
};


export const deleteUser = async(req,res,next)=>{
    try {
       if(req.user?.id !== req.params.id)    return next(ErrorHandler(401, "You can only delete your account"));
      await User.findByIdAndDelete(req.params.id)
      res.status(201).json('User has been deleted')
    } catch (error) {
        next(error)
    }
}


export const getUser = async (req,res,next)=>{
  try {
     const user = await User.findById(req.params.id);
  if(!user) return next(ErrorHandler(404,'User not found!'))

const {password:pass,...rest}= user._doc;
return res.status(200).json(rest)
  } catch (error) {
    next(error)
  }
 
}

