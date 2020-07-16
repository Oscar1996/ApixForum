import { IsString, MaxLength, MinLength } from 'class-validator';

class CreatePostDto {
  @IsString()
  public title!: string;

  @IsString()
  public content!: string;

}

export default CreatePostDto;
// dto stands from data transfer object
// Note: "!" post-fix expression operator may be used to assert that its operand is non-null and non-undefined
//       in contexts where the type checker is unable to conclude that fact.