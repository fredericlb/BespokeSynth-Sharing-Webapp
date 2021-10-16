import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

export enum PatchStatus {
  WAITING_FOR_APPROVAL,
  APPROVED,
}

registerEnumType(PatchStatus, {
  name: 'PatchStatus',
});

@ObjectType()
@Entity()
export class Patch {
  @Field(() => String)
  @PrimaryColumn()
  uuid: string;

  @Field(() => String)
  @Column()
  title: string;

  @Field(() => String)
  @Column()
  author: string;

  @Field(() => String)
  @Column()
  mail: string;

  @Field(() => [String])
  @Column('text', {
    array: true,
  })
  tags: string[];

  @Field(() => String)
  @Column()
  bskFile: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  coverImage?: string;

  @Field(() => [String])
  @Column('text', {
    array: true,
  })
  audioSamples: string[];

  @Field(() => String)
  @Column()
  summary: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field(() => PatchStatus)
  @Column({ default: PatchStatus.WAITING_FOR_APPROVAL })
  status: PatchStatus;

  @Field(() => Int)
  @Column({ default: 1 })
  revision: number;

  @Field(() => Date)
  publicationDate: Date;

  @Field(() => String)
  modules: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  _token?: string;
}
