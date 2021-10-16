import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Patch {
  @Field(() => String)
  uuid: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  author: string;

  @Field(() => String)
  mail: string;

  @Field(() => [String])
  tags: string[];

  @Field(() => String)
  bskFile: string;

  @Field(() => String)
  coverImage: string;

  @Field(() => [String])
  audioSamples: string[];

  @Field(() => String)
  summary: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Int)
  status: number;

  @Field(() => Int)
  revision: number;

  @Field(() => Date)
  publish: Date;

  @Field(() => String)
  modules: string;

  @Field(() => String, { nullable: true })
  _token?: string;
}
