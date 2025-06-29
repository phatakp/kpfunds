import { clsx, type ClassValue } from "clsx";
import { FieldError, FieldErrors, FieldValues } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { z } from "zod/v4";
import { BUILDING_FLOORS, PER_FLOOR_FLATS } from "./constants";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getFlatsForBuilding(building: keyof typeof BUILDING_FLOORS) {
    const floors = BUILDING_FLOORS[building];
    const result = [];
    for (let i = 1; i <= floors; i++)
        for (let j = 1; j <= PER_FLOOR_FLATS; j++) result.push(i * 100 + j);
    return result;
}

// Utility to convert ZodError to Hook Form-compatible FieldErrors
const zodToHookFormErrors = (zodError: z.ZodError): FieldErrors => {
    const errors: FieldErrors = {};

    for (const issue of zodError.issues) {
        const path = issue.path.join(".") || "root";
        errors[path] = {
            type: issue.code,
            message: issue.message,
        } as FieldError;
    }

    return errors;
};

// Custom resolver for useForm()
export const customResolver = (schema: z.ZodType) => {
    return async (
        values: FieldValues
    ): Promise<{
        values: FieldValues;
        errors: FieldErrors;
    }> => {
        try {
            const result = await schema.safeParseAsync(values);

            if (result.success) {
                return {
                    values: result.data as FieldValues,
                    errors: {},
                };
            } else {
                return {
                    values: {},
                    errors: zodToHookFormErrors(result.error),
                };
            }
        } catch (error) {
            console.error("Resolver error: ", error);
            return {
                values: {},
                errors: {
                    root: {
                        type: "unknown",
                        message: "An unknown error occurred during validation",
                    } as FieldError,
                },
            };
        }
    };
};
