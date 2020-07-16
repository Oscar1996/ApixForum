import Controller from '../interfaces/controller.interface';
import { Router, NextFunction, Response } from 'express';
import postModel from '../Posts/post.model';
import NotAuthorizedException from '../exceptions/NotAuthorizedException';
import authMiddlewares from '../middlewares/auth.middlewares';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import authMiddleware from '../middlewares/auth.middlewares';
import userModel from './user.model';




class UserController implements Controller {

  public path = '/users'
  public router = Router();
  private post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:id/posts`, authMiddleware, this.getAllPostOfUser);
  }

  private getAllPostOfUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    if (userId === req.user._id.toString()) {
      const posts = await this.post.find({ author: userId });
      return res.status(200).json(posts);
    }
    return next(new NotAuthorizedException());
  };

}

export default UserController;












