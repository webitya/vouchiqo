"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { signUp } from "@/lib/auth-client";

export function useRegister() {

  return useMutation({
    mutationFn: ({ email, password, name, role }) =>
      signUp.email({ email, password, name, role }),

    onSuccess: ({ data, error }, variables) => {
      if (error) {
        toast.error(error.message ?? "Registration failed");
        return;
      }
      toast.success("Account created! Welcome to Vouchiqo 🎉");
      const dest = variables.role === "merchant"
        ? "/merchant/dashboard"
        : "/customer/dashboard";
      
      window.location.href = dest;
    },

    onError: (err) =>
      toast.error(err?.message ?? "Something went wrong. Try again."),
  });
}
