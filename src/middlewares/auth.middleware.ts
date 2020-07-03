import jwt from 'jsonwebtoken'
import userModel from "../Users/users.model";
import {User} from "../Users/user.interface";
import {  Response, NextFunction, Request, RequestHandler } from 'express-serve-static-core';

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
            }).select("-password");
            if (!user) throw Error;
            req.user = user;
            console.log(decoded)
            next();
        }else{
          next();
        }
  
    } catch (err) {
      res.status(401).json({ msg: "Token is not valid" });
    }
  }
  

export default authMiddleware;