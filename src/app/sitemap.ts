import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://rentities.in/", lastModified: new Date() },
    { url: "https://rentities.in/features", lastModified: new Date() },
    { url: "https://rentities.in/pricing", lastModified: new Date() },
    { url: "https://rentities.in/contact", lastModified: new Date() },
  ];
}
