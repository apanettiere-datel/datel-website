import { Container } from '@/components/elements/container'

type ResellerPricingDocsSectionProps = {
  embedded?: boolean
}

function DownloadButton({ href, fileName }: { href: string; fileName: string }) {
  return (
    <a
      href={href}
      download={fileName}
      className="inline-flex items-center justify-center rounded-full border border-[#0e7c86] bg-[#0e7c86] px-5 py-2 text-sm font-semibold text-white transition hover:border-[#0b6670] hover:bg-[#0b6670]"
    >
      Download PDF
    </a>
  )
}

export function ResellerPricingDocsSection({ embedded = false }: ResellerPricingDocsSectionProps = {}) {
  const content = (
    <div className="w-full rounded-2xl border border-[#d7e4ee] bg-white p-8 shadow-[0_8px_24px_rgb(18_52_88/10%)]">
      <h1 className="text-3xl font-semibold tracking-tight text-[#015596] sm:text-4xl">Pricing Documentation</h1>
      <p className="mt-4 max-w-4xl text-base/7 text-[#4f6781]">
        Download the latest reseller pricing references used by the dashboard calculator.
      </p>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <article className="rounded-xl border border-[#d7e4ee] bg-[#f8fbfe] p-5">
          <h2 className="text-lg font-semibold text-[#123458]">DATEL CloudSWEET Pricing</h2>
          <p className="mt-2 text-sm/6 text-[#4f6781]">
            Includes per-domain reporting and recording tiers, storage blocks, transcription rates, and real-time/sentiment add-ons.
          </p>
          <p className="mt-3 text-xs font-semibold tracking-wide text-[#123458] uppercase">File: DATEL_CloudSWEET_Pricing.pdf</p>
          <div className="mt-4">
            <DownloadButton href="/docs/DATEL_CloudSWEET_Pricing.pdf" fileName="DATEL_CloudSWEET_Pricing.pdf" />
          </div>
        </article>

        <article className="rounded-xl border border-[#d7e4ee] bg-[#f8fbfe] p-5">
          <h2 className="text-lg font-semibold text-[#123458]">Premium Partner Program</h2>
          <p className="mt-2 text-sm/6 text-[#4f6781]">
            Covers baseline Premium Partner terms: minimum domains, per-domain monthly pricing, and reseller aggregate call-record usage charges.
          </p>
          <p className="mt-3 text-xs font-semibold tracking-wide text-[#123458] uppercase">File: Premium_Partner.pdf</p>
          <div className="mt-4">
            <DownloadButton href="/docs/Premium_Partner.pdf" fileName="Premium_Partner.pdf" />
          </div>
        </article>
      </div>
    </div>
  )

  if (embedded) {
    return content
  }

  return (
    <section className="py-16">
      <Container>{content}</Container>
    </section>
  )
}
