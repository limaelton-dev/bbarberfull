import * as React from "react";
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
} from "@radix-ui/react-toast";

export const Toaster = () => (
  <ToastProvider>
    <ToastViewport />
  </ToastProvider>
);

export const toast = ({ title, description }: { title: string; description?: string }) => {
  console.log(`[Toast]: ${title} - ${description}`);
};

export { Toast, ToastClose, ToastDescription, ToastTitle, ToastProvider, ToastViewport };
