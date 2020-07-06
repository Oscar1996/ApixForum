import { IsString, MaxLength, MinLength, IsEmail} from 'class-validator';

class createUserDto {
  @MaxLength(50)
  @IsString()
  public username!: string;

  @IsEmail()
  public email!: string;

  @MaxLength(70)
  @MinLength(5, {
    message: 'The password is too short, must contain at least 5 character'
  })
  @IsString()
  public password!: string;
}

export default createUserDto;
// dto stands from data transfer object
// Note: "!" post-fix expression operator may be used to assert that its operand is non-null and non-undefined
//       in contexts where the type checker is unable to conclude that fact.