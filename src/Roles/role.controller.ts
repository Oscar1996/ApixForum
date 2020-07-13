import { Router, Request, Response, NextFunction } from 'express';
import {Role} from './role.interface';
import Controller from '../interfaces/controller.interface';
// An instance of a model is called a document
import roleModel from './role.model';
import {AccessControl} from 'accesscontrol';
import grantAccess from '../middlewares/acl.middleware';
import authMiddleware from '../middlewares/auth.middleware'

class RoleController implements Controller {

  public path: string = '/roles'
  public router: Router = Router();

  constructor() {
    this.initializeRoutes();
/*     this.initializeAcl();
 */  }

  public initializeRoutes() {
    this.router.get(this.path, authMiddleware,this.getAllRoles);
    this.router.post(this.path,   this.createRole);
/*     this.router.get(this.path+'/test',  this.test);
 */
  };


  getAllRoles = async (req: Request, res: Response) => {
    try{

      const roles = await roleModel.find();
      if (roles) {
        return res.status(200).json(roles);
      } else {
        return res.status(404).json({ error: 'Posts not found!' });
      }
    }catch(err){

    }
  };


 /*  test = async (req: Request, res: Response) => {
    var hola:permissionsObject[] = await roleModel.createAllPermissionsArray();
    return res.status(200).json(hola);

    if (posts) {
        const test = await posts.createPermissions();
        return res.status(200).json(test);
    } else {
      return res.status(404).json({ error: 'Posts not found!' });
    }
  }; */

  createRole = async (req: Request, res: Response) => {
    // roleData expect Post interface (author, content, title)
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