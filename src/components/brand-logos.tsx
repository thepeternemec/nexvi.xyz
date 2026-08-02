import googleAsset from "@/assets/brands/google.svg.asset.json";
import microsoftAsset from "@/assets/brands/microsoft.svg.asset.json";
import appleAsset from "@/assets/brands/apple.svg.asset.json";
import metaAsset from "@/assets/brands/meta.svg.asset.json";
import netflixAsset from "@/assets/brands/netflix.svg.asset.json";
import adobeAsset from "@/assets/brands/adobe.svg.asset.json";
import salesforceAsset from "@/assets/brands/salesforce.svg.asset.json";
import nvidiaAsset from "@/assets/brands/nvidia.svg.asset.json";
import sapAsset from "@/assets/brands/sap.svg.asset.json";
import ibmAsset from "@/assets/brands/ibm.svg.asset.json";
import spotifyAsset from "@/assets/brands/spotify.svg.asset.json";
import airbnbAsset from "@/assets/brands/airbnb.svg.asset.json";

export type Brand = {
  key: string;
  name: string;
  url: string;
  /** intrinsic aspect ratio (width / height) of the official logo file */
  ratio: number;
  /** monochrome logo — invert it in dark mode so it stays legible */
  mono?: boolean;
};

/**
 * Official brand logos (real logo files, wordmark included where the brand has one).
 * Rendered as <img> so the original artwork and colours stay untouched.
 */
export const brands: Brand[] = [
  { key: "google", name: "Google", url: googleAsset.url, ratio: 512 / 168 },
  { key: "microsoft", name: "Microsoft", url: microsoftAsset.url, ratio: 512 / 110 },
  { key: "meta", name: "Meta", url: metaAsset.url, ratio: 512 / 104 },
  { key: "netflix", name: "Netflix", url: netflixAsset.url, ratio: 512 / 138 },
  { key: "adobe", name: "Adobe", url: adobeAsset.url, ratio: 512 / 134 },
  { key: "salesforce", name: "Salesforce", url: salesforceAsset.url, ratio: 256 / 180 },
  { key: "nvidia", name: "NVIDIA", url: nvidiaAsset.url, ratio: 512 / 98 },
  { key: "sap", name: "SAP", url: sapAsset.url, ratio: 512 / 254 },
  { key: "ibm", name: "IBM", url: ibmAsset.url, ratio: 512 / 205, mono: true },
  { key: "spotify", name: "Spotify", url: spotifyAsset.url, ratio: 512 / 160 },
  { key: "airbnb", name: "Airbnb", url: airbnbAsset.url, ratio: 512 / 161 },
  { key: "apple", name: "Apple", url: appleAsset.url, ratio: 256 / 315, mono: true },
];

export const brandByKey = Object.fromEntries(brands.map((b) => [b.key, b]));

/**
 * Renders an official brand logo at a fixed height, width derived from the
 * logo's own aspect ratio so nothing is squashed.
 */
export function BrandLogo({
  brand,
  height = 28,
  className,
}: {
  brand: string | Brand;
  height?: number;
  className?: string;
}) {
  const b = typeof brand === "string" ? brandByKey[brand] : brand;
  if (!b) return null;
  return (
    <img
      src={b.url}
      alt={`${b.name} logo`}
      loading="lazy"
      decoding="async"
      style={{ height, width: height * b.ratio }}
      className={`${b.mono ? "dark:invert" : ""} ${className ?? ""}`.trim()}
    />
  );
}
