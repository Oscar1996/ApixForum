import { IsString, MaxLength, MinLength } from 'class-validator';

class CreatePostDto {
  @IsString()
  public author!: string;

  @MaxLength(800)
  @IsString()
  public content!: string;

  @MaxLength(70)
  @MinLength(5, {
    message: 'The title is too short, must contain at least 5 character'
  })
  @IsString()
  public title!: string;
}

export default CreatePostDto;
// dto stands from data transfer object
// Note: "!" post-fix expression operator may be used to assert that its operand is non-null and non-undefined 
//       in contexts where the type checker is unable to conclude that fact.