"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("Giriş başarısız: " + error.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
  }

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-6">
        <h1 className="text-3xl font-semibold text-stone-900 mb-6">
          Admin Giriş
        </h1>

        <form onSubmit={handleLogin} className="grid gap-5">
          <div>
            <label className="block text-sm font-medium mb-2">E-posta</label>
            <input
              type="email"
              className="w-full border rounded-xl px-4 py-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@mail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Şifre</label>
            <input
              type="password"
              className="w-full border rounded-xl px-4 py-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifreniz"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-stone-900 text-white px-5 py-3 disabled:opacity-60"
          >
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>

          {message ? (
            <p className="text-sm text-stone-700">{message}</p>
          ) : null}
        </form>
      </div>
    </div>
  );
}