import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
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
