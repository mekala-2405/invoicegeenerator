interface TextAreaProps {
  placeholder?: string;
  text?: string;
  onChange?: (value: string) => void;
}
export const TextArea = (props: TextAreaProps) => {
  return (
    <textarea
      placeholder={props.placeholder}
      value={props.text}
      onChange={(e) => {
        if (props.onChange) {
          props.onChange(e.target.value);
        }
      }}
      className="w-72 bg-gray-50 h-20 px-2 py-1.5 border border-slate-200 rounded-sm text-sm placeholder:text-gray-400 focus:outline-none focus:border-slate-400"
    />
  );
};
