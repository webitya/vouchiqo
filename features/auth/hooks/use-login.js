"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signIn } from "@/lib/auth-client";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, password }) => signIn.email({ email, password }),

    onSuccess: ({ data, error }) => {
      if (error) {
        toast.error(error.message ?? "Invalid credentials");
        return;
      }
      toast.success("Welcome back!");
      const role = data?.user?.role ?? "customer";
      if (role === "admin") router.push("/admin");
      else if (role === "merchant") router.push("/merchant/dashboard");
      else router.push("/customer/dashboard");
    },

    onError: (err) =>
      toast.error(err?.message ?? "Something went wrong. Try again."),
  });
}
