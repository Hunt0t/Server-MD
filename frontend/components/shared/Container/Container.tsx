import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

interface ContainerProps {
  children: React.ReactNode;
  className?: ClassValue;
}

const Container = ({ children, className }: ContainerProps) => {
  return (
    <div className={twMerge(clsx("md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1280px] 2xl:max-w-[1440px] mx-auto px-3 lg:px-5 xl:px-5 2xl:px-10", className))}>
      {children}
    </div>
  );
};

export default Container;
