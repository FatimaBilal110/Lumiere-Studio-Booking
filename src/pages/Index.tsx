import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import hero from "@/assets/hero-1.jpg";
import about from "@/assets/about-studio.jpg";
import { packages } from "@/data/packages";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Nav />

      {/* Hero */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 ken-burns">
          <img src={hero} alt="Editorial bridal portrait" className="w-full h-full object-cover" width={1920} height={1280} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background" />
        <div className="relative h-full container flex flex-col justify-end pb-24">
          <div className="fade-up max-w-2xl">
            <p className="tracking-eyebrow text-background/90 mb-6">Est. 2014 · Photoshoot Studio</p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-background leading-[0.95] mb-8">
              Stories told<br/>in <em className="text-gold-soft">light</em>.
            </h1>
            <Link
              to="/packages"
              className="inline-flex items-center gap-3 bg-background text-foreground px-8 py-4 text-sm tracking-eyebrow hover:bg-gold hover:text-primary-foreground transition-all group"
            >
              Book your shoot
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-32 container">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="tracking-eyebrow text-gold mb-6">The Studio</p>
            <h2 className="font-display text-5xl md:text-6xl mb-8 leading-tight">
              A quiet space for<br/>loud emotion.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Lumière is a small atelier of photographers obsessed with the in-between — the laugh before the kiss, the breath before the vow.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We work in long, unhurried sessions. We bring lighting, props and a calm room. You bring the moment.
            </p>
          </div>
          <div className="aspect-[4/5] overflow-hidden">
            <img src={about} alt="Studio interior" loading="lazy" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Featured shoots */}
      <section id="gallery" className="py-32 bg-secondary/40">
        <div className="container">
          <div className="flex items-end justify-between mb-16">
            <div>
              <p className="tracking-eyebrow text-gold mb-4">Featured Sets</p>
              <h2 className="font-display text-5xl md:text-6xl">Recent work.</h2>
            </div>
            <Link to="/gallery" className="hidden md:inline-flex items-center gap-2 text-sm tracking-eyebrow hover:text-gold transition-colors">
              View gallery <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {packages.map((p, i) => (
              <Link
                key={p.id}
                to={`/booking/${p.id}`}
                className={`group block ${i % 2 === 0 ? "md:mt-12" : ""}`}
              >
                <div className="aspect-[3/4] overflow-hidden mb-4 bg-muted">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="tracking-eyebrow text-muted-foreground text-[0.65rem] mb-1">{p.tag}</p>
                <h3 className="font-display text-2xl group-hover:text-gold transition-colors">{p.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-32 container">
        <div className="max-w-3xl mx-auto text-center">
          <p className="tracking-eyebrow text-gold mb-8">Kind Words</p>
          <blockquote className="font-display text-3xl md:text-5xl leading-[1.2] italic">
            “They didn't just photograph our wedding. They made it feel like a film we'd want to live inside forever.”
          </blockquote>
          <p className="mt-10 text-sm tracking-eyebrow text-muted-foreground">Aisha & Rohan · December 2024</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-foreground text-background">
        <div className="container text-center">
          <h2 className="font-display text-5xl md:text-7xl mb-8">Let's create<br/>something timeless.</h2>
          <Link
            to="/packages"
            className="inline-flex items-center gap-3 bg-gold text-foreground px-8 py-4 text-sm tracking-eyebrow hover:bg-background transition-all group"
          >
            View packages
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
