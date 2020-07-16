import { Document } from 'mongoose';

interface User extends Document {
  name: string;
  email: string;
  password: string;
}

export default User;