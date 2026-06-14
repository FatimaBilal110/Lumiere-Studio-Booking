import { useState, useMemo, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getPackage, TIME_SLOTS, formatPKR } from "@/data/packages";
import { supabase } from "@/integrations/supabase/client";

const toISODate = (d: Date) => d.toISOString().slice(0, 10);

const Booking = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const pkg = getPackage(packageId || "");
  const [selected, setSelected] = useState<{ date: number; slot: number } | null>(null);
  const [unavailable, setUnavailable] = useState<Set<string>>(new Set());

  const dates = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return d;
      }),
    []
  );

  useEffect(() => {
    supabase.rpc("get_unavailable_slots").then(({ data }) => {
      if (data) setUnavailable(new Set(data.map((r: any) => `${r.shoot_date}|${r.time_slot}`)));
    });
  }, []);

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Link to="/packages" className="underline">Package not found — back to packages</Link>
      </div>
    );
  }

  const isUnavailable = (d: Date, slot: string) => unavailable.has(`${toISODate(d)}|${slot}`);

  const proceed = () => {
    if (!selected) return;
    const date = toISODate(dates[selected.date]);
    const slot = TIME_SLOTS[selected.slot];
    navigate(`/checkout/${pkg.id}?date=${encodeURIComponent(date)}&slot=${encodeURIComponent(slot)}`);
  };

  return (
    <div className="min-h-screen">
      <Nav />
      <section className="pt-32 pb-12 container">
        <Link to="/packages" className="inline-flex items-center gap-2 text-xs tracking-eyebrow text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-3 h-3" /> Back to packages
        </Link>
        <p className="tracking-eyebrow text-gold mb-4">Step 01 / 02 · Choose a slot</p>
        <h1 className="font-display text-5xl md:text-6xl mb-3">{pkg.name}</h1>
        <p className="text-muted-foreground">{pkg.duration} · {formatPKR(pkg.price)}</p>
      </section>

      <section className="container pb-16">
        <div className="overflow-x-auto border border-border bg-card">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-border">
                <th className="p-4 text-left text-xs tracking-eyebrow text-muted-foreground font-normal w-32">Time</th>
                {dates.map((d, i) => (
                  <th key={i} className="p-4 text-center text-xs tracking-eyebrow font-normal">
                    <div className="text-muted-foreground">{d.toLocaleDateString("en-US", { weekday: "short" })}</div>
                    <div className="font-display text-2xl text-foreground mt-1 normal-case tracking-normal">{d.getDate()}</div>
                    <div className="text-muted-foreground mt-1">{d.toLocaleDateString("en-US", { month: "short" })}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((slot, sIdx) => (
                <tr key={slot} className="border-b border-border last:border-0">
                  <td className="p-4 text-sm text-muted-foreground">{slot}</td>
                  {dates.map((d, dIdx) => {
                    const booked = isUnavailable(d, slot);
                    const isSel = selected?.date === dIdx && selected?.slot === sIdx;
                    return (
                      <td key={dIdx} className="p-2 text-center">
                        <button
                          disabled={booked}
                          onClick={() => setSelected({ date: dIdx, slot: sIdx })}
                          className={`w-full h-12 text-xs tracking-wider transition-all ${
                            booked
                              ? "bg-muted text-muted-foreground/50 cursor-not-allowed line-through"
                              : isSel
                              ? "bg-foreground text-background"
                              : "bg-background border border-border hover:border-gold hover:text-gold"
                          }`}
                        >
                          {booked ? "Unavailable" : isSel ? "Selected" : "Available"}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          All bookings are reviewed manually — we'll contact you to confirm within 24 hours.
        </p>
      </section>

      <section className="container pb-32 flex justify-end">
        <button
          onClick={proceed}
          disabled={!selected}
          className="inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 text-sm tracking-eyebrow hover:bg-gold hover:text-foreground transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
        >
          Continue
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </section>
      <Footer />
    </div>
  );
};

export default Booking;
