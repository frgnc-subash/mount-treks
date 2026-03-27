import { SignupForm } from "@/components/signup-form";

export default function SignUpPage() {
  return (
    <div className="dark">
      <div className="relative min-h-svh bg-[#050505] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_10%,rgba(8,78,168,0.28),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:28px_28px] opacity-30" />
        <div className="relative mx-auto flex min-h-svh w-full items-center justify-center px-6 py-10">
          <div className="w-full max-w-sm md:max-w-4xl">
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  );
}
