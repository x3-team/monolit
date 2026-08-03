export function Banner({ message, error }: { message: string | null; error: string | null }) {
  if (!message && !error) return null;
  return (
    <>
      {message && (
        <p className="rounded-md border border-emerald-700/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          {message}
        </p>
      )}
      {error && (
        <p className="rounded-md border border-rose-700/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          {error}
        </p>
      )}
    </>
  );
}
