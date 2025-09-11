import { ReactNode, useEffect } from "react";
import {
  FieldValues,
  FormProvider,
  Resolver,
  SubmitHandler,
  useForm,
  UseFormProps,
} from "react-hook-form";

type TFormProps<T extends FieldValues> = {
  children: ReactNode;
  onSubmit: SubmitHandler<T>;
  resolver?: Resolver<T>;
  defaultValues?: UseFormProps<T>["defaultValues"];
  className?: string;
  setFormMethods?: (methods: ReturnType<typeof useForm<T>>) => void;

};

const ReuseMainForm = <T extends FieldValues>({
  children,
  onSubmit,
  resolver,
  defaultValues,
  className = "",
  setFormMethods,
}: TFormProps<T>) => {
  const methods = useForm<T>({ resolver, defaultValues });

 
  useEffect(() => {
    if (setFormMethods) {
      setFormMethods(methods);
    }
  }, [methods, setFormMethods]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className={`${className}`}
      >
        {children}
      </form>
    </FormProvider>
  );
};

export default ReuseMainForm;
