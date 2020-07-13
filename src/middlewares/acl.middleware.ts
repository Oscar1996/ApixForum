import {  Response, NextFunction, Request, RequestHandler } from 'express';
import { AccessControl, Query, Permission } from 'accesscontrol';
import roles from '../util/roles'
import HttpException from '../exceptions/HttpException';

const grantAccess = <T>(action: keyof Query, resource: string): RequestHandler =>{
  return async (req:Request, res: Response, next: NextFunction) => {
    try {
        if(req.user){
          const role: AccessControl = await roles()
            const permission = await role.can(req.user.role.name)[action](resource) as Permission;
            if (!permission.granted) {
              return next(new HttpException(401, "You don't have enough permission to perform this action"))
            }else{
              return next();
            }
        }
        return next(new HttpException(401, "Seems you're not logged in, please log in to access this page"))
    } catch (error) {
      return next(new HttpException(500, error.message))
    }
  };
};
  
export default grantAccess;