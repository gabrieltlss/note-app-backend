"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passport = void 0;
const passport_1 = __importDefault(require("passport"));
exports.passport = passport_1.default;
const passport_google_oauth20_1 = require("passport-google-oauth20");
const UserServices_1 = require("../services/UserServices");
const userServices = new UserServices_1.UserServices();
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: String(process.env.GOOGLE_CLIENT_ID),
    clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
    callbackURL: String(process.env.GOOGLE_REDIRECT_URI)
}, async (accessToken, refreshToken, profile, done) => {
    try {
        if (typeof profile.emails !== "undefined" && typeof profile.emails[0]?.value !== "undefined") {
            const email = profile.emails[0].value;
            let user = await userServices.getUserByEmail(email);
            if (!user) {
                await userServices.createUser(email);
                user = await userServices.getUserByEmail(email);
                if (!user)
                    throw new Error("Failed to retrieve user after creation");
                return done(null, user);
            }
            return done(null, user);
        }
        // return done(null, false);
        throw new Error("Failed to obtain user information.");
    }
    catch (error) {
        return done(error, false);
    }
}));
