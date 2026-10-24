import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { DetailSection, PageHero } from "../page-components";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

const services = [
  { no: "01", name: "Home cleaning", tag: "RESIDENTIAL", copy: "Regular care for the rooms you live in, shaped around your routine and the details that matter to you.", image: "/residential 1.jpg" },
  { no: "02", name: "Commercial cleaning", tag: "WORKSPACES", copy: "A well-kept workplace that feels ready for the people who use it, day after day.", image: "/workspace 1.jpg" },
  { no: "03", name: "Deep & move cleans", tag: "FRESH STARTS", copy: "A careful reset for the places that need extra attention, including move-in and move-out visits.", image: "/Deep cleaning 1.jpg" },
  { no: "04", name: "Shallow cleaning", tag: "ROUTINE CARE", copy: "A practical surface-level refresh for well-maintained spaces and everyday upkeep.", image: "/routine care 1.jpg" },
  { no: "05", name: "Post-renovation cleaning", tag: "AFTER RENOVATION", copy: "A careful clean to clear renovation dust and leave updated rooms ready to enjoy.", image: "/after renovation 1.jpg" },
  { no: "06", name: "Floor cleaning and polishing", tag: "FLOOR CARE", copy: "Focused floor care to lift everyday dirt and bring back a smooth, polished finish.", image: "/floor care 1.jpg" },
];

const serviceImages: Record<string, string> = {
  home: "/residential 1.jpg",
  commercial: "/workspace 1.jpg",
  deep: "/Deep cleaning 1.jpg",
  routine: "/routine care 1.jpg",
  renovation: "/after renovation 1.jpg",
  floor: "/floor care 1.jpg",
};

function imageForService(name: string, imagePath: string | null, index: number) {
  const normalized = name.toLowerCase();
  if (normalized.includes("home") || normalized.includes("residential")) return serviceImages.home;
  if (normalized.includes("commercial") || normalized.includes("office")) return serviceImages.commercial;
  if (normalized.includes("deep") || normalized.includes("move")) return serviceImages.deep;
  if (normalized.includes("routine") || normalized.includes("shallow")) return serviceImages.routine;
  if (normalized.includes("renovation")) return serviceImages.renovation;
  if (normalized.includes("floor")) return serviceImages.floor;
  return imagePath || services[index % services.length].image;
}

export default async function ServicesPage() {
  let activeServices = services;
  try {
    const { data, error } = await createSupabaseServerClient().from("service_catalog").select("name,description,image_path,sort_order").eq("active", true).order("sort_order");
    if (!error && data) activeServices = data
      .filter((service) => service.name.trim().toLowerCase() !== "something else")
      .map((service, index) => ({ no: String(index + 1).padStart(2, "0"), name: service.name, tag: "AVAILABLE SERVICE", copy: service.description, image: imageForService(service.name, service.image_path, index) }));
  } catch { /* The static public service list remains available until the dashboard schema is installed. */ }
  return <main className="interior-page services-page">
    <PageHero eyebrow="THOUGHTFUL CLEANING" title="A place for every" emphasis="kind of clean." description="Practical, considered cleaning for the spaces where life and work happen." image="photo-1600210492486-724fe5c67fb0" showImage={false}/>
    <DetailSection eyebrow="OUR SERVICES" title="A fresh start, made around you.">
      <div className="route-service-grid">{activeServices.map((service) => <article className="route-service" key={service.no}><div className="route-service-image"><Image src={service.image} alt={`${service.name} service`} fill sizes="(max-width: 760px) calc(100vw - 48px), (max-width: 980px) 44vw, 28vw" className="route-service-photo"/><span className="service-number">{service.no}</span><Link href="/quote" aria-label={`Get a quote for ${service.name}`}><ArrowUpRight size={20}/></Link></div><div className="route-service-body"><span className="route-service-tag">{service.tag}</span><h3>{service.name}</h3><p>{service.copy}</p><Link href="/quote" className="text-link">Ask about this service <ArrowRight size={14}/></Link></div></article>)}</div>
    </DetailSection>
  </main>;
}
