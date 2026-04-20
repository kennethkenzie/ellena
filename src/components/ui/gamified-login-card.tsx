"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { useSiteSettings, logoSrc } from "@/lib/use-site-settings";

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  rotate: number;
  color: string;
}

const colors = ["#facc15", "#22c55e", "#3b82f6", "#f472b6", "#f97316"];

export default function GamifiedLoginCard() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [particles, setParticles] = React.useState<ConfettiParticle[]>([]);
  const siteSettings = useSiteSettings();
  const loginLogo = logoSrc(siteSettings?.logo_url);

  const handleLogin = () => {
    if (!email || !password) return;

    const newParticles: ConfettiParticle[] = Array.from({ length: 30 }).map((_, i) => ({
      id: Date.now() + i,
      x: 0,
      y: 0,
      rotate: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(newParticles);
    setSuccess(true);

    setTimeout(() => setParticles([]), 1000);
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,#eef0ff_0%,#dbe3ff_20%,#f8f9fc_48%,#ffffff_100%)] px-4">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(91,76,240,0.12),transparent_35%,rgba(79,70,229,0.08)_100%)]" />

      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute h-3 w-3 rounded-full"
            style={{ backgroundColor: p.color }}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: p.rotate }}
            animate={{
              x: (Math.random() - 0.5) * 150,
              y: -Math.random() * 200,
              scale: 0,
              opacity: 0,
              rotate: p.rotate + Math.random() * 360,
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 flex w-full max-w-md flex-col gap-6 rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]"
      >
        <div className="flex items-center gap-3">
          {loginLogo ? (
            <Image src={loginLogo} alt="Logo" width={140} height={44} className="h-11 w-auto object-contain" />
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#5b4cf0] text-white shadow-[0_12px_24px_rgba(91,76,240,0.24)]">
                <ShieldCheck className="h-6 w-6" strokeWidth={2} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Admin Portal</p>
                <p className="font-[var(--font-heading)] text-lg font-bold tracking-tight text-slate-900">Ellena Cosmetics</p>
              </div>
            </>
          )}
        </div>

        <h2 className="text-center text-3xl font-bold text-gray-900">
          {success ? "Welcome!" : "Sign In"}
        </h2>

        <div className="mt-2 flex flex-col gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 h-11 border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 hover:scale-[1.02] transition-transform duration-200 focus-visible:border-[#5b4cf0] focus-visible:ring-[#5b4cf0]/20"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 h-11 border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 hover:scale-[1.02] transition-transform duration-200 focus-visible:border-[#5b4cf0] focus-visible:ring-[#5b4cf0]/20"
            />
          </div>
        </div>

        <Button
          className="mt-4 h-11 w-full bg-[#5b4cf0] text-white hover:scale-[1.03] hover:bg-[#4f46e5] transition-transform duration-200"
          onClick={handleLogin}
        >
          {success ? "Logged In!" : "Login"}
        </Button>

        {!success && (
          <p className="mt-2 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <a href="#" className="text-[#5b4cf0] hover:underline">Sign up</a>
          </p>
        )}
      </motion.div>
    </div>
  );
}

