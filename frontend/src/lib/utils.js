import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

//export const API_BASE = "http://localhost:3000/api/v1";
 export const API_BASE = "https://mlm-04w2.onrender.com/api/v1";
