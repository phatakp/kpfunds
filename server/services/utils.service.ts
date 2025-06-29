import transporter from "@/lib/nodemailer";

const styles = {
    container:
        "max-width:500px;margin:20px auto;padding:20px;border:1px solid #ddd;border-radius:6px;",
    heading: "font-size:20px;color:#333;",
    paragraph: "font-size:16px;",
    code: "display:inline-block;margin-top:15px;padding:10px 15px;background:#007bff;color:#fff;text-decoration:none;border-radius:4px;font-size:24px",
};

export const emailService = {
    sendEmail: async ({
        to,
        subject,
        meta,
    }: {
        to: string;
        subject: string;
        meta: {
            description: string;
            code: string;
        };
    }) => {
        const mailOptions = {
            from: process.env.NODEMAILER_USER,
            to,
            subject: `Better-MoneyMap - ${subject}`,
            html: `
        <div style="${styles.container}">
          <h1 style="${styles.heading}">${subject}</h1>
          <p style="${styles.paragraph}">${meta.description}</p>
          <strong style="${styles.code}">${meta.code}</strong>
        </div>
        `,
        };

        return await transporter.sendMail(mailOptions);
    },
};
