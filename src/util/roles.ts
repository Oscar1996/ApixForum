import roleModel from '../Roles/role.model';
import {AccessControl} from 'accesscontrol';

const roles = async function (){
    const ac = new AccessControl();
    const roles = await roleModel;
    if (roles) {
        ac.setGrants(await roles.createAllPermissionsArray());
    }
    return ac;
};

export default roles;
