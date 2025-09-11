import { Controller, useFormContext } from "react-hook-form";

type TTextAreaProps = {
  name: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  label?: string;
  errorMessage?: string;
  rows?: number;
};

const ReuseTextArea = ({
  name,
  className = "",
  placeholder,
  disabled,
  label,
  errorMessage,
  rows = 4, // Default rows
}: TTextAreaProps) => {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col space-y-1">
      {label && <label htmlFor={name} className="font-medium">{label}</label>}
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState: { error } }) => (
          <>
            <textarea
              {...field}
              id={name}
              className={`border p-3 rounded-md focus:outline-none focus:ring-[1px] focus:ring-textColor transition-all duration-200 ${className} ${error ? "border-red-500" : "border-gray-300"}`}
              placeholder={placeholder}
              disabled={disabled}
              rows={rows}
            />
            {(error || errorMessage) && (
              <p className="text-red-500 text-sm font-medium">
                {errorMessage || error?.message}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
};

export default ReuseTextArea;
