import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {hash} from "bcrypt";

@Schema()
export class UserEntity {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  refreshToken?: string;
}

export const UserEntitySchema = SchemaFactory.createForClass(UserEntity)

UserEntitySchema.pre<UserEntity>('save', async function (next: Function) {
  this.password = await hash(this.password, 10)
  next()
})