import userModel from './user.model';
import User from './user.interface';
import Controller from '../interfaces/controller.interface';
import { hash, compare, genSalt } from 'bcryptjs';

const SALT_ROUND = 10;

const user = userModel;

const checkUser = async (user: User, password: string) => {
  const salt = await genSalt(SALT_ROUND);
  const hsPassword = await hash(user.password, salt);
}












