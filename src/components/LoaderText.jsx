function Loader() {
  return (
    <div className="relative flex w-64 animate-pulse gap-2 p-4">
      <div className="h-12 w-12 rounded-full bg-slate-400" />
      <div className="flex-1">
        <div className="mb-1 h-5 w-3/5 rounded-lg bg-slate-400 text-lg" />
        <div className="h-5 w-[90%] rounded-lg bg-slate-400 text-sm" />
      </div>
    </div>
  );
}

export default Loader;
