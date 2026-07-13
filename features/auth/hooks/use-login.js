"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { signIn } from "@/lib/auth-client";

export function useLogin() {

  return useMutation({
    mutationFn: ({ email, password }) => signIn.email({ email, password }),

    onSuccess: ({ data, error }) => {
      if (error) {
        toast.error(error.message ?? "Invalid credentials");
        return;
      }
      toast.success("Welcome back!");
      const role = data?.user?.role ?? "customer";
      const dest = role === "admin"
        ? "/admin/dashboard"
        : role === "merchant"
          ? "/merchant/dashboard"
          : "/profile";
      
      window.location.href = dest;
    },

    onError: (err) =>
      toast.error(err?.message ?? "Something went wrong. Try again."),
  });
}
