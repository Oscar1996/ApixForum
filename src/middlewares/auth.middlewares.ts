import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import userModel from '../Users2/user.model';

async function authMiddleware(req: RequestWithUser, res: Response, next: NextFunction) {
  const cookies = req.cookies; // this is posible because cookie-parser package
  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET;
    try {
      const verificationResponse = verify(cookies.Authorization, secret!) as DataStoredInToken;
      const id = verificationResponse._id;
      const user = await userModel.findById(id);
      if (user) {
        req.user = user;
        next();
      } else {
        next(new WrongAuthenticationTokenException());
      }
    } catch (error) {
      next(new WrongAuthenticationTokenException());
    }
  } else {
    next(new AuthenticationTokenMissingException());
  }
};

export default authMiddleware;