import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "@/components/Nav";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const AdminAuth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/admin", { replace: true });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setLoading(false);
      if (error) return toast.error(error.message);
      toast.success("Account created. You can sign in now.");
      setMode("signin");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return toast.error(error.message);
      navigate("/admin", { replace: true });
    }
  };

  return (
    <div className="min-h-screen">
      <Nav />
      <section className="pt-40 pb-32 container max-w-md">
        <p className="tracking-eyebrow text-gold mb-4">Studio access</p>
        <h1 className="font-display text-5xl mb-8">Admin {mode === "signin" ? "sign in" : "register"}</h1>
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block tracking-eyebrow text-muted-foreground mb-3">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-border py-3 focus:border-foreground outline-none"
            />
          </div>
          <div>
            <label className="block tracking-eyebrow text-muted-foreground mb-3">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-border py-3 focus:border-foreground outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-foreground text-background py-4 text-sm tracking-eyebrow hover:bg-gold hover:text-foreground transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>
        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 text-sm text-muted-foreground hover:text-foreground"
        >
          {mode === "signin" ? "Need an account? Register" : "Already have an account? Sign in"}
        </button>
        <p className="text-xs text-muted-foreground mt-8">
          New accounts must be granted admin role from the backend before accessing the dashboard.
        </p>
      </section>
    </div>
  );
};

export default AdminAuth;
