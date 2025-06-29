import { auth } from "@/lib/auth";
import { ProfileSchema, TUserID } from "@/server/db/types";
import { userRepo } from "@/server/repositories/users.repo";
import { headers } from "next/headers";
import { z } from "zod/v4";

export const userService = {
    getUserById: async (id: TUserID) => await userRepo.getUserById(id),
    updateProfile: async (data: z.infer<typeof ProfileSchema>) => {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user.id) throw new Error("Not Authenticated");

        const values = ProfileSchema.parse(data);
        return await userRepo.updateProfile({
            ...values,
            userId: session.user.id,
        });
    },
};
