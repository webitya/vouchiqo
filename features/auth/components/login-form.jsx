"use client";

import { ArrowRight, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/features/auth/hooks/use-login";
import { AuthCard } from "./auth-card";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: login, isPending } = useLogin();

  return (
    <AuthCard title="Sign in to your account">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          login({ email, password });
        }}
        className="space-y-4"
      >
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-brand-text uppercase">
            Email
          </Label>
          <InputGroup className="bg-brand-surface border border-brand-border rounded-lg h-10 px-1">
            <InputGroupAddon>
              <Mail className="w-4 h-4 text-brand-subtext" />
            </InputGroupAddon>
            <InputGroupInput
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-xs placeholder-brand-subtext h-full"
              required
              autoFocus
            />
          </InputGroup>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <Label className="text-xs font-bold text-brand-text uppercase">
              Password
            </Label>
            <Link
              href="/auth/forgot-password"
              className="text-xs text-brand-blue font-bold hover:underline"
            >
              Forgot?
            </Link>
          </div>
          <InputGroup className="bg-brand-surface border border-brand-border rounded-lg h-10 px-1">
            <InputGroupAddon>
              <Lock className="w-4 h-4 text-brand-subtext" />
            </InputGroupAddon>
            <InputGroupInput
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-xs placeholder-brand-subtext h-full"
              required
            />
          </InputGroup>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="btn-primary w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-1 border-0 h-auto cursor-pointer shadow-none"
        >
          <span>{isPending ? "Signing in..." : "Sign In"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </form>

      <p className="text-center text-xs font-semibold text-brand-subtext">
        No account?{" "}
        <Link
          href="/auth/register"
          className="text-brand-blue font-bold hover:underline"
        >
          Create one free
        </Link>
      </p>
    </AuthCard>
  );
}
