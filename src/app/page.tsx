import Image from 'next/image'

import { ButtonLink, SoftButtonLink } from '@/components/elements/button'
import { Link } from '@/components/elements/link'
import { Screenshot } from '@/components/elements/screenshot'
import { ArrowNarrowRightIcon } from '@/components/icons/arrow-narrow-right-icon'
import { FAQsTwoColumnAccordion, Faq } from '@/components/sections/faqs-two-column-accordion'
import { Feature, FeaturesTwoColumnWithDemos } from '@/components/sections/features-two-column-with-demos'
import { HeroLeftAlignedWithDemo } from '@/components/sections/hero-left-aligned-with-demo'
import { Stat, StatsWithGraph } from '@/components/sections/stats-with-graph'
import { Testimonial, TestimonialThreeColumnGrid } from '@/components/sections/testimonials-three-column-grid'

export default function Page() {
  return (
    <>
      <HeroLeftAlignedWithDemo
        id="hero"
        eyebrow={
          <div className="flex flex-col items-start gap-4">
            <img
              src="https://www.datel-group.com/wp-content/uploads/2015/05/Cloud-Sweet-Watermark.png"
              width="280"
              height="500"
              alt="Cloud SWEET logo"
              loading="lazy"
              decoding="async"
              className="h-16 w-auto sm:h-20"
            />
            <Link
              href="/contact?team=sales#contact"
              className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#ffd8a0] bg-[#fff7eb] p-1 pr-4 text-sm/6 transition-colors hover:bg-[#fff0d2]"
            >
              <span className="rounded-full bg-[#FF9F01] px-3 py-1 text-xs/5 font-semibold tracking-wide text-white uppercase">Need Pricing?</span>
              <span className="font-medium text-[#123458]">Call DATEL for package guidance</span>
              <span className="inline-flex items-center font-semibold text-[#4f6781]">
                Contact sales
                <ArrowNarrowRightIcon className="ml-2" />
              </span>
            </Link>
          </div>
        }
        headline={<span className="text-[#015596]">Track every call with Cloud SWEET real-time analytics.</span>}
        subheadline={
          <p>
            Cloud SWEET starts with a core reporting package per domain, then scales with add-ons for call recording,
            transcription summarization, real-time queue visibility, and AI analytics. The platform is hosted and
            managed by DATEL so teams can launch quickly without infrastructure overhead.
          </p>
        }
        cta={
          <div className="flex items-center gap-4">
            <SoftButtonLink href="/schedule-demo" size="lg">
              Schedule demo
            </SoftButtonLink>

            <ButtonLink href="/contact?team=sales#contact" size="lg">
              Call DATEL <ArrowNarrowRightIcon />
            </ButtonLink>
          </div>
        }
        demo={
          <Screenshot className="rounded-lg" wallpaper="blue" placement="bottom">
            <Image
              src="/img/screenshots/hero.svg"
              alt="Cloud SWEET call analytics dashboard"
              className="h-auto w-full scale-[1.26] bg-transparent sm:scale-[1.14]"
              width={2200}
              height={1275}
            />
          </Screenshot>
        }
      />

      <FeaturesTwoColumnWithDemos
        id="features"
        eyebrow="Built for Cloud SWEET teams"
        headline="Base reporting plus modular add-ons in one hosted workspace."
        subheadline={
          <p>
            Start with core reporting and analytics, then activate recording, transcription, real-time operations, and
            AI modules based on your operational goals.
          </p>
        }
        features={
          <>
            <Feature
              demo={
                <Screenshot wallpaper="blue" placement="bottom-right">
                  <Image
                    src="/img/screenshots/realtime.svg"
                    alt="Real-time reporting view"
                    className="h-auto w-full scale-[1.24] bg-transparent sm:scale-[1.12]"
                    width={1350}
                    height={900}
                  />
                </Screenshot>
              }
              headline="Real-time call monitoring and queue control"
              subheadline={
                <p>
                  Add real-time agent and queue views when teams need live operational control. Supervisors can monitor
                  activity as calls happen and respond faster to service-level pressure.
                </p>
              }
              cta={
                <Link href="/contact?team=sales#contact">
                  Explore features <ArrowNarrowRightIcon />
                </Link>
              }
            />
            <Feature
              demo={
                <Screenshot wallpaper="green" placement="bottom-left">
                  <Image
                    src="/img/screenshots/dashboard.svg"
                    alt="Call trends and staffing insights"
                    className="h-auto w-full scale-[1.24] bg-transparent sm:scale-[1.12]"
                    width={1350}
                    height={900}
                  />
                </Screenshot>
              }
              headline="Trend analysis for staffing and cost control"
              subheadline={
                <p>
                  Expand from standard reporting into transcription summarization and AI analytics for deeper trend
                  visibility. Use usage-based modules only where they deliver value to your operation.
                </p>
              }
              cta={
                <Link href="/contact?team=sales#contact">
                  Discuss add-ons <ArrowNarrowRightIcon />
                </Link>
              }
            />
          </>
        }
      />

      <StatsWithGraph
        id="stats"
        eyebrow="Operational impact"
        headline="Align capabilities to each contact center without overbuying."
        subheadline={
          <p>
            Cloud SWEET combines base reporting with optional modules so teams can match platform scope to real
            operational needs, then expand as usage and complexity grow.
          </p>
        }
      >
        <Stat stat="Real-time visibility" text="Track queue performance and agent activity as calls complete." />
        <Stat stat="Instant call reporting" text="Start with summary dashboards, then drill into detailed events for each call." />
      </StatsWithGraph>

      <TestimonialThreeColumnGrid
        id="case-studies"
        headline="Customer outcomes"
        subheadline={
          <p>Organizations across government, logistics, nonprofit, and service sectors use DATEL to improve contact center operations.</p>
        }
      >
        <Testimonial
          quote={
            <p>
              Crown Wallpaper & Fabrics improved supervisor visibility into distribution and call flow, enabling faster
              corrective action and stronger customer service consistency.
            </p>
          }
          img={<Image src="/img/customer-logos/crown-wallpaper-and-fabrics.svg" alt="Crown Wallpaper and Fabrics" width={371} height={101} className="h-full w-full rounded-2xl object-cover" />}
          name="Crown Wallpaper & Fabrics"
          byline="Case Study"
        />
        <Testimonial
          quote={
            <p>
              Food For The Poor used scheduled and drill-down reporting across 14 departments to improve donor follow-up
              and recover missed opportunities.
            </p>
          }
          img={<Image src="/img/customer-logos/food-for-the-poor.svg" alt="Food For The Poor" width={160} height={44} className="h-full w-full rounded-2xl object-cover" />}
          name="Food For The Poor, Inc."
          byline="Case Study"
        />
        <Testimonial
          quote={
            <p>
              On Time Transport used real-time reporting and live views to identify peak windows and improve response
              consistency in a high-volume medical transport environment.
            </p>
          }
          img={<Image src="/img/customer-logos/on-time-transport.svg" alt="On Time Transport" width={160} height={44} className="h-full w-full rounded-2xl object-cover" />}
          name="On Time Transport"
          byline="Case Study"
        />
      </TestimonialThreeColumnGrid>

      <FAQsTwoColumnAccordion id="faqs" headline="Questions and answers">
        <Faq
          id="faq-1"
          question="How does Cloud SWEET packaging work?"
          answer="Cloud SWEET uses a base reporting package per domain with optional add-ons for recording, transcription, real-time views, and AI analytics. You only enable modules you need."
        />
        <Faq
          id="faq-2"
          question="How quickly can teams start using analytics?"
          answer="Implementation begins with a pre-configuration checklist. DATEL then installs, configures, tests, and validates reporting so teams can onboard quickly."
        />
        <Faq
          id="faq-3"
          question="Are some modules usage-based or dependency-based?"
          answer="Yes. Transcription and storage modules are usage-sensitive, and some AI features require recording and transcription to be enabled."
        />
        <Faq
          id="faq-4"
          question="Can we schedule reports and export data?"
          answer="Yes. Teams can schedule recurring reports, run ad hoc analysis, and export to PDF or Excel for leadership and operations reviews."
        />
      </FAQsTwoColumnAccordion>

      <section id="pricing" className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="rounded-2xl border border-[#d7e4ee] bg-white p-8 shadow-[0_8px_24px_rgb(18_52_88/10%)] sm:p-10">
            <h2 className="text-3xl font-semibold tracking-tight text-[#015596] sm:text-4xl">Pricing and Package Guidance</h2>
            <p className="mt-4 max-w-3xl text-base/7 text-[#4f6781]">
              We align CloudSWEET by domain user tier and module selection, with usage-based components where
              applicable. For package design and current pricing, talk to DATEL sales directly.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <SoftButtonLink href="/contact?team=sales#contact" size="lg">
                Call DATEL for more information
              </SoftButtonLink>
              <ButtonLink href="/pricing" size="lg">
                Open pricing sheet <ArrowNarrowRightIcon />
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}
