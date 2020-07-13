import jwt from 'jsonwebtoken'
import userModel from "../Users/users.model";
import {  Response, NextFunction, Request } from 'express';
import HttpException from '../exceptions/HttpException';

const authMiddleware=  async (req: Request, res: Response, next: NextFunction) => {
    
    const token = req.header("x-auth-token");
  
    // check if not token avaliable
    if (!token) {
      return res.status(401).json({
        msg: "No token, authorization denied"
      });
    };
    try {
      var decoded:any;
        decoded = jwt.verify(token, process.env.SECRET_WORD!);

        if(decoded!=undefined){
            const user = await userModel.findOne({
              _id: decoded.user.id,
              "tokens.token": token
            }).populate("role","name");
            console.log(user);
            if (!user) throw Error;
            req.user = user;
            next();
        }else{
          next();
        }
  
    } catch (err) {
      return next(new HttpException(500, err.message))
    }
  }
  

export default authMiddleware;