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