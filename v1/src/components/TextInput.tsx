interface TextInputProps {
  placeholder?: string;
  text?: string;
  onChange?: (value: string) => void;
}
export const TextInput = (props: TextInputProps) => {
  return (
    <input
      type="text"
      className="w-72 bg-gray-50 px-2 py-1.5 border border-slate-200 rounded-sm text-sm placeholder:text-gray-400 focus:outline-none focus:border-slate-400"
      placeholder={props.placeholder}
      value={props.text}
      onChange={(e) => {
        if (props.onChange) {
          props.onChange(e.target.value);
        }
      }}
    />
  );
};
