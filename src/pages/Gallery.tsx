import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { packages } from "@/data/packages";
import hero from "@/assets/hero-1.jpg";
import about from "@/assets/about-studio.jpg";
import gal from "@/assets/gallery-1.jpg";

const images = [
  { src: hero, alt: "Bridal portrait", tag: "Bridal" },
  ...packages.map((p) => ({ src: p.image, alt: p.name, tag: p.tag })),
  { src: about, alt: "Studio interior", tag: "Studio" },
  { src: gal, alt: "Editorial portrait", tag: "Portrait" },
];

const Gallery = () => (
  <div className="min-h-screen">
    <Nav />
    <section className="pt-32 pb-12 container">
      <p className="tracking-eyebrow text-gold mb-6">Selected Work</p>
      <h1 className="font-display text-6xl md:text-7xl max-w-3xl leading-[0.95]">A gallery of light & memory.</h1>
      <p className="text-muted-foreground mt-8 max-w-xl text-lg">
        A curated selection of recent work from weddings, ceremonies and editorial sessions across Pakistan.
      </p>
    </section>
    <section className="container pb-32">
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
        {images.concat(images).map((img, i) => (
          <figure key={i} className="mb-6 break-inside-avoid overflow-hidden bg-muted group">
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <figcaption className="mt-2 text-xs tracking-eyebrow text-muted-foreground">{img.tag}</figcaption>
          </figure>
        ))}
      </div>
    </section>
    <Footer />
  </div>
);

export default Gallery;
