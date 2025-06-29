"use server";

import { ProfileSchema, TUserID } from "@/server/db/types";
import { userService } from "@/server/services/users.service";
import { z } from "zod/v4";

export const getUserById = async (id: TUserID) =>
    await userService.getUserById(id);

export const updateProfile = async (data: z.infer<typeof ProfileSchema>) =>
    await userService.updateProfile(data);
