import { Schema, model, Document } from 'mongoose';
import {Role, Permission, Action, permissionsObject, RoleModel} from './role.interface';

const roleSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "A role name is required"]
    },
    permissions:[
        {
            //access to every resource
            resource:{
                type: String
            },
            // Actions allowed for this resource
            actionList:[
               { 
                   action: {
                    enum:["create:any","read:any","update:any","delete:any",
                    "create:own","read:own","update:own","delete:own"],
                    required: [true, "An action is required"],
                    type: String
                    },
                    // attributes, ['*'] means every attribute can be read, deleted or updated, !atributename means this attribute is not avaliable for this role
                    attributes:[
                        {
                            attribute:{
                                type: String
                            }
                        }
                    ]
                }
           ],

              
        
        }    ], 

    },
  { timestamps: true }
);


roleSchema.methods.createPermissions = async function () {
    const role = this;
    var permissionTemp:permissionsObject = {role:'', resource:'', action:'', attributes:''};
    var permissionsArray:permissionsObject[]=[];

    role.permissions.forEach((permission: Permission) => {
        permission.actionList.forEach((action: Action) => {
            // {role:"name", resource:"resourceName", action:"create:Any..."}
            permissionTemp.role=role.name;
            permissionTemp.resource=permission.resource;
            permissionTemp.action = action.action;

            if(action.attributes){
                action.attributes.forEach((attribute:any)=>{
                    permissionTemp.attributes=attribute.attribute
                })
            }
            permissionsArray.push(JSON.parse(JSON.stringify(permissionTemp)))
        });
    });
    return permissionsArray;
  };

roleSchema.statics.createAllPermissionsArray = async function (){
    const roles = await roleModel.find();
    var allPermissions:permissionsObject[]=[];
    for (const role of roles) {
        allPermissions = allPermissions.concat(JSON.parse(JSON.stringify(await role.createPermissions())));
    }
    return allPermissions;
}

// TypeScript is now aware of all the fields you defined in the interface,
// and knows that it can expect them to be available in the user model.
const roleModel = model<Role,RoleModel >('Role', roleSchema);

export default roleModel;


