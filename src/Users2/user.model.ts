import { Schema, model, Document } from 'mongoose';
import User from './user.interface';


const addressSchema: Schema = new Schema({
  city: String,
  country: String,
  street: String
});

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
  },
  address: addressSchema
},
  { timestamps: true });

const userModel = model<User & Document>('Usert', userSchema);

export default userModel;