import { db } from "@/server/db";
import { profiles } from "@/server/db/schema";
import { ProfileUpdateSchema, TUserID, TUserProfile } from "@/server/db/types";
import { z } from "zod/v4";

export const userRepo = {
    getUserById: async (id: TUserID) =>
        (await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, id),
            columns: { id: true, name: true, email: true, image: true },
            with: { profile: { columns: { building: true, flat: true } } },
        })) as TUserProfile | undefined,

    updateProfile: async (data: z.infer<typeof ProfileUpdateSchema>) => {
        const { userId, ...rest } = ProfileUpdateSchema.parse(data);
        return await db
            .insert(profiles)
            .values(data)
            .onConflictDoUpdate({ target: [profiles.userId], set: rest })
            .returning()
            .then((res) => res[0]);
    },
};
