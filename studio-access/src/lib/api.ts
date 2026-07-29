import { NextResponse } from "next/server";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function handleError(error: unknown) {
  if (error instanceof Error) {
    if (error.message === "UNAUTHORIZED") return err("Unauthorized", 401);
    if (error.message === "FORBIDDEN") return err("Forbidden", 403);
  }
  console.error(error);
  return err(error instanceof Error ? error.message : "Server error", 500);
}
