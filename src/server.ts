
import 'dotenv/config';
import App from './index';
import PostsController from './Posts/posts.controller';
import validateEnv from './util/validateEnv';

// Validating environment variables
validateEnv();

const app = new App([
  new PostsController(),
]);

app.connectToTheDataBase();





