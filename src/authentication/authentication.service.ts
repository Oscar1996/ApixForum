import { compare, hash, genSalt } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';
import TokenData from '../interfaces/tokenData.interface';
import CreateUserDto from '../Users2/user.dto';
import User from '../Users2/user.interface';
import userModel from '../Users2/user.model';

class AuthenticationService {

  public user = userModel;

  public register = async (userData: CreateUserDto) => {
    const userFound = await this.user.findOne({ email: userData.email });
    if (userFound) {
      throw new UserWithThatEmailAlreadyExistsException(userData.email);
    } else {
      const salt = await genSalt(10);
      const hashedPassword = await hash(userData.password, salt);
      const user = await this.user.create({
        ...userData,
        password: hashedPassword,
      });
      const tokenData = this.createToken(user);
      const cookie = this.createCookie(tokenData);
      return {
        cookie,
        user,
      }
    }
  }

  public createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }

  public createToken(user: User): TokenData {
    const expiresIn = 60 * 60; // an hour
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      _id: user._id
    };
    return {
      expiresIn,
      token: sign(dataStoredInToken, secret!, { expiresIn })
    };
  }
}

export default AuthenticationService;