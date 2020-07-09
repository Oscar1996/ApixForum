import { Router, Request, Response } from 'express';
import { User } from './user.interface';
import Controller from '../interfaces/controller.interface';
import authMiddleware from '../middlewares/auth.middleware'
import userModel from './users.model';
import bcrypt from 'bcryptjs';
import userDto from './user.dto';
import validationMiddleware from '../middlewares/validation.middlewares';


class UserController implements Controller {

  public path: string = '/users'
  public router: Router = Router();


  constructor() {
    this.initializeRoutes();
    this.authRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, authMiddleware, this.getAllUsers);
    this.router.get(this.path + '/:id', this.getUserById);
    this.router.post(this.path, validationMiddleware(userDto), this.createUser);
    this.router.patch(this.path + '/:id', validationMiddleware(userDto, true),authMiddleware, this.modifyUser);
    this.router.delete(this.path + '/:id',authMiddleware, this.deleteUser);
  };

  public authRoutes() {
    this.router.post('/login', this.loginUser);

  }

  getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await userModel.find().select("-password -updatedAt -tokens");
      return res.status(200).send(users);
    } catch (error) {
      console.log(error);
    }
  };

  getUserById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = await userModel.findById(id);
    return res.status(200).send(user);
  };

  modifyUser = async (req: Request, res: Response) => {
    const id = req.params.id;
    const userData: User = req.body;
    const modifyUser = await userModel.findByIdAndUpdate(id, userData, { new: true });
    console.log(modifyUser);
    return res.status(201).json(modifyUser);
  };

  createUser = async (req: Request, res: Response) => {
    // userData expects User interface (email, password) others fields are optional or  handled automatically by mongoose
    const userData: User = req.body;
    const createdUser = new userModel(userData);
    try {
      const userSaved = await createdUser.save();
      console.log(userSaved);
      return res.status(201).json({
        message: 'User has been registered successfully!',
        user: userSaved
      });
    } catch (error) {
      console.log(error);
    }

  };

  deleteUser = async (req: Request, res: Response) => {
    const id = req.params.id;
    const deletedUser = await userModel.findByIdAndDelete(id);
    if (deletedUser) {
      return res.status(200).json({
        message: 'User deleted successfully!'
      });
    } else {
      return res.status(404).json({
        message: 'Failed to delete user!'
      });
    }
  };

  loginUser = async (req: Request, res: Response) => {
    //const errors = validationResult(req);
    /* if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } */
    const { email, password } = req.body;

    try {
      const user = await userModel.findOne({ email: email });
      if (!user) {
        return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
      }
      // Generate authentication token using mongoose schema function
      const token =  await user.generateAuthToken();
      return res.status(200).json({ token });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("server error");
    }
  };



  /*   logoutActualToken = async (req: Request, res: Response) => {
      try {
        const user = await userModel.findOne({ _id: req.user.id });
        if (!user) {
          return res
            .status(400)
            .json({ errors: [{ msg: "You are already logged out" }] });
        }
        user.tokens = user.tokens.filter(s: token=>{
          return token.token !== req.token;
        });
    
        await user.save();
        return res.send();
      } catch (err) {
        console.error(err.message);
        return res.status(500).send("server error");
      }
    }; */
}

export default UserController;