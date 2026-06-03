// Admin login — verifies the shared ADMIN_TOKEN and sets an httpOnly cookie.
import { redirect } from "next/navigation";
import { isAdmin, setAdminCookie } from "@/lib/admin-auth";

async function login(formData: FormData) {
  "use server";
  const token = String(formData.get("token") || "");
  const ok = await setAdminCookie(token);
  if (ok) redirect("/admin/contacts");
}

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin/contacts");
  return (
    <main className="min-h-screen bg-cyber-black flex items-center justify-center px-4">
      <form action={login} className="w-full max-w-sm rounded-2xl border border-white/10 bg-cyber-dark/60 p-8 backdrop-blur-sm">
        <h1 className="font-display text-2xl font-black text-white mb-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-orange to-cyber-pink">STUDEX</span>{" "}
          <span className="text-cyber-cyan">Admin</span>
        </h1>
        <p className="font-mono text-sm text-gray-500 mb-6">Enter the admin token to access the CRM.</p>
        <input
          type="password"
          name="token"
          required
          placeholder="admin token"
          className="w-full h-11 rounded-lg border border-white/10 bg-cyber-dark/60 px-4 text-sm text-white font-mono placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50"
        />
        <button
          type="submit"
          className="mt-4 w-full h-11 rounded-lg bg-gradient-to-r from-cyber-orange to-cyber-pink text-white font-mono text-sm font-bold uppercase tracking-wider hover:shadow-[0_0_30px_rgba(255,107,0,0.5)] transition-shadow"
        >
          Sign in
        </button>
      </form>
    </main>
  );
}
