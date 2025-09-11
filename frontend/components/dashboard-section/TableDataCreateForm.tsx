/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ReuseMainForm from "../shared/Form/ReuseMainForm";
import ReuseInput from "../shared/Form/ReuseInput";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Container from "../shared/Container/Container";
import { Resolver } from "react-hook-form";
import { useCreateProductMutation } from "@/app/redux/api/product/productApi";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

// ------------------ Zod Schema ------------------
const TableDataValidationSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(1, "Zip is required"),
  country: z.string().min(1, "Country is required"),
  year: z.coerce.number().min(1900, "Enter a valid year"),
  price: z.coerce.number().min(0, "Price must be positive"),
});

// Infer TypeScript type from schema
type TableDataForm = z.infer<typeof TableDataValidationSchema>;

// Default values (numbers match inferred type)
const defaultTableValues: TableDataForm = {
  firstName: "",
  lastName: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  year: new Date().getFullYear(),
  price: 0,
};

// ------------------ Component ------------------
const TableDataCreateForm = () => {
    const [createProduct,{isLoading}] = useCreateProductMutation()
    const router = useRouter()

    const onSubmit = async (data: TableDataForm) => {
        try {
          await createProduct(data).unwrap();
          Swal.fire({
            icon: "success",
            title: "Table data created successfully!",
            showConfirmButton: false,
            timer: 1000,
          });
          router.push('/dashboard/orders-manage')

        } catch (error: any) {
        Swal.fire({
            icon: "error",
            title: (error?.data?.message || "Failed to create table data"),
            showConfirmButton: true,
          });
        }
      };
    

  return (
    <Container className="mt-10 min-h-screen flex justify-center items-center">
      <div className="bg-[#F7F9FC] md:p-10 p-5 max-w-3xl w-full mx-auto rounded-lg shadow">
        <h3 className="text-center font-bold text-xl mb-2">Create Table Data</h3>
        <p className="text-center font-medium text-gray-600 mb-5">
          Fill all fields to create a new record
        </p>

        <ReuseMainForm
          onSubmit={onSubmit}
        resolver={zodResolver(TableDataValidationSchema) as Resolver<TableDataForm>}

          defaultValues={defaultTableValues}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <ReuseInput name="firstName" label="First Name" placeholder="Enter First Name" />
          <ReuseInput name="lastName" label="Last Name" placeholder="Enter Last Name" />
          <ReuseInput name="city" label="City" placeholder="Enter City" />
          <ReuseInput name="state" label="State" placeholder="Enter State" />
          <ReuseInput name="zip" label="Zip" placeholder="Enter Zip Code" />
          <ReuseInput name="country" label="Country" placeholder="Enter Country" />
          <ReuseInput name="year" label="Year" type="number" placeholder="Enter Year" />
          <ReuseInput name="price" label="Price" type="number" placeholder="Enter Price" />

          {/* Submit button spans both columns */}
          <div className="md:col-span-2">
          <button
              type="submit"
              disabled={isLoading}
              className={`rounded-[6px] mt-[20px] w-full h-[45px] text-white text-[14px] text-center bg-btnColor font-medium leading-[18px] cursor-pointer ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Creating..." : "Create"}
            </button>
          </div>
        </ReuseMainForm>
      </div>
    </Container>
  );
};

export default TableDataCreateForm;
