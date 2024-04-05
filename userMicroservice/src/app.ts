import express, { Express, Request, Response } from "express";
import { connect, HydratedDocument } from 'mongoose';
import { createTransport, Transporter } from 'nodemailer';
import { IUser, IUserMethods, User } from "./models/user";
import { join } from 'path';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import SMTPTransport from "nodemailer/lib/smtp-transport";
import cors from "cors";

const PORT: number = parseInt(process.env.PORT) ?? 3001;
const DB_HOST: string = process.env.DB_HOST ?? 'localhost';
const DB_PORT: string = process.env.DB_PORT ?? '27017';
const DB_AUTH_SOURCE: string = process.env.DB_AUTH_SOURCE ?? 'admin';
const DB_NAME: string = process.env.DB_NAME ?? 'userDB';
const DB_USER: string = process.env.DB_USER ?? 'root';
const DB_PASSWORD: string = process.env.DB_PASSWORD ??'example';
const MAIL_SERVICE: string = process.env.MAIL_SERVICE ?? 'Yandex';
// const MAIL_USER: string = 'doju57@yandex.com';
// const MAIL_PASSWORD: string = 'zouzdnzlaczhljnw';
const MAIL_USER: string = process.env.MAIL_USER ?? 'netplaner@yandex.com';
const MAIL_PASSWORD: string = process.env.MAIL_PASSWORD ?? 'appmecniptnrogny';
const DOMAIN_USER_MS: string = process.env.DOMAIN_USER_MS ?? 'http://localhost:3001';
const DOMAIN_FRONT: string = process.env.DOMAIN_FRONT ?? 'http://localhost:3000';
const JWT_EXPIRATION: number = parseInt(process.env.JWT_EXPIRATION) ?? 120;
const RSA_PUBLIC_FILE: string = process.env.RSA_PUBLIC_FILE ?? '../../rsaKeys/public.pem';
const RSA_PRIVATE_FILE: string = process.env.RSA_PRIVATE_FILE ?? '../../rsaKeys/private.pem';

const app: Express = express();

app.use(express.json())
app.use(cors<Request>()); 

connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
    authSource: DB_AUTH_SOURCE,
    user: DB_USER,
    pass: DB_PASSWORD,
});

var mailTransporter: Transporter<SMTPTransport.SentMessageInfo> = createTransport({
    service: MAIL_SERVICE,
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD
    },
});

var rsaPrivateKey: string = fs.readFileSync(join(__dirname, RSA_PRIVATE_FILE)).toString();
var rsaPublicKey: string = fs.readFileSync(join(__dirname, RSA_PUBLIC_FILE)).toString();

var validateToken = (req: Request, res: Response, next: any) => {
    var accessToken: string = req.header("Authorization").split(' ')[1];
    jwt.verify(accessToken, rsaPublicKey, (err, _) => {
        if (err){
            res.sendStatus(401);
        }
        else{
            next();
        }
    })
}

interface IDecodedAccessToken{
    email: string,
    deviceId: string,
}

app.post('/register', async (req: Request, res: Response) => {
    var verificationCode: string = '';
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( let i = 0; i < 9; i++ ) {
        verificationCode += characters.charAt(Math.floor(Math.random()*characters.length));
    }
    var user: HydratedDocument<IUser, IUserMethods> = new User({
        email: req.body.email,
        emailVerificationCode: verificationCode,
        emailVerified: false,
    });

    user.createHash(req.body.password);

    await user.save();

    await mailTransporter.sendMail({    
        from: MAIL_USER,
        to: user.email,
        subject: 'JustDo verify email',
        html: `<html>
            <head></head>
            <body>
                <h1>Press link to confirm registration</h1>
                <a href="${DOMAIN_USER_MS}/verifyEmail?email=${user.email}&verificationCode=${user.emailVerificationCode}">  
                    Confirm Email  
                </a>  
            </body>
        </html>`
    }) 
    
    res.sendStatus(200);
});

app.get('/verifyEmail', async (req: Request, res: Response) => {
    var user: HydratedDocument<IUser, IUserMethods> = await User.findOne({'email': req.query.email.toString()});
    if (!user){
        res.sendStatus(210);
        return;
    }
    if (user.verifyEmail(req.query.verificationCode.toString())){
        await user.save();
        res.redirect(`${DOMAIN_FRONT}/emailVerified`);
    }
    else{
        res.sendStatus(211);
    }
});

app.post('/login', async (req: Request, res: Response) => {
    var user: HydratedDocument<IUser, IUserMethods> = await User.findOne({'email': req.body.email});
    if (!user){
        res.sendStatus(210);
        return;
    }
    if (!user.emailVerified){
        res.sendStatus(211);
        return;
    }
    if (!user.validatePassword(req.body.password)){
        res.sendStatus(212);
        return;
    }
    var refreshToken: string = user.genRefreshToken(req.body.deviceId);
    await user.save();
    var accessToken = jwt.sign({email: user.email, deviceId: req.body.deviceId}, 
        rsaPrivateKey, 
        {algorithm: 'RS256', expiresIn: JWT_EXPIRATION});

    res.json({"accessToken": accessToken, "refreshToken": refreshToken});
});

app.post('/refresh', async (req: Request, res: Response) => {
    var accessToken: string = req.header("Authorization").split(' ')[1];
    var decodedToken: IDecodedAccessToken = jwt.decode(accessToken);
    var user = await User.findOne({'email': decodedToken['email']});
    if (!user){
        res.sendStatus(210);
        return;
    }
    if (!user.emailVerified){
        res.sendStatus(211);
        return;
    }
    if (!user.checkRefreshToken(req.body.refreshToken, decodedToken['deviceId'])){
        res.sendStatus(212);
        return;
    }
    var refreshToken: string = user.genRefreshToken(decodedToken['deviceId']);
    await user.save();
    accessToken = jwt.sign({email: user.email}, rsaPrivateKey, {algorithm: 'RS256', expiresIn: JWT_EXPIRATION});
    res.json({"accessToken": accessToken, "refreshToken": refreshToken});
});

app.post('/logout', validateToken, async (req: Request, res: Response) => {
    var accessToken: string = req.header("Authorization").split(' ')[1];
    var decodedToken: IDecodedAccessToken = jwt.decode(accessToken);
    var user = await User.findOne({'email': decodedToken['email']});
    if (!user){
        res.sendStatus(210);
        return;
    }
    if (!user.emailVerified){
        res.sendStatus(211);
        return;
    }
    user.deleteDeviceToken(decodedToken['deviceId']);
    await user.save();
    res.sendStatus(200);
});

app.listen(PORT);

console.log(`Listening at http://localhost:${PORT}`);