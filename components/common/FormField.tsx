import {
  FieldErrors,
  UseFormRegister,
  Path,
  FieldValues,
} from "react-hook-form";
import { cn } from "@/lib/utils";

interface FormFieldProps<T extends FieldValues> {
  id: string;
  type?: string;
  disabled?: boolean;
  placeholder: string;
  label?: string;
  inputClassNames?: string;
  register: UseFormRegister<T>;
  errors: FieldErrors;
}

const FormField = <T extends FieldValues>({
  id,
  type,
  disabled,
  placeholder,
  label,
  inputClassNames,
  register,
  errors,
}: FormFieldProps<T>) => {
  const message = errors[id] && (errors[id]?.message as string);
  return (
    <div>
      {label && <span className="block text-sm">{label}</span>}
      <input
        id={id}
        disabled={disabled}
        type={type}
        placeholder={placeholder}
        {...register(id as Path<T>)}
        className={cn(
          "w-full p-3 my-2 outline-none rounded-md disabled:opacity-70 disabled:cursor-not-allowed border border-slate-300 dark:border-slate-700",
          errors[id] && "border-rose-400",
          inputClassNames
        )}
      />
      {message && <span className="text-rose-400 text-sm">{message}</span>}
    </div>
  );
};

export default FormField;
