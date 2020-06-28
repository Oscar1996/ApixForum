
import App from './index';
import PostsController from './Posts/posts.controller';
import validateEnv from './util/validateEnv';

// Validating environment variables
validateEnv();

const Controllers = [
  new PostsController()
];

const app = new App(Controllers);

app.connectToTheDataBase();





