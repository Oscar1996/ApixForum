import express, { Router, Request, Response, NextFunction } from 'express';
import Post from './post.interface';
import Controller from '../interfaces/controller.interface';

class PostController implements Controller {

  public path: string = '/posts'
  public router: Router = Router();

  private posts: Post[] = [
    {
      author: 'Oscar Valdivia',
      content: 'This is a test',
      title: 'This is a Api'
    }
  ];

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.post(this.path, this.createAPost);
  };

  getAllPosts = (req: Request, res: Response, next: NextFunction) => {
    res.send(this.posts);
  };

  createAPost = (req: Request, res: Response, next: NextFunction) => {
    const author = req.body.author;
    const content = req.body.content;
    const title = req.body.title;

    const post: Post = {
      author: author,
      content: content,
      title: title
    }
    this.posts.push(post);
    res.send(post);
  };
}

export default PostController;