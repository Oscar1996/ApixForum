import { Router, Request, Response, NextFunction } from 'express';
import Post from './post.interface';
import Controller from '../interfaces/controller.interface';
// An instance of a model is called a document
import postModel from './post.model';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import postDto from './post.dto';
import validationMiddleware from '../middlewares/validation.middlewares';



class PostController implements Controller {

  public path: string = '/posts'
  public router: Router = Router();
  // private post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(this.path + '/:id', this.getPostById);
    this.router.post(this.path, validationMiddleware(postDto), this.createAPost);
    this.router.patch(this.path + '/:id', validationMiddleware(postDto, true), this.modifyPost);
    this.router.delete(this.path + '/:id', this.deletePost);
  };

  getAllPosts = async (req: Request, res: Response) => {
    const posts = await postModel.find();
    if (posts) {
      return res.status(200).json(posts);
    } else {
      return res.status(404).json({ error: 'Posts not found!' });
    }
  };

  getPostById = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const post = await postModel.findById(id);
    if (post) {
      return res.status(200).json(post);
    } else {
      next(new PostNotFoundException(+id));
    }
  };

  modifyPost = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const postData: Post = req.body;
    const modifiedPost = await postModel.findByIdAndUpdate(id, postData, { new: true });
    if (modifiedPost) {
      return res.status(201).json({
        message: 'Post updated successfully!',
        post: modifiedPost
      });
    } else {
      next(new PostNotFoundException(+id));
    }
  };

  createAPost = async (req: Request, res: Response) => {
    // postData expect Post interface (author, content, title)
    const postData: Post = req.body;
    const createdPost = new postModel(postData);
    await createdPost.save();
    return res.status(201).json({
      message: 'Post created successfully!',
      post: createdPost
    });
  };

  deletePost = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const deletedPost = await postModel.findByIdAndDelete(id);
    if (deletedPost) {
      return res.status(200).json({
        message: 'Post deleted successfully!'
      });
    } else {
      next(new PostNotFoundException(+id));
    }
  };
}

export default PostController;