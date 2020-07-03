import mongoose  from 'mongoose';
export interface User extends mongoose.Document {
    username: string;
    email: string;
    password: string;
    role: string;
    active:boolean;
    tokens:Array<Token>;
    generateAuthToken(): string;


  }
  
 interface Token {
  token: string
}
