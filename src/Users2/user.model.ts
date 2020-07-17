import { Schema, model, Document } from 'mongoose';
import User from './user.interface';

const userSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
},
  { timestamps: true });

const userModel = model<User & Document>('Usert', userSchema);

export default userModel;