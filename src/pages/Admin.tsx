import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Check, X, Trash2, LogOut, Lock, Unlock, Loader2 } from "lucide-react";
import { formatPKR, TIME_SLOTS } from "@/data/packages";

type Booking = {
  id: string;
  package_name: string;
  customer_name: string;
  phone: string;
  email: string;
  shoot_date: string;
  time_slot: string;
  status: "pending" | "confirmed" | "cancelled";
  total_price: number;
  customer_notes: string | null;
  admin_notes: string | null;
  addons: any;
  created_at: string;
};

type Blocked = { id: string; shoot_date: string; time_slot: string };

const statusStyles = {
  pending: "bg-muted text-muted-foreground border-border",
  confirmed: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  cancelled: "bg-destructive/15 text-destructive border-destructive/30",
} as const;

const Admin = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blocked, setBlocked] = useState<Blocked[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");
  const [blockDate, setBlockDate] = useState("");
  const [blockSlot, setBlockSlot] = useState(TIME_SLOTS[0]);

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        navigate("/admin/login", { replace: true });
        return;
      }
      const { data: roleRow } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", sess.session.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!roleRow) {
        setChecking(false);
        setIsAdmin(false);
        return;
      }
      setIsAdmin(true);
      setChecking(false);
      load();
    })();
  }, [navigate]);

  const load = async () => {
    const [b, bl] = await Promise.all([
      supabase.from("bookings").select("*").order("created_at", { ascending: false }),
      supabase.from("blocked_slots").select("*").order("shoot_date"),
    ]);
    if (b.data) setBookings(b.data as any);
    if (bl.data) setBlocked(bl.data as any);
  };

  const stats = useMemo(() => ({
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  }), [bookings]);

  const filtered = bookings.filter((b) => filter === "all" || b.status === filter);

  const updateStatus = async (id: string, status: Booking["status"]) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Marked as ${status}`);
    load();
  };

  const updateNote = async (id: string, admin_notes: string) => {
    const { error } = await supabase.from("bookings").update({ admin_notes }).eq("id", id);
    if (error) return toast.error(error.message);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this booking permanently?")) return;
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Booking deleted");
    load();
  };

  const block = async () => {
    if (!blockDate) return toast.error("Pick a date");
    const { error } = await supabase.from("blocked_slots").insert({ shoot_date: blockDate, time_slot: blockSlot });
    if (error) return toast.error(error.message);
    toast.success("Slot blocked");
    load();
  };

  const unblock = async (id: string) => {
    const { error } = await supabase.from("blocked_slots").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center">
        <div>
          <p className="tracking-eyebrow text-gold mb-3">Access denied</p>
          <h1 className="font-display text-4xl mb-4">No admin role on this account</h1>
          <p className="text-muted-foreground max-w-md mb-6">
            Ask the studio owner to grant your account the admin role from the backend.
          </p>
          <button onClick={signOut} className="text-sm tracking-eyebrow border border-foreground px-5 py-2.5 hover:bg-foreground hover:text-background transition-all">
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container flex items-center justify-between h-16">
          <h1 className="font-display text-2xl">Lumière<span className="text-gold">.</span> <span className="text-muted-foreground text-sm tracking-eyebrow ml-3">Admin</span></h1>
          <button onClick={signOut} className="inline-flex items-center gap-2 text-xs tracking-eyebrow text-muted-foreground hover:text-foreground">
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </header>

      <main className="container py-10 space-y-10">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { l: "Total", v: stats.total },
            { l: "Pending", v: stats.pending },
            { l: "Confirmed", v: stats.confirmed },
            { l: "Cancelled", v: stats.cancelled },
          ].map((s) => (
            <div key={s.l} className="border border-border p-6 bg-card">
              <p className="tracking-eyebrow text-muted-foreground mb-2">{s.l}</p>
              <p className="font-display text-4xl">{s.v}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {(["all", "pending", "confirmed", "cancelled"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs tracking-eyebrow px-4 py-2 border transition-all ${
                  filter === f ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Bookings table */}
          <div className="border border-border bg-card overflow-x-auto">
            <table className="w-full text-sm min-w-[1100px]">
              <thead>
                <tr className="border-b border-border text-xs tracking-eyebrow text-muted-foreground">
                  <th className="text-left p-4 font-normal">Customer</th>
                  <th className="text-left p-4 font-normal">Contact</th>
                  <th className="text-left p-4 font-normal">Package</th>
                  <th className="text-left p-4 font-normal">Date</th>
                  <th className="text-left p-4 font-normal">Slot</th>
                  <th className="text-left p-4 font-normal">Total</th>
                  <th className="text-left p-4 font-normal">Status</th>
                  <th className="text-left p-4 font-normal">Notes</th>
                  <th className="text-right p-4 font-normal">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={9} className="p-12 text-center text-muted-foreground">No bookings</td></tr>
                )}
                {filtered.map((b) => (
                  <tr key={b.id} className="border-b border-border last:border-0 align-top">
                    <td className="p-4">
                      <div>{b.customer_name}</div>
                      {Array.isArray(b.addons) && b.addons.length > 0 && (
                        <div className="text-xs text-muted-foreground mt-1">+ {b.addons.join(", ")}</div>
                      )}
                      {b.customer_notes && <div className="text-xs text-muted-foreground mt-1 italic">"{b.customer_notes}"</div>}
                    </td>
                    <td className="p-4 text-xs">
                      <div>{b.phone}</div>
                      <div className="text-muted-foreground">{b.email}</div>
                    </td>
                    <td className="p-4">{b.package_name}</td>
                    <td className="p-4">{new Date(b.shoot_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>
                    <td className="p-4 whitespace-nowrap">{b.time_slot}</td>
                    <td className="p-4 whitespace-nowrap">{formatPKR(b.total_price)}</td>
                    <td className="p-4">
                      <span className={`text-xs tracking-eyebrow px-2 py-1 border ${statusStyles[b.status]}`}>{b.status}</span>
                    </td>
                    <td className="p-4">
                      <input
                        defaultValue={b.admin_notes || ""}
                        onBlur={(e) => e.target.value !== (b.admin_notes || "") && updateNote(b.id, e.target.value)}
                        placeholder="Admin note…"
                        className="w-40 bg-transparent border-b border-border py-1 text-xs focus:border-foreground outline-none"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        {b.status !== "confirmed" && (
                          <button onClick={() => updateStatus(b.id, "confirmed")} title="Confirm" className="p-2 border border-border hover:border-emerald-500 hover:text-emerald-600">
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {b.status !== "cancelled" && (
                          <button onClick={() => updateStatus(b.id, "cancelled")} title="Cancel" className="p-2 border border-border hover:border-destructive hover:text-destructive">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button onClick={() => remove(b.id)} title="Delete" className="p-2 border border-border hover:border-destructive hover:text-destructive">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Slot management */}
        <section className="border border-border bg-card p-6">
          <p className="tracking-eyebrow text-gold mb-4">Slot control</p>
          <div className="flex flex-wrap items-end gap-4 mb-6">
            <div>
              <label className="block text-xs text-muted-foreground mb-2">Date</label>
              <input type="date" value={blockDate} onChange={(e) => setBlockDate(e.target.value)} className="border border-border bg-background px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-2">Time slot</label>
              <select value={blockSlot} onChange={(e) => setBlockSlot(e.target.value)} className="border border-border bg-background px-3 py-2 text-sm">
                {TIME_SLOTS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <button onClick={block} className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-2.5 text-xs tracking-eyebrow hover:bg-gold hover:text-foreground transition-all">
              <Lock className="w-3.5 h-3.5" /> Block slot
            </button>
          </div>
          {blocked.length === 0 ? (
            <p className="text-sm text-muted-foreground">No manually blocked slots.</p>
          ) : (
            <div className="space-y-2">
              {blocked.map((s) => (
                <div key={s.id} className="flex items-center justify-between border border-border px-4 py-3 text-sm">
                  <span>{new Date(s.shoot_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} · {s.time_slot}</span>
                  <button onClick={() => unblock(s.id)} className="inline-flex items-center gap-2 text-xs tracking-eyebrow text-muted-foreground hover:text-foreground">
                    <Unlock className="w-3.5 h-3.5" /> Unblock
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Admin;
