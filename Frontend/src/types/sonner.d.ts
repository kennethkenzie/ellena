declare module "sonner" {
  import * as React from "react";

  export type ToasterProps = React.ComponentProps<"div"> & {
    theme?: string;
    richColors?: boolean;
    position?: string;
    toastOptions?: Record<string, unknown>;
    icons?: Record<string, React.ReactNode>;
  };

  export const Toaster: React.FC<ToasterProps>;

  export type ToastOptions = {
    description?: React.ReactNode;
    [key: string]: unknown;
  };

  export const toast: {
    (message?: React.ReactNode, options?: ToastOptions): void;
    success: (message?: React.ReactNode, options?: ToastOptions) => void;
    error: (message?: React.ReactNode, options?: ToastOptions) => void;
    info: (message?: React.ReactNode, options?: ToastOptions) => void;
    warning: (message?: React.ReactNode, options?: ToastOptions) => void;
    loading: (message?: React.ReactNode, options?: ToastOptions) => void;
  };
}
