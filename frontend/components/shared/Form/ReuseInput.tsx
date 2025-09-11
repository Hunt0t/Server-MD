import { Controller, useFormContext } from "react-hook-form";

type TInputProps = {
  name: string;
  type?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  label?: string;
  errorMessage?: string; 
};

const ReuseInput = ({
  name,
  className = "",
  placeholder,
  type = "text",
  disabled,
  label,
  errorMessage,
}: TInputProps) => {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col space-y-1">
      {label && <label htmlFor={name} className="font-medium">{label}</label>}
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState: { error } }) => (
          <>
            <input
              {...field}
              id={name}
              className={`border p-3 rounded-md focus:outline-none focus:ring-[1px] focus:ring-textColor transition-all duration-200 ${className} ${error ? "border-red-500" : "border-gray-300"}`}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
            />
            {(error || errorMessage) && (
              <p className="text-red-400 text-sm font-medium">
                {errorMessage || error?.message}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
};

export default ReuseInput;
