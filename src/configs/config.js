import dotenv from "dotenv";

export const getVariables = () => {
    dotenv.config();

    return {
        port: process.env.PORT,
        mongoUrl: process.env.MONGO_URL,
        secret: process.env.SECRET_KEY,
        githubClientId: process.env.GITHUB_CLIENT_ID,
        githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
        mailingService: process.env.MAILING_SERVICE,
        mailingUser: process.env.MAILING_USER,
        mailingPassword: process.env.MAILING_PASSWORD,
        mailingPort: process.env.MAILING_PORT
    }
}