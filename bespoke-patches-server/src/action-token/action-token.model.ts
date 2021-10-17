import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { classToPlain, Exclude } from 'class-transformer';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity()
export class ActionToken {
  @Field(() => String)
  @PrimaryColumn()
  uuid: string;

  @Field(() => String)
  @Column()
  @Exclude()
  token: string;

  @Field(() => Boolean)
  @Column()
  enabled: boolean;

  @Field(() => Date)
  @Column()
  expirationDate: Date;

  toJSON() {
    return classToPlain(this);
  }
}
