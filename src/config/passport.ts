import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { UserServices } from "../services/UserServices";

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
                if (typeof profile.emails !== "undefined" && typeof profile.emails[0]?.value !== "undefined") {
                    const email = profile.emails[0].value;
                    let user = await userServices.getUser(email);

                    if (!user) {
                        await userServices.createUser(email);
                        user = await userServices.getUser(email);
                        if (!user) throw new Error("Failed to retrieve user after creation");
                        return done(null, user);
                    }
                    return done(null, user);
                }

                // return done(null, false);
                throw new Error("Failed to obtain user information.");
            } catch (error) {
                return done(error, false);
            }
        })
);

export { passport };