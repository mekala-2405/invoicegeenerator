export const Field = () => {
  return (
    <div className="flex gap-2 w-full justify-end">
      <input
        type="text"
        className="w-56 bg-gray-50 p-2 border-b border-slate-200 text-sm placeholder:text-gray-400 focus:outline-none focus:border-slate-400"
        placeholder="Add a Label"
      />
      <input
        type="text"
        className="w-32 bg-gray-50 px-2 py-1.5 border border-slate-200 rounded-sm text-sm placeholder:text-gray-400 focus:outline-none focus:border-slate-400"
        placeholder="Add a Value"
      />
      <div></div>
    </div>
  );
};
