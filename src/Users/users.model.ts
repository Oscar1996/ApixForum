import { Schema, model } from 'mongoose';
import {User, Ban} from './user.interface';
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
import dayjs from 'dayjs';

const userSchema = new Schema(
  {
    username: {
      type: String,
      lowercase: true,
      required: [true, "Username is required"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, "Password is required"]
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: [true, "Role is required"]
    },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ],
    active: {
      type: Boolean,
      default: true
    },
    bans:[
      {
        reason:{
          type: String,
          default: 'No reason specified',
          required: true
        },
        from:{
          type: Date,
          required:true,
          default: dayjs()
        },
        until:{
          type: Date,
          required: [true, 'You need to specify a finishing date']
        },
        wasBanLifted:{
          type: Boolean,
          required: true,
          default: false
        }
      }
    ]

  },
  { timestamps: true }
);


userSchema.pre("save", async function (this: User, next) {
  const user = this;

  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }

  next();
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ user: { id: user.id } }, process.env.SECRET_WORD);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.methods.isUserBanned = async function(){
  const user= this;
    for(let i=0; i<user.bans.length; i++){
      if (dayjs(user.bans[i].until).isAfter(dayjs())&& !user.bans[i].wasBanLifted){
         return {
          banned:true,
          msg:'Your account is banned until '+dayjs(user.bans[i].until).format('DD/MM/YYYY')+ 
          ' REASON: '+ user.bans[i].reason 
          };
      };
    };
    return {banned:false};
};


userSchema.methods.unbanUser = async function(){
  const user = this;
  for(let i=0; i<user.bans.length; i++){
    if (dayjs(user.bans[i].until).isAfter(dayjs())){
      user.bans[i].wasBanLifted = true;
    };
  };
  if(user.isModified("bans")){
    await user.save();
    return true;
  }else{
    return false;
  }
}


// TypeScript is now aware of all the fields you defined in the interface,
// and knows that it can expect them to be available in the user model.
const userModel = model<User & Document>('User', userSchema);

export default userModel;


