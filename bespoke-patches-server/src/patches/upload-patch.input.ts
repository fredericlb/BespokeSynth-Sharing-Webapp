import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  ArrayMaxSize,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { GraphQLUpload } from 'graphql-upload';

@InputType()
export class UploadPatchInput {
  @MinLength(3)
  @MaxLength(50)
  @Field()
  title: string;

  @MinLength(3)
  @MaxLength(50)
  @Field()
  author: string;

  @IsEmail()
  @MaxLength(50)
  @Field()
  mail: string;

  @Matches(/^[a-zA-Z0-9]+$/, {
    each: true,
  })
  @ArrayMaxSize(5)
  @Field(() => [String])
  tags: string[];

  @MinLength(3)
  @MaxLength(240)
  @Field()
  summary: string;

  @MaxLength(20000, {})
  @IsOptional()
  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => [GraphQLUpload])
  files: [GraphQLUpload];
}
