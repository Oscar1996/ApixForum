import HttpException from './HttpException';
import AuthenticationService from '../authentication/authentication.service';

class AuthenticationTokenMissingException extends HttpException {

  constructor() {
    super(404, 'Authentication token missing!');
  }
}

export default AuthenticationTokenMissingException;