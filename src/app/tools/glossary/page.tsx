import type { Metadata } from "next";
import { client, sanityFetch } from "../../../../sanity/lib/client";
import { allGlossaryTermsQuery } from "../../../../sanity/lib/queries";
import type { GlossaryTerm } from "@/types";
import { GlossaryClient } from "./GlossaryClient";

export const metadata: Metadata = {
  title: "FFB Glossary | FFB Hub",
  description:
    "A comprehensive glossary of force feedback terms, settings, and concepts for sim racing.",
};

export default async function GlossaryPage() {
  const terms = await sanityFetch<GlossaryTerm[]>(allGlossaryTermsQuery);

  return <GlossaryClient terms={terms} />;
}
