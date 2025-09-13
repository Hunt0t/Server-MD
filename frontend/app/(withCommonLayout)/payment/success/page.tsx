/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaymentSuccessClient } from "./PaymentSuccessClient";

// Accept searchParams as Promise to satisfy Next.js generated PageProps expectation.
export default async function Page({ searchParams }: { searchParams?: Promise<any> }) {
  let resolved: any = {};
  if (searchParams) {
    try {
      resolved = await searchParams;
    } catch {
      resolved = {};
    }
  }
  return <PaymentSuccessClient searchParams={resolved || {}} />;
}
