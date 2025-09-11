import { Controller, useFormContext } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type TSelectProps = {
  name: string;
  options: { value: string; label: string }[];
  className?: string;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  errorMessage?: string;
};

const ReuseSelectInput = ({
  name,
  options,
  className = "",
  disabled,
  label,
  placeholder = "Select an option",
  errorMessage,
}: TSelectProps) => {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col space-y-1">
      {label && <label htmlFor={name} className="font-medium">{label}</label>}
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState: { error } }) => (
          <>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={disabled}
            >
              <SelectTrigger className={`border p-3 rounded-md focus:outline-none focus:ring-1 focus:ring-textColor transition-all duration-200 ${className} ${error ? "border-red-500" : "border-gray-300"}`}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

export default ReuseSelectInput;
