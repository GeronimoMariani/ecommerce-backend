import dotenv from "dotenv";

export const getVariables = () => {
    dotenv.config();

    return {
        port: process.env.PORT,
        nodeEnv: process.env.NODE_ENV,
        mongoUrl: process.env.MONGO_URL,
        mongoUrlTest: process.env.MONGO_URL_TEST,
        secret: process.env.SECRET_KEY,
        githubClientId: process.env.GITHUB_CLIENT_ID,
        githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
        mailingService: process.env.MAILING_SERVICE,
        mailingUser: process.env.MAILING_USER,
        mailingPassword: process.env.MAILING_PASSWORD,
        mailingPort: process.env.MAILING_PORT
    }
}