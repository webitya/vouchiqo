"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { forgetPassword } from "@/lib/auth-client";

export function useForgotPassword() {
  return useMutation({
    mutationFn: ({ email }) =>
      forgetPassword({
        email,
        redirectTo: "/auth/reset-password",
      }),

    onSuccess: ({ error }) => {
      if (error) {
        toast.error(error.message ?? "Failed to send reset link");
        return;
      }
      toast.success("Reset link sent! Check your inbox.");
    },

    onError: (err) =>
      toast.error(err?.message ?? "Something went wrong. Try again."),
  });
}
