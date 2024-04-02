import mailer from "nodemailer";
import { getVariables } from "../configs/config.js";

const { mailingService, mailingUser, mailingPassword, mailingPort } = getVariables();

export default class MailingService {
    constructor() {
        this.client = mailer.createTransport({
            service: mailingService,
            port: mailingPort,
            auth: {
                user: mailingUser,
                pass: mailingPassword
            }
        })
    }

    sendSimpleMail = async ({from, to, subject, html, attachments = []}) => {
        const result = await this.client.sendMail({from, to, subject, html, attachments});
        return result;
    };
}