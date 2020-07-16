import App from './index';
import PostsController from './Posts/post.controller';
import UsersController from './Users2/user.controller';
import AuthenticationController from './authentication/authentication.controller';

import validateEnv from './util/validateEnv';
import UserController from './Users2/user.controller';

// Validating environment variables
validateEnv();

const Controllers = [
  new PostsController(),
  new AuthenticationController(),
  new UserController()
];

const app = new App(Controllers);
app.connectToTheDataBase();





