import { Router, Request, Response, NextFunction } from 'express';
import Post from './post.interface';
import Controller from '../interfaces/controller.interface';
import postModel from './posts.model';


class PostController implements Controller {

  public path: string = '/posts'
  public router: Router = Router();
  private post = postModel;


  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(this.path + '/:id', this.getPostById);
    this.router.post(this.path, this.createAPost);
    this.router.patch(this.path + '/:id', this.getPostById);
  };

  getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const posts = await postModel.find();
      return res.status(200).send(posts);
    } catch (error) {
      console.log(error);
    }
  };

  getPostById = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const post = await postModel.findById(id);
    return res.status(200).send(post);
  };

  // modifyPost = async (req: Request, res: Response, next: NextFunction) => {
  //   const id = req.params.id;
  //   const postData: Post = req.body;
  //   this.post
  // };



  createAPost = async (req: Request, res: Response, next: NextFunction) => {
    // postData expect Post interface (author, content, title)
    const postData: Post = req.body;
    const createdPost = new postModel(postData);
    console.log(createdPost);
    try {
      await createdPost.save();
      return res.status(201).send({
        message: 'Post created successfully!',
        post: createdPost
      });
    } catch (error) {
      console.log(error);
    }
  };
}

export default PostController;