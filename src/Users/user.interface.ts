import mongoose from 'mongoose';
export interface User extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  role: {name:string};
  active: boolean;
  tokens: Token[];
  generateAuthToken(): string;
  isUserBanned(): BannedObject;
  unbanUser(): boolean;

  bans: Ban[]
}

interface Token {
  token: string
}

export interface Ban {
  reason: string,
  from: Date,
  until: Date,
  wasBanLifted: boolean;
}

interface BannedObject{
  banned: Boolean,
  msg: string
}