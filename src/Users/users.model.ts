import { Schema, model, Document } from 'mongoose';
import {User} from './user.interface';
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
    {
      username: {
        type: String,
        required: [true, "Username is required"]
      },
      email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        lowercase: true,
        trim: true
      },
      password: {
        type: String,
        required: [true, "password is required"]
      },
      role: {
        type: String,
        default: "1",
        required: [true, "Role is required"]
      },
      active: {
        type: Boolean,
        default: true
      },
      tokens: [
        {
          token: {
            type: String,
            required: true
          }
        }
      ]
    },
    { timestamps: true }
  );


  userSchema.pre("save", async function(this: User, next) {
    const user = this;
  
    if (user.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  
    next();
  });

// TypeScript is now aware of all the fields you defined in the interface,
// and knows that it can expect them to be available in the post model.
const userModel = model<User>('User', userSchema);

export default userModel;


