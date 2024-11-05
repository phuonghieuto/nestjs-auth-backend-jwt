export declare class UserEntity {
    email: string;
    name: string;
    password: string;
    createdAt: Date;
    refreshToken?: string;
}
export declare const UserEntitySchema: import("mongoose").Schema<UserEntity, import("mongoose").Model<UserEntity, any, any, any, import("mongoose").Document<unknown, any, UserEntity> & UserEntity & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UserEntity, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<UserEntity>> & import("mongoose").FlatRecord<UserEntity> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}>;
