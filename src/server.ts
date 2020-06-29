
import App from './index';
import PostsController from './Posts/posts.controller';
import UsersController from './Users/users.controller';

import validateEnv from './util/validateEnv';

// Validating environment variables
validateEnv();

const Controllers = [
  new PostsController(),
  new UsersController()
];

const app = new App(Controllers);

app.connectToTheDataBase();





