import { useGetFileQuery } from "@/app/redux/api/product/productApi";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setStates } from "@/app/redux/api/filters/stateSlice";

const StateSelectFileName = ({
  value,
  onStateChange,
}: {
  value: string;
  onStateChange?: (state: string) => void;
}) => {
  const { data, isLoading } = useGetFileQuery({});
  const dispatch = useDispatch();

  useEffect(() => {
    if (data?.data) {
      dispatch(setStates(data.data));
    }
  }, [data, dispatch]);

  const handleChange = (state: string) => {
    if (onStateChange) {
      if (state === "no") {
        onStateChange("");
      } else {
        onStateChange(state);
      }
    }
  };

  if (isLoading) return <p className="hidden">loading</p>;
  return (
    <div>
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a file" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Select File</SelectLabel>
            <SelectItem key="all" value="no">
              All Data
            </SelectItem>
            {data?.data?.map((state: string) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default StateSelectFileName;
