import { Model, Schema, model } from 'mongoose';
import * as pbkdf2 from 'pbkdf2';
import * as crypto from "crypto";
import { IRefreshToken, RefreshTokenModel, RefreshTokenSchema } from './refreshToken';

interface IUser {
    email: string,
    passwordHash: string,
    salt: string,
    emailVerificationCode: string,
    emailVerified: boolean,
    refreshTokens: IRefreshToken[]
}

interface IUserMethods {
    verifyEmail(verificationCode: string): string,
    createHash(plainTextPassword: string): void,
    validatePassword(candidatePassword: string): boolean,
    genRefreshToken(deviceId: string): string,
    checkRefreshToken(refreshToken: string, deviceId: string): boolean,
    deleteDeviceToken(deviceId: string): void
}

type UserModel = Model<IUser, {}, IUserMethods>;

var userSchema = new Schema<IUser, UserModel, IUserMethods>({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        required: true,
    },
    emailVerificationCode: {
        type: String,
        required: true,
    },
    emailVerified: {
        type: Boolean,
        required: true,
    },
    refreshTokens: [RefreshTokenSchema],
});

userSchema.method('verifyEmail', function (verificationCode: string): boolean {
    if (verificationCode === this.emailVerificationCode){
        this.emailVerified = true;
    }
    return this.emailVerified;
});

userSchema.method('createHash', function(plainTextPassword: string): void {
    var salt: string = crypto.randomBytes(16).toString("hex");
    var passwordHash: string = pbkdf2
        .pbkdf2Sync(plainTextPassword, salt, 10, 32, "sha512")
        .toString("hex");
    this.salt = salt;
    this.passwordHash = passwordHash;
    return;
});
  
userSchema.method('validatePassword', function (candidatePassword: string): boolean {
    const hash = pbkdf2
        .pbkdf2Sync(candidatePassword, this.salt, 10, 32, "sha512")
        .toString("hex");
  
    if (hash === this.passwordHash) {
        return true;
    }
    return false;
});

userSchema.method('genRefreshToken', function (deviceId: string): string {
    var refreshToken: string = crypto.randomBytes(16).toString("hex");
    var token: IRefreshToken = this.refreshTokens.find(token => token.deviceId === deviceId);
    if (token){
        token.refreshToken = refreshToken;
    }
    else{
        this.refreshTokens.push(new RefreshTokenModel({
            deviceId: deviceId,
            refreshToken: refreshToken
        }))
    }
    return refreshToken;
});

userSchema.method('checkRefreshToken', function (refreshToken: string, deviceId: string): boolean {
    var token: IRefreshToken = this.refreshTokens.find(token => token.deviceId === deviceId);
    if (!token){
        return false;
    }
    return token.refreshToken === refreshToken;
});

userSchema.method('deleteDeviceToken', function (deviceId: string): void {
    var tokenInd: number = this.refreshTokens.findIndex(token => token.deviceId === deviceId);
    if (tokenInd !== -1){
        this.refreshTokens = [...this.refreshTokens.splice(0, tokenInd), 
            ...this.refreshTokens.splice(tokenInd+1, this.refreshTokens.length-1)];
    }
});

const User = model<IUser, UserModel>("User", userSchema);

export { IUser, User, IUserMethods };