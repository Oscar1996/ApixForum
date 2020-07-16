import { Request, Response, NextFunction, Router } from 'express';
import { hash, genSalt, compare } from 'bcryptjs'
import Controller from '../interfaces/controller.interface';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import validationMiddlewares from '../middlewares/validation.middlewares';
import CreateUserDto from '../Users2/user.dto';
import userModel from '../Users2/user.model';
import LogInDto from './logIn.dto';
import AuthenticationService from './authentication.service';


class AuthenticationController implements Controller {

  public path = '/auth';
  public router = Router();
  public authService = new AuthenticationService();
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  };

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, validationMiddlewares(CreateUserDto), this.registration);
    this.router.post(`${this.path}/login`, validationMiddlewares(LogInDto), this.loggingIn);
    this.router.post(`${this.path}/logout`, this.loggingOut);
  };

  private registration = async (req: Request, res: Response, next: NextFunction) => {
    const userData: CreateUserDto = req.body;
    try {
      const { user, cookie } = await this.authService.register(userData);
      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  private loggingIn = async (req: Request, res: Response, next: NextFunction) => {
    const logInData: LogInDto = req.body;
    const user = await this.user.findOne({ email: logInData.email });
    if (user) {
      const passCorrect = await compare(logInData.password, user.password);
      if (passCorrect) {
        const tokenData = this.authService.createToken(user);
        res.setHeader('Set-Cookie', [this.authService.createCookie(tokenData)]);
        user.password = null;
        return res.status(200).json({
          message: 'User logged in!',
          userName: user.name,
          userId: user.id
        });
      } else {
        next(new WrongCredentialsException());
      }
    } else {
      next(new WrongCredentialsException());
    }
  };

  private loggingOut = async (req: Request, res: Response) => {
    res.setHeader('Set-Cookies', ['Authorization=;Max-age=0']);
    return res.status(200).json({
      message: 'User loggedout!'
    });
  };
}

export default AuthenticationController;

