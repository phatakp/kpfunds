import { type ClassValue, clsx } from 'clsx';
import type { FieldError, FieldErrors, FieldValues } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod/v4';
import { BUILDING_FLOORS, PER_FLOOR_FLATS } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const getURL = () => {
  let url =
    (process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    process.env.NODE_ENV === 'production')
      ? 'https://kpfunds.vercel.app'
      : 'http://localhost:3000';

  // Make sure to include a trailing `/`.
  url = url.endsWith('/') ? url : `${url}/`;
  return url;
};

export type TypeToZod<T> = Required<{
  [K in keyof T]: T[K] extends string | number | boolean | null | undefined
    ? undefined extends T[K]
      ? z.ZodDefault<z.ZodType<Exclude<T[K], undefined>>>
      : z.ZodType<T[K]>
    : z.ZodObject<TypeToZod<T[K]>>;
}>;

export const createZodObject = <T>(obj: TypeToZod<T>) => {
  return z.object(obj);
};

export function getISTDate(date: string) {
  return new Date(
    new Date(date).getTime() +
      (330 + new Date(date).getTimezoneOffset()) * 60_000
  );
}

export function slugify(str: string) {
  return str
    .replace(/^\s+|\s+$/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-'); // remove consecutive hyphens
}

export function getFlatsForBuilding(building: keyof typeof BUILDING_FLOORS) {
  const floors = BUILDING_FLOORS[building];
  const result: number[] = [];
  for (let i = 1; i <= floors; i++)
    for (let j = 1; j <= PER_FLOOR_FLATS; j++) result.push(i * 100 + j);
  return result;
}

// Utility to convert ZodError to Hook Form-compatible FieldErrors
const zodToHookFormErrors = (zodError: z.ZodError): FieldErrors => {
  const errors: FieldErrors = {};

  for (const issue of zodError.issues) {
    const path = issue.path.join('.') || 'root';
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
      }
      return {
        values: {},
        errors: zodToHookFormErrors(result.error),
      };
    } catch (error) {
      console.error('Resolver error: ', error);
      return {
        values: {},
        errors: {
          root: {
            type: 'unknown',
            message: 'An unknown error occurred during validation',
          } as FieldError,
        },
      };
    }
  };
};

export function amountFormatter(val: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    currencyDisplay: 'code',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .formatToParts(val)
    .map((p) => (p.type !== 'literal' && p.type !== 'currency' ? p.value : ''))
    .join('');
}
