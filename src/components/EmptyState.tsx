export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/50 px-6 py-12 text-center text-sm text-slate-500">
      {message}
    </div>
  );
}
