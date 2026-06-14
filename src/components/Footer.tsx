import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border mt-32">
    <div className="container py-16 grid md:grid-cols-4 gap-12">
      <div>
        <h3 className="font-display text-3xl mb-3">Lumière<span className="text-gold">.</span></h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          A studio devoted to capturing light, story and the irreplaceable moments in between.
        </p>
      </div>
      <div className="text-sm space-y-2">
        <p className="tracking-eyebrow text-muted-foreground mb-3">Studio</p>
        <p>14 MM Alam Road, Gulberg III</p>
        <p>Lahore, Pakistan</p>
        <p>Open Tue – Sun · 10am – 9pm</p>
      </div>
      <div className="text-sm space-y-2">
        <p className="tracking-eyebrow text-muted-foreground mb-3">Contact</p>
        <p>hello@lumiere.studio.pk</p>
        <p>+92 300 1234567</p>
      </div>
      <div className="text-sm space-y-2">
        <p className="tracking-eyebrow text-muted-foreground mb-3">Explore</p>
        <Link to="/gallery" className="block hover:text-gold">Gallery</Link>
        <Link to="/studio" className="block hover:text-gold">Studio</Link>
        <Link to="/admin" className="block hover:text-gold">Admin</Link>
      </div>
    </div>
    <div className="border-t border-border py-6 text-center text-xs text-muted-foreground tracking-wider">
      © {new Date().getFullYear()} Lumière Studio · Lahore · Crafted with care
    </div>
  </footer>
);

export default Footer;
