import { Request, Response, NextFunction, Router } from 'express';
import { hash, genSalt, compare } from 'bcryptjs'
import Controller from '../interfaces/controller.interface';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import validationMiddlewares from '../middlewares/validation.middlewares';
import CreateUserDto from '../Users2/user.dto';
import userModel from '../Users2/user.model';
import LogInDto from './logIn.dto';


class AuthenticationController implements Controller {

  public path = '/auth';
  public router = Router();
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, validationMiddlewares(CreateUserDto));
    this.router.post(`${this.path}`, validationMiddlewares(LogInDto));
  }

  private registration2 = async (req: Request, res: Response, next: NextFunction) => {
    const userData: CreateUserDto = req.body;
    const userFound = await this.user.find({ email: userData.email });
    if (userFound) {
      next(new UserWithThatEmailAlreadyExistsException(userData.email));
    } else {
      const salt = await genSalt(10);
      const hashedPassword = await hash(userData.password, salt);
      const user = await this.user.create({

      });
    }
  }



  private loggingIn = async (req: Request, res: Response, next: NextFunction) => {
    const logInData: LogInDto = req.body;
  }
}

export default AuthenticationController;

