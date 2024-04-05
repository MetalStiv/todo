import { Schema, model } from 'mongoose';

interface IRefreshToken {
    deviceId: string,
    refreshToken: string
}

const RefreshTokenSchema = new Schema<IRefreshToken>({
    deviceId: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    }
});

const RefreshTokenModel = model<IRefreshToken>("RefreshTokensSchema", RefreshTokenSchema);

export {IRefreshToken, RefreshTokenModel, RefreshTokenSchema}