"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { Separator } from "./separator";
import { cn } from "../../lib/utils";
import { apiLogin } from "../../lib/api";
import { useSiteSettings, logoSrc } from "../../lib/use-site-settings";

interface ConfettiParticle {
  id: number;
  rotate: number;
  color: string;
}

// Ellena brand palette
const CONFETTI_COLORS = ["#C9A227", "#8A8A8A", "#F5E6DA", "#2B2B2B", "#C9A227"];

export default function GamifiedLoginCard() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [particles, setParticles] = React.useState<ConfettiParticle[]>([]);

  const siteSettings = useSiteSettings();
  const loginLogo = logoSrc(siteSettings?.logo_url);

  const fireConfetti = () => {
    const burst: ConfettiParticle[] = Array.from({ length: 36 }).map((_, i) => ({
      id: Date.now() + i,
      rotate: Math.random() * 360,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    }));
    setParticles(burst);
    setTimeout(() => setParticles([]), 1100);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in both fields.");
      return;
    }

    setLoading(true);
    try {
      const { token, user } = await apiLogin({ email, password });
      if (typeof window !== "undefined") {
        localStorage.setItem("ellena_token", token);
      }
      fireConfetti();
      setSuccess(true);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);

      setTimeout(() => {
        router.push(user.role === "admin" ? "/dashboard" : "/account");
        router.refresh();
      }, 700);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-10">
      {/* Brand background */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[#FBF7EF]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[#F5E6DA]/35"
      />
      <div
        aria-hidden
        className="absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-[#C9A227]/15 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -right-16 bottom-1/4 h-80 w-80 rounded-full bg-[#8A8A8A]/15 blur-3xl"
      />

      {/* Confetti */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="pointer-events-none absolute left-1/2 top-1/2 h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: p.color }}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: p.rotate }}
            animate={{
              x: (Math.random() - 0.5) * 220,
              y: -Math.random() * 240,
              scale: 0,
              opacity: 0,
              rotate: p.rotate + Math.random() * 360,
            }}
            transition={{ duration: 1.05, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 14 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="border-[#F5E6DA]/60 bg-white/85 shadow-[0_24px_80px_rgba(42,33,31,0.10)] backdrop-blur-xl">
          <CardHeader className="gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              {loginLogo ? (
                <Image
                  src={loginLogo}
                  alt="Ellena Cosmetics"
                  width={150}
                  height={48}
                  className="h-12 w-auto object-contain"
                />
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C9A227] text-[#2B2B2B] shadow-[0_12px_24px_rgba(42,33,31,0.25)]">
                    <ShieldCheck className="h-6 w-6" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#C9A227]">
                      Admin Portal
                    </p>
                    <p className="text-lg font-bold tracking-tight text-[#2B2B2B]">
                      Ellena Cosmetics
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-1.5">
              <CardTitle className="text-2xl font-bold tracking-tight text-[#2B2B2B]">
                {success ? "Welcome back ✨" : "Sign in to your account"}
              </CardTitle>
              <CardDescription className="text-[#8A8A8A]">
                {success
                  ? "Redirecting you now…"
                  : "Enter your credentials to access your beauty dashboard."}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-[#2B2B2B]">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A8A8A]" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading || success}
                    className={cn(
                      "h-11 border-[#F5E6DA] bg-[#FFFDF9] pl-9 text-[#2B2B2B] placeholder:text-[#8A8A8A]",
                      "focus-visible:border-[#C9A227] focus-visible:ring-[#C9A227]/30"
                    )}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-[#2B2B2B]">
                    Password
                  </Label>
                  <Link
                    href="#"
                    className="text-xs font-medium text-[#C9A227] underline-offset-4 hover:underline"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A8A8A]" />
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading || success}
                    className={cn(
                      "h-11 border-[#F5E6DA] bg-[#FFFDF9] pl-9 text-[#2B2B2B] placeholder:text-[#8A8A8A]",
                      "focus-visible:border-[#C9A227] focus-visible:ring-[#C9A227]/30"
                    )}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || success}
                className={cn(
                  "mt-2 h-11 w-full bg-[#C9A227] text-[#2B2B2B] transition-all duration-200",
                  "hover:bg-[#C9A227]/85 hover:shadow-[0_12px_28px_rgba(42,33,31,0.25)]",
                  success && "bg-[#C9A227]"
                )}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
                  </span>
                ) : success ? (
                  "Logged in"
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Separator className="bg-[#F5E6DA]/70" />
            <p className="text-center text-sm text-[#8A8A8A]">
              Don&apos;t have an account?{" "}
              <Link
                href="#"
                className="font-medium text-[#C9A227] underline-offset-4 hover:underline"
              >
                Create one
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
