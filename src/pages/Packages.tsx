import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { packages, formatPKR } from "@/data/packages";

const Packages = () => (
  <div className="min-h-screen">
    <Nav />
    <section className="pt-32 pb-16 container">
      <p className="tracking-eyebrow text-gold mb-6">Choose Your Session</p>
      <h1 className="font-display text-6xl md:text-7xl max-w-3xl leading-[0.95]">Packages, crafted with intention.</h1>
      <p className="text-muted-foreground mt-8 max-w-xl text-lg">
        Every package includes pre-shoot consultation, edited high-resolution gallery, and a private viewing.
      </p>
    </section>

    <section className="container pb-32">
      <div className="grid md:grid-cols-2 gap-8">
        {packages.map((p) => (
          <article key={p.id} className="group bg-card border border-border overflow-hidden hover:shadow-elegant transition-all duration-500">
            <div className="aspect-[16/10] overflow-hidden bg-muted">
              <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="p-8 md:p-10">
              <div className="flex items-baseline justify-between mb-4">
                <p className="tracking-eyebrow text-gold">{p.tag} · {p.duration}</p>
              </div>
              <h2 className="font-display text-4xl mb-4">{p.name}</h2>
              <p className="text-muted-foreground leading-relaxed mb-8">{p.description}</p>
              <div className="flex items-center justify-between border-t border-border pt-6">
                <div>
                  <p className="text-xs text-muted-foreground tracking-wider">From</p>
                  <p className="font-display text-3xl">{formatPKR(p.price)}</p>
                </div>
                <Link
                  to={`/booking/${p.id}`}
                  className="inline-flex items-center gap-2 text-sm tracking-eyebrow border border-foreground px-5 py-3 hover:bg-foreground hover:text-background transition-all group/btn"
                >
                  Select <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
    <Footer />
  </div>
);

export default Packages;
