/**
 * Domain error with a message that is safe to show to the client.
 * Anything thrown that is NOT an AppError is treated as unexpected: it is
 * logged in full on the server but the client only ever sees a generic
 * message, so stack traces / Prisma column names / file paths never leak.
 */
export class AppError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "AppError";
    this.status = status;
  }
}
