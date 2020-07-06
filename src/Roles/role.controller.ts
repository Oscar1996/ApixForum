import { Router, Request, Response, NextFunction } from 'express';
import {Role} from './role.interface';
import Controller from '../interfaces/controller.interface';
// An instance of a model is called a document
import roleModel from './role.model';
import {AccessControl} from 'accesscontrol';


class RoleController implements Controller {

  public path: string = '/roles'
  public router: Router = Router();
  // private post = postModel;

  constructor() {
    this.initializeRoutes();
    this.initializeAcl();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllRoles);
    this.router.post(this.path,  this.createRole);
/*     this.router.get(this.path+'/test',  this.test);
 */
  };

  public async initializeAcl(){
    const ac = new AccessControl();
    const roles = await roleModel.findOne();
    if (roles) {
        ac.setGrants(await roles.createPermissions());
    }
  }

  getAllRoles = async (req: Request, res: Response) => {
    const roles = await roleModel.find();
    if (roles) {
      return res.status(200).json(roles);
    } else {
      return res.status(404).json({ error: 'Posts not found!' });
    }
  };


 /*  test = async (req: Request, res: Response) => {
    const posts = await roleModel.findOne();
    if (posts) {
        const test = await posts.createPermissions();
        return res.status(200).json(test);
    } else {
      return res.status(404).json({ error: 'Posts not found!' });
    }
  }; */

  createRole = async (req: Request, res: Response) => {
    // postData expect Post interface (author, content, title)
    const roleData: Role = req.body;
    const createdRole = new roleModel(roleData);
    await createdRole.save();
    return res.status(201).json({
      message: 'Role created successfully!',
      role: createdRole
    });
  };


}

export default RoleController;