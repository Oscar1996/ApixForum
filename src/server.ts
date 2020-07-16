import App from './index';
import PostsController from './Posts/post.controller';
import UsersController from './testUser/users.controller';
import RolesController from './Roles/role.controller';

import validateEnv from './util/validateEnv';

// Validating environment variables
validateEnv();

const Controllers = [
  new PostsController(),
  new UsersController(),
  new RolesController()

];

const app = new App(Controllers);
app.connectToTheDataBase();





