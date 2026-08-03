import { NextResponse } from "next/server";
import { AppError } from "@/lib/errors";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Turns a thrown error into an API response. Only `AppError` messages (ones
 * we deliberately wrote for the client) are ever sent back — everything else
 * is logged server-side and replaced with a generic message so internal
 * details (Prisma errors, stack traces, file paths) never reach the browser.
 */
export function handleError(error: unknown) {
  if (error instanceof AppError) return err(error.message, error.status);
  console.error(error);
  return err("Ошибка сервера. Мы уже знаем об этом — попробуйте ещё раз.", 500);
}
