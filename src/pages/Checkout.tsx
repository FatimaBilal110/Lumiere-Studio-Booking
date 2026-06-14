import { useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getPackage, ADDONS, formatPKR } from "@/data/packages";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Checkout = () => {
  const { packageId } = useParams();
  const [params] = useSearchParams();
  const pkg = getPackage(packageId || "");
  const date = params.get("date");
  const slot = params.get("slot");

  const [addons, setAddons] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });

  if (!pkg) return <div className="p-12">Package not found</div>;

  const total = pkg.price + addons.reduce((s, id) => s + (ADDONS.find((a) => a.id === id)?.price || 0), 0);
  const dateStr = date
    ? new Date(date).toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!date || !slot) {
      toast.error("Missing date or time slot");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("bookings").insert({
      package_id: pkg.id,
      package_name: pkg.name,
      customer_name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      shoot_date: date,
      time_slot: slot,
      addons: addons.map((id) => ADDONS.find((a) => a.id === id)?.label).filter(Boolean),
      customer_notes: form.notes.trim() || null,
      total_price: total,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not submit your request. Please try again.");
      return;
    }
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div className="min-h-screen">
        <Nav />
        <section className="pt-40 pb-32 container max-w-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-gold/20 text-gold flex items-center justify-center mx-auto mb-8">
            <Check className="w-8 h-8" />
          </div>
          <p className="tracking-eyebrow text-gold mb-4">Request received</p>
          <h1 className="font-display text-5xl md:text-6xl mb-6">Thank you, {form.name.split(" ")[0]}.</h1>
          <p className="text-muted-foreground text-lg mb-12">
            Your request has been received. We will contact you shortly to confirm your shoot.
          </p>
          <div className="border border-border p-8 text-left bg-card">
            <div className="flex justify-between py-2 border-b border-border"><span className="text-muted-foreground">Package</span><span>{pkg.name}</span></div>
            <div className="flex justify-between py-2 border-b border-border"><span className="text-muted-foreground">Date</span><span>{dateStr}</span></div>
            <div className="flex justify-between py-2 border-b border-border"><span className="text-muted-foreground">Time</span><span>{slot}</span></div>
            <div className="flex justify-between py-2 border-b border-border"><span className="text-muted-foreground">Status</span><span className="text-muted-foreground">Pending confirmation</span></div>
            <div className="flex justify-between py-4 font-display text-2xl"><span>Estimated total</span><span>{formatPKR(total)}</span></div>
          </div>
          <Link to="/" className="inline-block mt-12 text-sm tracking-eyebrow border border-foreground px-6 py-3 hover:bg-foreground hover:text-background transition-all">
            Return home
          </Link>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Nav />
      <section className="pt-32 pb-12 container">
        <Link to={`/booking/${pkg.id}`} className="inline-flex items-center gap-2 text-xs tracking-eyebrow text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-3 h-3" /> Change slot
        </Link>
        <p className="tracking-eyebrow text-gold mb-4">Step 02 / 02 · Your details</p>
        <h1 className="font-display text-5xl md:text-6xl">Almost there.</h1>
      </section>

      <section className="container pb-32 grid lg:grid-cols-[1fr_400px] gap-12">
        <form onSubmit={submit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Full name *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Field label="Phone number *" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+92 300 1234567" />
          </div>
          <Field label="Email *" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />

          <div>
            <label className="block tracking-eyebrow text-muted-foreground mb-4">Add-ons</label>
            <div className="space-y-3">
              {ADDONS.map((a) => {
                const checked = addons.includes(a.id);
                return (
                  <label key={a.id} className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${checked ? "border-gold bg-gold/5" : "border-border hover:border-foreground"}`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => setAddons(checked ? addons.filter((x) => x !== a.id) : [...addons, a.id])}
                        className="accent-gold"
                      />
                      <span className="text-sm">{a.label}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">+ {formatPKR(a.price)}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block tracking-eyebrow text-muted-foreground mb-3">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={4}
              maxLength={1000}
              className="w-full bg-transparent border border-border p-4 focus:border-foreground outline-none transition-colors"
              placeholder="Anything we should know?"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-foreground text-background py-4 text-sm tracking-eyebrow hover:bg-gold hover:text-foreground transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? "Submitting…" : "Submit booking request"}
          </button>
          <p className="text-xs text-muted-foreground text-center">
            No payment required now. We will reach out via phone or email to confirm your shoot.
          </p>
        </form>

        <aside className="lg:sticky lg:top-24 h-fit border border-border p-8 bg-card">
          <p className="tracking-eyebrow text-gold mb-4">Your booking</p>
          <h3 className="font-display text-3xl mb-6">{pkg.name}</h3>
          <div className="space-y-3 text-sm border-t border-border pt-6">
            <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span>{dateStr}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span>{slot}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span>{pkg.duration}</span></div>
          </div>
          <div className="space-y-2 text-sm border-t border-border mt-6 pt-6">
            <div className="flex justify-between"><span className="text-muted-foreground">Package</span><span>{formatPKR(pkg.price)}</span></div>
            {addons.map((id) => {
              const a = ADDONS.find((x) => x.id === id)!;
              return <div key={id} className="flex justify-between"><span className="text-muted-foreground">{a.label}</span><span>{formatPKR(a.price)}</span></div>;
            })}
          </div>
          <div className="flex justify-between items-baseline border-t border-border mt-6 pt-6">
            <span className="tracking-eyebrow text-muted-foreground">Total</span>
            <span className="font-display text-3xl">{formatPKR(total)}</span>
          </div>
        </aside>
      </section>
      <Footer />
    </div>
  );
};

const Field = ({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) => (
  <div>
    <label className="block tracking-eyebrow text-muted-foreground mb-3">{label}</label>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-transparent border-b border-border py-3 focus:border-foreground outline-none transition-colors"
    />
  </div>
);

export default Checkout;
