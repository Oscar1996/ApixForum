import { Router, Request, Response, NextFunction } from 'express';
import Post from './post.interface';
import Controller from '../interfaces/controller.interface';
// An instance of a model is called a document
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
    this.router.patch(this.path + '/:id', this.modifyPost);
    this.router.delete(this.path + '/:id', this.deletePost);
  };

  getAllPosts = async (req: Request, res: Response) => {
    try {
      const posts = await postModel.find();
      return res.status(200).send(posts);
    } catch (error) {
      console.log(error);
    }
  };

  getPostById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const post = await postModel.findById(id);
    return res.status(200).send(post);
  };

  modifyPost = async (req: Request, res: Response) => {
    const id = req.params.id;
    const postData: Post = req.body;
    const modifyPost = await postModel.findByIdAndUpdate(id, postData, { new: true });
    console.log(modifyPost);
    return res.status(201).json(modifyPost);
  };

  createAPost = async (req: Request, res: Response) => {
    // postData expect Post interface (author, content, title)
    const postData: Post = req.body;
    const createdPost = new postModel(postData);
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
    createdPost.save()
      .then(savedPost => {
        console.log(savedPost);
        return res.status(201).json(savedPost);
      })
      .catch(err => {
        console.log(err);
      });
  };

  deletePost = async (req: Request, res: Response) => {

    const id = req.params.id;
    const deletedPost = await postModel.findByIdAndDelete(id);
    if (deletedPost) {
      return res.status(200).json({
        message: 'Post deleted successfully!'
      });
    } else {
      return res.status(404).json({
        message: 'Failed to delete post!'
      });
    }
  };



}

export default PostController;