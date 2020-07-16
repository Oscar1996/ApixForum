import { Request } from 'express';
import User from '../Users2/user.interface';

interface RequestWithUser extends Request {
  user: User;
}

export default RequestWithUser;