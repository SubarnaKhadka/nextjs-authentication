import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import ms from "ms";
import { APP_BASE_URL } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function seconds(msValue: string): number {
  return ms(msValue) / 1000;
}

export function baseUrl(endPoint: string): string {
  return APP_BASE_URL.replace(/\/+$/, "") + endPoint;
}
