import { BUILDINGS } from "@/lib/constants";
import { getFlatsForBuilding } from "@/lib/utils";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { profiles, users } from "./schema";

export const UserDBSchema = createSelectSchema(users);
export const UserIDSchema = UserDBSchema.pick({ id: true });
export const UserSchema = UserDBSchema.pick({
    id: true,
    name: true,
    email: true,
    image: true,
});

export const ProfileDBSchema = createSelectSchema(profiles);
export const ProfileSchema = ProfileDBSchema.pick({
    building: true,
    flat: true,
})
    .extend({
        building: z.enum(BUILDINGS, "Building is required"),
        flat: z.coerce.number(),
    })
    .check((ctx) => {
        if (!getFlatsForBuilding(ctx.value.building).includes(ctx.value.flat)) {
            ctx.issues.push({
                code: "custom",
                message: `Invalid Flat Number`,
                input: ctx.value.flat,
                path: ["flat"],
                continue: true, // make this issue continuable (default: false)
            });
        }
    });
export const ProfileUpdateSchema = ProfileDBSchema.pick({
    userId: true,
    building: true,
    flat: true,
});

export const BuildingSchema = ProfileDBSchema.pick({ building: true });

export const UserProfileSchema = z.object({
    ...UserSchema.shape,
    ...ProfileSchema.shape,
});

//TYPES
export type TUserID = z.infer<typeof UserIDSchema>["id"];
export type TBuilding = z.infer<typeof BuildingSchema>["building"];

export type TUserProfile = z.infer<typeof UserProfileSchema>;
