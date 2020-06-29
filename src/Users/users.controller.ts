import { Router, Request, Response, NextFunction } from 'express';
import {User} from './user.interface';
import Controller from '../interfaces/controller.interface';
// An instance of a model is called a document
import userModel from './users.model';


class UserController implements Controller {

  public path: string = '/users'
  public router: Router = Router();
  private user = userModel;


  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllUsers);
    this.router.get(this.path + '/:id', this.getUserById);
    this.router.post(this.path, this.createUser);
    this.router.patch(this.path + '/:id', this.modifyUser);
    this.router.delete(this.path + '/:id', this.deleteUser);
  };

  getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await userModel.find();
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
    // postData expect Post interface (author, content, title)
    const userData: User = req.body;
    const createdUser = new userModel(userData);
    // try {
    //   const postSaved = await createdPost.save();
    //   console.log(postSaved);
    //   return res.status(201).json({
    //     message: 'Post created successfully!',
    //     ...postSaved
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
    createdUser.save()
      .then((savedUser: any) => {
        console.log(savedUser);
        return res.status(201).json(savedUser);
      })
      .catch((err: any) => {
        console.log(err);
      });
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



}

export default UserController;