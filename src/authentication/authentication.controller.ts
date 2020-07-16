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
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, validationMiddlewares(CreateUserDto), this.registration);
    this.router.post(`${this.path}/login`, validationMiddlewares(LogInDto), this.loggingIn);
  }

  private registration = async (req: Request, res: Response, next: NextFunction) => {
    const userData: CreateUserDto = req.body;
    const userFound = await this.user.findOne({ email: userData.email });
    if (userFound) {
      return next(new UserWithThatEmailAlreadyExistsException(userData.email));
    } else {
      const salt = await genSalt(10);
      const hashedPassword = await hash(userData.password, salt);
      const user = await this.user.create({
        ...userData,
        password: hashedPassword
      });
      const tokenData = this.authService.createToken(user);
      res.setHeader('Set-Cookie', [this.authService.createCookie(tokenData)]);
      return res.status(201).json({
        message: 'User created successfully!',
        user: user
      });
    }
  }

  private loggingIn = async (req: Request, res: Response, next: NextFunction) => {
    const logInData: LogInDto = req.body;
    const user = await this.user.findOne({ email: logInData.email });
    if (user) {
      const passCorrect = await compare(user.password, logInData.password);
      if (passCorrect) {
        const tokenData = this.authService.createToken(user);
        res.setHeader('Set-Cookie', [this.authService.createCookie(tokenData)]);
        return res.status(200).json({
          message: 'User logged in!',
          user: user.name
        });
      } else {
        next(new WrongCredentialsException());
      }
    } else {
      next(new WrongCredentialsException());
    }
  }
}

export default AuthenticationController;

