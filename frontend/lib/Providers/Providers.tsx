"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ReactNode } from "react";
import { persistor, store } from "@/app/redux/featuers/store";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <main>{children}</main>
        </PersistGate>
      </Provider>
  );
}