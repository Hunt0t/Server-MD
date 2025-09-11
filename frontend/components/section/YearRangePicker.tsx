// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState } from "react";
// import { set } from "date-fns";
// import { useDispatch, useSelector } from "react-redux";
// import { Button } from "@/components/ui/button";
// import { X } from "lucide-react";
// import { RootState } from "@/app/redux/featuers/store";
// import { clearYearRange, setYearRange } from "@/app/redux/api/filters/yearRangeSlice";

// export default function YearRangeFilter() {
//   const dispatch = useDispatch();
//   const { startYear, endYear } = useSelector((state: RootState) => state.yearRange);

//   const [start, setStart] = useState<any>(startYear ?? "");
//   const [end, setEnd] = useState<any>(endYear ?? "");

//   const handleFilter = () => {
    
//     const startDate = set(new Date(), { year: start, month: 0, date: 1, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
//     const startYearISO = startDate.toISOString();

//     const endDate = set(new Date(), { year: end, month: 11, date: 31, hours: 23, minutes: 59, seconds: 59, milliseconds: 999 });
//     const endYearISO = endDate.toISOString();
//     console.log("Start Year ISO:", startYearISO, "End Year ISO:", endYearISO); // Example: 2025-01-01T00:00:00.000Z, 2025-12-31T23:59:59.999Z
//     dispatch(setYearRange({ startYear: startYearISO, endYear: endYearISO }));
//   };

//   const handleClear = () => {
//     setStart("");
//     setEnd("");
//     dispatch(clearYearRange());
//   };

//   return (
//     <div className="flex flex-col md:flex-row items-center gap-3 p-2 bg-white shadow rounded-md">
//       <div className="flex items-center gap-2">
//         <input
//           type="number"
//           placeholder="Start Year"
//           value={start}
//           onChange={(e: any) => setStart(e.target.value)}
//           className="w-32 border py-1 px-2 rounded-md"
//         />
//         <span className="font-semibold">-</span>
//         <input
//           type="number"
//           placeholder="End Year"
//           value={end}
//           onChange={(e: any) => setEnd(e.target.value)}
//           className="w-32 border py-1 px-2 rounded-md"
//         />
//         { (start || end) && (
//           <button onClick={handleClear} className="ml-2 text-gray-500 hover:text-gray-700">
//             <X className="w-5 h-5" />
//           </button>
//         )}
//       </div>
//       <Button onClick={handleFilter} className="bg-blue-500 text-white hover:bg-blue-600">
//         Filter
//       </Button>
//     </div>
//   );
// }


/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { set } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { RootState } from "@/app/redux/featuers/store";
import { clearYearRange, setYearRange } from "@/app/redux/api/filters/yearRangeSlice";

export default function YearRangeFilter() {
  const dispatch = useDispatch();
  const { startYear, endYear } = useSelector(
    (state: RootState) => state.yearRange
  );

  const [start, setStart] = useState<number | "">(startYear ? new Date(startYear).getFullYear() : "");
  const [end, setEnd] = useState<number | "">(endYear ? new Date(endYear).getFullYear() : "");

  const handleFilter = () => {
    if (!start || !end) return;

    // Convert year numbers into full ISO strings
    const startDate = set(new Date(), {
      year: Number(start),
      month: 0,
      date: 1,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });
    const startYearISO = startDate.toISOString();

    const endDate = set(new Date(), {
      year: Number(end),
      month: 11,
      date: 31,
      hours: 23,
      minutes: 59,
      seconds: 59,
      milliseconds: 999,
    });
    const endYearISO = endDate.toISOString();

    dispatch(setYearRange({ startYear: startYearISO, endYear: endYearISO }));
  };

  const handleClear = () => {
    setStart("");
    setEnd("");
    dispatch(clearYearRange());
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-3 p-2 bg-white shadow rounded-md">
      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder="Start Year"
          value={start}
          onChange={(e) =>
            setStart(e.target.value ? Number(e.target.value) : "")
          }
          className="w-32 border py-1 px-2 rounded-md"
        />
        <span className="font-semibold">-</span>
        <input
          type="number"
          placeholder="End Year"
          value={end}
          onChange={(e) =>
            setEnd(e.target.value ? Number(e.target.value) : "")
          }
          className="w-32 border py-1 px-2 rounded-md"
        />
        {(start || end) && (
          <button
            onClick={handleClear}
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      <Button
        onClick={handleFilter}
        className="bg-blue-500 text-white hover:bg-blue-600"
      >
        Filter
      </Button>
    </div>
  );
}
