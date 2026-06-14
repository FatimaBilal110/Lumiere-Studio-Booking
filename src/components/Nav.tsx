import { Link } from "react-router-dom";

const Nav = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/50">
    <div className="container flex items-center justify-between h-16">
      <Link to="/" className="font-display text-2xl tracking-tight">
        Lumière<span className="text-gold">.</span>
      </Link>
      <div className="hidden md:flex items-center gap-10 text-sm">
        <Link to="/" className="hover:text-gold transition-colors">Home</Link>
        <Link to="/packages" className="hover:text-gold transition-colors">Packages</Link>
        <Link to="/gallery" className="hover:text-gold transition-colors">Gallery</Link>
        <Link to="/studio" className="hover:text-gold transition-colors">Studio</Link>
      </div>
      <Link
        to="/packages"
        className="text-xs tracking-eyebrow border border-foreground px-5 py-2.5 hover:bg-foreground hover:text-background transition-all"
      >
        Book Now
      </Link>
    </div>
  </nav>
);

export default Nav;
