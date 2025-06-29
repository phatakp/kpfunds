import * as utilsAction from "@/actions/utils.action";
import { db, schema } from "@/server/db";
import { betterAuth, BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { customSession, emailOTP } from "better-auth/plugins";

const options = {
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
        usePlural: true,
    }),
    databaseHooks: {
        user: {
            create: {
                after: async (user) => {
                    // try {
                    //     await db.transaction(async (tx) => {
                    //         await Promise.all([
                    //             groupAction.createPersonalGroupAction(
                    //                 user.id,
                    //                 tx
                    //             ),
                    //             acctAction.createCashAccountAction(user.id, tx),
                    //         ]);
                    //     });
                    // } catch (err) {}
                },
            },
        },
    },
    advanced: {
        database: {
            generateId: false,
        },
    },
    socialProviders: {
        google: {
            clientId: String(process.env.GOOGLE_CLIENT_ID),
            clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
        },
    },
    session: {
        expiresIn: 30 * 24 * 60 * 60,
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60, // Cache duration in seconds
        },
    },
    plugins: [
        nextCookies(),
        emailOTP({
            sendVerificationOnSignUp: true,
            async sendVerificationOTP({ email, otp, type }) {
                if (type === "sign-in")
                    await utilsAction.sendEmailAction({
                        to: email,
                        otp: String(otp),
                    });
            },
        }),
    ],
} satisfies BetterAuthOptions;

export const auth = betterAuth({
    ...options,
    plugins: [
        ...(options.plugins ?? []),
        customSession(async ({ user, session }) => {
            return {
                session: {
                    expiresAt: session.expiresAt,
                    token: session.token,
                    userAgent: session.userAgent,
                },
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                },
            };
        }, options),
    ],
});
export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN";
