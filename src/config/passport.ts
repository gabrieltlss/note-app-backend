import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import { UserServices } from "../services/UserServices";
dotenv.config();

const userServices = new UserServices();

passport.use(
    new GoogleStrategy(
        {
            clientID: String(process.env.GOOGLE_CLIENT_ID),
            clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
            callbackURL: String(process.env.GOOGLE_REDIRECT_URI)
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = null;
                if (typeof profile.emails !== "undefined" && typeof profile.emails[0]?.value !== "undefined") {
                    const email = profile.emails[0].value;
                    user = await userServices.getUser(email);

                    if (!user) {
                        await userServices.createUser(email);
                        user = await userServices.getUser(email);
                        return done(null, user);
                    }

                    return done(null, user);
                }

                return done(null, false);
            } catch (error) {
                return done(error, false);
            }
        })
);

export { passport };