"use server";

import { emailService } from "@/services/utils.service";

export const sendEmailAction = async ({
    to,
    otp,
}: {
    to: string;
    otp: string;
}) =>
    emailService.sendEmail({
        to,
        subject: "Login OTP",
        meta: {
            description: "Please enter the OTP below to login.",
            code: otp,
        },
    });
