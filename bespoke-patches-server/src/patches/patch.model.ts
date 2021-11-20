import {
  Field,
  Int,
  ObjectType,
  OmitType,
  registerEnumType,
} from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

export enum PatchStatus {
  WAITING_FOR_APPROVAL,
  APPROVED,
}

export enum PatchType {
  PATCH = 'patch',
  PREFAB = 'prefab',
}

registerEnumType(PatchStatus, {
  name: 'PatchStatus',
});

registerEnumType(PatchType, {
  name: 'PatchType',
});

@ObjectType()
@Entity()
export class Patch {
  @Field(() => String)
  @PrimaryColumn()
  uuid: string;

  @Field(() => PatchType)
  @Column()
  type: PatchType;

  @Field(() => String)
  @Column()
  title: string;

  @Field(() => String)
  @Column()
  author: string;

  @Field(() => String)
  @Column()
  appVersion: string;

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
  bsFile: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  thumbnailImage?: string;

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
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  publicationDate: Date;

  @Field(() => String)
  @Column({ default: '[]' })
  content: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  _token?: string;

  getStorageDir(): string {
    return `${process.env.STORAGE_DIR}/${this.uuid}`;
  }

  getPath(pathEnd: string): string {
    return `${this.getStorageDir()}/${pathEnd}`;
  }
}

@ObjectType()
export class PatchOutput extends OmitType(Patch, ['_token', 'mail'] as const) {}
