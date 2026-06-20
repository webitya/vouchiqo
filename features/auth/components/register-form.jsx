"use client";

import { ArrowRight, Lock, Mail, Store, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRegister } from "@/features/auth/hooks/use-register";
import { AuthCard } from "./auth-card";

export function RegisterForm() {
  const [role, setRole] = useState("customer");
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  const { mutate: register, isPending } = useRegister();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) return toast.error("Please agree to the Terms of Service.");
    register({ email, password, name: name || businessName, role });
  };

  return (
    <AuthCard title="Create your free account">
      <Tabs value={role} onValueChange={setRole}>
        <TabsList className="grid w-full grid-cols-2 bg-brand-surface p-1 border border-brand-border h-10">
          <TabsTrigger
            value="customer"
            className="flex items-center gap-2 text-xs font-bold data-[state=active]:bg-brand-bg data-[state=active]:text-brand-navy data-[state=active]:shadow-sm"
          >
            <User className="w-4 h-4" /> Customer
          </TabsTrigger>
          <TabsTrigger
            value="merchant"
            className="flex items-center gap-2 text-xs font-bold data-[state=active]:bg-brand-bg data-[state=active]:text-brand-navy data-[state=active]:shadow-sm"
          >
            <Store className="w-4 h-4" /> Merchant
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <form onSubmit={handleSubmit} className="space-y-4">
        {role === "merchant" && (
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-brand-text uppercase">
              Brand Name
            </Label>
            <InputGroup className="bg-brand-surface border border-brand-border rounded-lg h-10 px-1">
              <InputGroupAddon>
                <Store className="w-4 h-4 text-brand-subtext" />
              </InputGroupAddon>
              <InputGroupInput
                type="text"
                placeholder="e.g. Starbucks"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="text-xs placeholder-brand-subtext h-full"
                required
              />
            </InputGroup>
          </div>
        )}

        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-brand-text uppercase">
            {role === "merchant" ? "Contact Name" : "Full Name"}
          </Label>
          <InputGroup className="bg-brand-surface border border-brand-border rounded-lg h-10 px-1">
            <InputGroupAddon>
              <User className="w-4 h-4 text-brand-subtext" />
            </InputGroupAddon>
            <InputGroupInput
              type="text"
              placeholder={role === "merchant" ? "John Doe" : "Sarah Jenkins"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-xs placeholder-brand-subtext h-full"
              required
              autoFocus
            />
          </InputGroup>
        </div>

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
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-xs placeholder-brand-subtext h-full"
              required
            />
          </InputGroup>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-brand-text uppercase">
            Password
          </Label>
          <InputGroup className="bg-brand-surface border border-brand-border rounded-lg h-10 px-1">
            <InputGroupAddon>
              <Lock className="w-4 h-4 text-brand-subtext" />
            </InputGroupAddon>
            <InputGroupInput
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-xs placeholder-brand-subtext h-full"
              required
              minLength={8}
            />
          </InputGroup>
        </div>

        <div className="flex items-start gap-2.5 py-1">
          <Checkbox
            id="agree"
            checked={agreed}
            onCheckedChange={(v) => setAgreed(!!v)}
            className="mt-0.5 border-brand-border text-brand-blue"
          />
          <label
            htmlFor="agree"
            className="text-xs text-brand-subtext leading-snug cursor-pointer select-none"
          >
            I agree to the{" "}
            <Link
              href="/terms"
              className="text-brand-blue font-semibold hover:underline"
            >
              Terms
            </Link>{" "}
            &{" "}
            <Link
              href="/privacy"
              className="text-brand-blue font-semibold hover:underline"
            >
              Privacy Policy
            </Link>
          </label>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="btn-primary w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-1 border-0 h-auto cursor-pointer shadow-none"
        >
          <span>
            {isPending ? "Creating Account..." : "Create Free Account"}
          </span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </form>

      <p className="text-center text-xs font-semibold text-brand-subtext">
        Have an account?{" "}
        <Link
          href="/auth/login"
          className="text-brand-blue font-bold hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
