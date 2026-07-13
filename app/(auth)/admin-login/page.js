import { AdminLoginForm } from "@/features/auth/components/admin-login-form";

export const metadata = {
  title: "Admin Portal | Vouchiqo",
  description: "Secure login portal for Vouchiqo administration panel.",
};

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-slate-950 px-4 py-12">
      {/* Background decorative grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.12) 0%, transparent 70%), linear-gradient(rgba(148,163,184,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.04) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 40px 40px, 40px 40px",
        }}
      />
      <AdminLoginForm />
    </main>
  );
}
