interface ItemProps {
  data: ItemDataType;
  onChange: (data: ItemDataType) => void;
  onRemove: () => void;
}
export interface ItemDataType {
  description: string;
  qty: number;
  price: number;
  discount: number;
  gst: number;
}

export const Item = (props: ItemProps) => {
  return (
    <div className="w-full relative group">
      {/* Main row */}
      <div className="w-full h-10 grid grid-cols-[5fr_1fr_1fr_1fr_1fr_1fr] text-black items-center">
        <input
          type="text"
          value={props.data.description}
          onChange={(e) => {
            props.onChange({
              ...props.data,
              description: e.target.value,
            });
          }}
          className="w-full bg-gray-50 px-2 py-1.5 border border-slate-200 rounded-sm text-sm placeholder:text-gray-400 focus:outline-none focus:border-slate-400"
          placeholder="Enter item name/description"
        />
        <input
          type="number"
          className="text-right w-full [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none bg-gray-50 px-2 py-1.5 border border-slate-200 rounded-sm text-sm placeholder:text-gray-400 focus:outline-none focus:border-slate-400"
          placeholder="1"
          value={props.data.qty}
          onChange={(e) => {
            const value = e.target.value ? Number(e.target.value) : 1;
            props.onChange({
              ...props.data,
              qty: value,
            });
          }}
        />
        <div className="w-full flex outline-1 outline-transparent focus-within:outline-slate-400 rounded-sm">
          <div className="border-r-0 rounded-r-none bg-gray-50 pl-2 py-1.5 border border-slate-200 text-sm flex items-center">
            ₹
          </div>
          <input
            type="number"
            className="text-right w-full border-l-0 bg-gray-50 px-2 py-1.5 border border-slate-200 rounded-l-none text-sm placeholder:text-gray-400 rounded-sm focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            placeholder="0.00"
            value={props.data.price}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : 0;
              props.onChange({
                ...props.data,
                price: value,
              });
            }}
          />
        </div>
        <input
          value={props.data.discount}
          onChange={(e) => {
            const value = e.target.value ? Number(e.target.value) : 0;
            props.onChange({
              ...props.data,
              discount: value,
            });
          }}
          type="number"
          className="text-right w-full [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none bg-gray-50 px-2 py-1.5 border border-slate-200 rounded-sm text-sm placeholder:text-gray-400 focus:outline-none focus:border-slate-400"
          placeholder="0%"
        />
        <input
          value={props.data.gst}
          onChange={(e) => {
            const value = e.target.value ? Number(e.target.value) : 0;
            props.onChange({
              ...props.data,
              gst: value,
            });
          }}
          type="number"
          className="text-right w-full [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none bg-gray-50 px-2 py-1.5 border border-slate-200 rounded-sm text-sm placeholder:text-gray-400 focus:outline-none focus:border-slate-400"
          placeholder="0%"
        />
        <div className="w-full flex outline-1 outline-transparent focus-within:outline-slate-400 rounded-sm">
          <div className="border-r-0 rounded-r-none bg-gray-50 pl-2 py-1.5 border border-slate-200 text-sm flex items-center">
            ₹
          </div>
          <div className="text-right w-full border-l-0 bg-gray-50 px-2 py-1.5 border border-slate-200 rounded-l-none text-sm placeholder:text-gray-400 rounded-sm focus:outline-none">
            ₹
            {(
              props.data.qty *
              props.data.price *
              (1 - props.data.discount / 100) *
              (1 + props.data.gst / 100)
            ).toFixed(2)}
          </div>
        </div>{" "}
      </div>

      <div
        onClick={props.onRemove}
        className="absolute -right-7 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center px-2 text-red-500 font-bold cursor-pointer z-10"
      >
        X
      </div>
    </div>
  );
};
