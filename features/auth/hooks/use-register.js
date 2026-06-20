"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signUp } from "@/lib/auth-client";

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, password, name, role }) =>
      signUp.email({ email, password, name }),

    onSuccess: ({ data, error }, variables) => {
      if (error) {
        toast.error(error.message ?? "Registration failed");
        return;
      }
      toast.success("Account created! Welcome to Vouchiqo 🎉");
      router.push(
        variables.role === "merchant"
          ? "/merchant/dashboard"
          : "/customer/dashboard",
      );
    },

    onError: (err) =>
      toast.error(err?.message ?? "Something went wrong. Try again."),
  });
}
