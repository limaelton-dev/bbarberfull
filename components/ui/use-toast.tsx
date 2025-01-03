"use client";
import * as React from "react";
import {
  ToastProvider as RadixToastProvider,
  ToastViewport,
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
} from "@radix-ui/react-toast";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

let addToast: (toast: { title: string; description?: string; variant?: "success" | "error" }) => void;

export const Toaster = () => {
  const [toasts, setToasts] = useState<Array<{ id: string; title: string; description?: string; variant?: "success" | "error" }>>([]);

  useEffect(() => {
    addToast = (toast) => {
      setToasts((prevToasts) => [...prevToasts, { id: Date.now().toString(), ...toast }]);
    };
  }, []);

  return (
    <RadixToastProvider>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          onOpenChange={(open) => !open && setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
          className={cn(
            "flex items-start p-4 rounded-lg shadow-lg transition-transform",
            toast.variant === "success" ? "bg-green-100 border-l-4 border-green-500" : "bg-red-100 border-l-4 border-red-500"
          )}
        >
          <div className="flex-1">
            <ToastTitle className="font-semibold text-gray-900">
              {toast.title}
            </ToastTitle>
            {toast.description && (
              <ToastDescription className="mt-1 text-sm text-gray-700">
                {toast.description}
              </ToastDescription>
            )}
          </div>
          <ToastClose className="ml-4 text-gray-500 hover:text-gray-700">
            <X className="w-4 h-4" />
          </ToastClose>
        </Toast>
      ))}
      <ToastViewport className="fixed bottom-4 right-4 w-80 max-w-full" />
    </RadixToastProvider>
  );
};

export const toast = ({ title, description, variant = "success" }: { title: string; description?: string; variant?: "success" | "error" }) => {
  if (addToast) {
    addToast({ title, description, variant });
  } else {
    console.error("Toast system not initialized");
  }
};

export { Toast, ToastClose, ToastDescription, ToastTitle, RadixToastProvider as ToastProvider, ToastViewport };
