import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import about from "@/assets/about-studio.jpg";
import hero from "@/assets/hero-1.jpg";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Studio = () => (
  <div className="min-h-screen">
    <Nav />
    <section className="pt-32 pb-16 container grid md:grid-cols-2 gap-16 items-center">
      <div>
        <p className="tracking-eyebrow text-gold mb-6">Our Studio · Lahore</p>
        <h1 className="font-display text-6xl md:text-7xl leading-[0.95] mb-8">
          Light, space<br/>and stillness.
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed mb-6">
          Tucked away on MM Alam Road, our 2,200 sq ft atelier was built around a single idea — give every story the room it deserves.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Two daylight bays, a blackout cyclorama, three styling rooms and a quiet lounge for families. Everything you need, nothing you don't.
        </p>
      </div>
      <div className="aspect-[4/5] overflow-hidden">
        <img src={about} alt="Studio interior" className="w-full h-full object-cover" />
      </div>
    </section>

    <section className="py-32 bg-secondary/40">
      <div className="container grid md:grid-cols-3 gap-12">
        {[
          { t: "Daylight Bay", d: "12ft north-facing windows. Soft, diffused light all day." },
          { t: "Cyclorama", d: "Seamless white & black infinity wall for editorial sets." },
          { t: "Styling Suite", d: "Two private rooms with full lighting & wardrobe rails." },
        ].map((f) => (
          <div key={f.t}>
            <p className="tracking-eyebrow text-gold mb-3">{f.t}</p>
            <p className="text-muted-foreground leading-relaxed">{f.d}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="container py-32 grid md:grid-cols-2 gap-16 items-center">
      <div className="aspect-[4/5] overflow-hidden order-2 md:order-1">
        <img src={hero} alt="Behind the scenes" className="w-full h-full object-cover" />
      </div>
      <div className="order-1 md:order-2">
        <p className="tracking-eyebrow text-gold mb-6">Visit</p>
        <h2 className="font-display text-5xl mb-8">Come say hello.</h2>
        <div className="space-y-2 text-muted-foreground mb-8">
          <p>14 MM Alam Road, Gulberg III</p>
          <p>Lahore, Pakistan</p>
          <p>Open Tue – Sun · 10am – 9pm</p>
          <p className="pt-3">+92 300 1234567</p>
          <p>hello@lumiere.studio.pk</p>
        </div>
        <Link
          to="/packages"
          className="inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 text-sm tracking-eyebrow hover:bg-gold hover:text-foreground transition-all group"
        >
          Book a session <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
    <Footer />
  </div>
);

export default Studio;
