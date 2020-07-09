import HttpException from './HttpException';

class WrongCredentialsException extends HttpException {
  constructor() {
    super(400, 'Wrong credentials provided!');
  }
}

export default WrongCredentialsException;