import { Router, Request, Response, NextFunction } from 'express';
import Post from './post.interface';
import Controller from '../interfaces/controller.interface';
// An instance of a model is called a document
import postModel from './post.model';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import CreatePostDto from './post.dto';
import validationMiddleware from '../middlewares/validation.middlewares';
import authMiddleware from '../middlewares/auth.middlewares';
import RequestWithUser from '../interfaces/requestWithUser.interface';


class PostController implements Controller {

  public path: string = '/posts'
  public router: Router = Router();
  // private post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router
      .all(`${this.path}/*`, authMiddleware)
      .patch(`${this.path}/:id`, validationMiddleware(CreatePostDto, true), this.modifyPost)
      .delete(`${this.path}/:id`, this.deletePost)
      .post(this.path, validationMiddleware(CreatePostDto), this.createAPost);
  }

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

  createAPost = async (req: RequestWithUser, res: Response) => {
    // postData expect Post interface (author, content, title)
    const postData: Post = req.body;
    const createdPost = new postModel({
      ...postData,
      authorId: req.user.id,
    });
    const postSaved = await createdPost.save();
    return res.status(201).json({
      message: 'Post created successfully!',
      ...postSaved
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