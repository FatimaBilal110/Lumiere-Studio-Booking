export type Pkg = {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  image: string;
  tag: string;
};

import mehndi from "@/assets/shoot-mehndi.jpg";
import baraat from "@/assets/shoot-baraat.jpg";
import prewedding from "@/assets/shoot-prewedding.jpg";
import portrait from "@/assets/gallery-1.jpg";

export const packages: Pkg[] = [
  {
    id: "mehndi",
    name: "Mehndi Shoot",
    price: 35000,
    duration: "2.5 hours",
    description: "Intimate ceremony coverage with candlelit detail work and family portraits.",
    image: mehndi,
    tag: "Ceremony",
  },
  {
    id: "baraat",
    name: "Baraat Shoot",
    price: 55000,
    duration: "3 hours",
    description: "Cinematic procession photography with motion-led storytelling.",
    image: baraat,
    tag: "Procession",
  },
  {
    id: "prewedding",
    name: "Pre-Wedding",
    price: 75000,
    duration: "Half day",
    description: "Editorial couple session at one location of your choice. Golden hour included.",
    image: prewedding,
    tag: "Couple",
  },
  {
    id: "portrait",
    name: "Studio Portrait",
    price: 22000,
    duration: "1.5 hours",
    description: "Refined indoor portraiture with controlled light and full styling support.",
    image: portrait,
    tag: "Studio",
  },
];

export const ADDONS = [
  { id: "lighting", label: "Premium lighting kit", price: 8000 },
  { id: "props", label: "Curated prop styling", price: 6000 },
  { id: "camera", label: "Second camera angle", price: 12000 },
  { id: "makeup", label: "On-set makeup artist", price: 18000 },
];

export const TIME_SLOTS = ["10:00 – 12:30", "14:00 – 16:30", "18:00 – 20:30"];

export const formatPKR = (n: number) => `Rs ${n.toLocaleString("en-PK")}`;

export const getPackage = (id: string) => packages.find((p) => p.id === id);
