"use client";

import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Lock, ShieldAlert, ShieldCheck, User } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { signIn, signOut } from "@/lib/auth-client";

export function AdminLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: ({ email, password }) => signIn.email({ email, password }),
    onSuccess: async ({ data, error }) => {
      if (error) {
        toast.error(error.message ?? "Invalid credentials");
        return;
      }
      const role = data?.user?.role ?? "customer";
      if (role !== "admin") {
        toast.error("Access denied. Only administrators can log in here.");
        await signOut();
        return;
      }
      toast.success("Access granted. Welcome, Admin!");
      window.location.href = "/admin/dashboard";
    },
    onError: (err) => {
      toast.error(err?.message ?? "Something went wrong. Try again.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = username.trim();
    const loginEmail = trimmed.includes("@")
      ? trimmed
      : `${trimmed}@vouchiqo.com`;
    loginMutation.mutate({ email: loginEmail, password });
  };

  const isPending = loginMutation.isPending;

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Decorative premium radial glows */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphic Wrapper */}
      <div className="relative overflow-hidden backdrop-blur-xl bg-slate-950/70 border border-slate-800/80 rounded-2xl p-8 shadow-2xl transition-all duration-300 hover:shadow-blue-500/5 hover:border-slate-700/80">
        {/* Brand/Portal Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4 ring-1 ring-white/10">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white font-sans">
            Admin Portal Log In
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 max-w-[280px]">
            Access the Vouchiqo administrative console
          </p>
        </div>

        {/* Warning Indicator */}
        <div className="bg-blue-950/40 border border-blue-900/50 rounded-lg p-3.5 mb-6 flex items-start gap-2.5 text-[11px] leading-relaxed text-blue-300 text-left">
          <ShieldAlert className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            This system is restricted to authorized Vouchiqo administrators.
            Unauthorized access is strictly prohibited.
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
              Admin Username
            </Label>
            <InputGroup className="bg-slate-900/60 border border-slate-800 rounded-lg h-11 px-1 transition-all focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50">
              <InputGroupAddon>
                <User className="w-4 h-4 text-slate-400" />
              </InputGroupAddon>
              <InputGroupInput
                type="text"
                placeholder="e.g. admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-base md:text-sm text-white placeholder-slate-500 h-full bg-transparent border-0 focus:ring-0 focus:outline-none"
                required
                autoFocus
              />
            </InputGroup>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
              Secure Password
            </Label>
            <InputGroup className="bg-slate-900/60 border border-slate-800 rounded-lg h-11 px-1 transition-all focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50">
              <InputGroupAddon>
                <Lock className="w-4 h-4 text-slate-400" />
              </InputGroupAddon>
              <InputGroupInput
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-base md:text-sm text-white placeholder-slate-500 h-full bg-transparent border-0 focus:ring-0 focus:outline-none"
                required
              />
            </InputGroup>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 border-0 cursor-pointer shadow-lg shadow-blue-600/10 transition-all duration-300 hover:shadow-blue-500/20 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
          >
            <span>{isPending ? "Authenticating..." : "Admin Log In"}</span>
            {!isPending && (
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
