import mongoose from 'mongoose';

export interface Role extends mongoose.Document {
  name: string;
  permissions: Permission[];
  createPermissions(): permissionsObject[];
  createAllPermissionsArray():permissionsObject[];

}

export interface Permission{
        resource: string
        actionList: Action[],

}

export interface Action{
    action: string,
    attributes: Array<Object>
}


export interface permissionsObject{
    role: string,
    resource: string,
    action: string,
    attributes: string
}


export interface RoleModel extends mongoose.Model<Role> {
createAllPermissionsArray():permissionsObject[];
}