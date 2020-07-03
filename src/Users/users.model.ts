import { Schema, Document, model } from 'mongoose';
import User from './user.interface';
import bcrypt from 'bcryptjs';

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, "Password is required"]
    },
    role: {
      type: String,
      default: "1",
      required: [true, "Role is required"]
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// TypeScript is now aware of all the fields you defined in the interface,
// and knows that it can expect them to be available in the user model.
const userModel = model<User & Document>('User', userSchema);

export default userModel;


