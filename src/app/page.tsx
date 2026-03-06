import Image from 'next/image'

import { ButtonLink, SoftButtonLink } from '@/components/elements/button'
import { Link } from '@/components/elements/link'
import { Screenshot } from '@/components/elements/screenshot'
import { ArrowNarrowRightIcon } from '@/components/icons/arrow-narrow-right-icon'
import { FAQsTwoColumnAccordion, Faq } from '@/components/sections/faqs-two-column-accordion'
import { Feature, FeaturesTwoColumnWithDemos } from '@/components/sections/features-two-column-with-demos'
import { HeroLeftAlignedWithDemo } from '@/components/sections/hero-left-aligned-with-demo'
import { Plan, PricingMultiTier } from '@/components/sections/pricing-multi-tier'
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
              href="/pricing"
              className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#ffd8a0] bg-[#fff7eb] p-1 pr-4 text-sm/6 transition-colors hover:bg-[#fff0d2]"
            >
              <span className="rounded-full bg-[#FF9F01] px-3 py-1 text-xs/5 font-semibold tracking-wide text-white uppercase">What's new</span>
              <span className="font-medium text-[#123458]">Cloud SWEET platform updates</span>
              <span className="inline-flex items-center font-semibold text-[#4f6781]">
                View plans
                <ArrowNarrowRightIcon className="ml-2" />
              </span>
            </Link>
          </div>
        }
        headline={<span className="text-[#015596]">Track every call with Cloud SWEET real-time analytics.</span>}
        subheadline={
          <p>
            Introducing Cloud SWEET, a cost-effective managed service for tracking call activity. There are no hidden
            hardware or software costs. Cloud SWEET is hosted by DATEL and managed by DATEL, so teams can launch in
            minutes and start using call analytics right away.
          </p>
        }
        cta={
          <div className="flex items-center gap-4">
            <SoftButtonLink href="/schedule-demo" size="lg">
              Schedule demo
            </SoftButtonLink>

            <ButtonLink href="/pricing" size="lg">
              View pricing <ArrowNarrowRightIcon />
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
        headline="Real-time visibility and flexible reporting in one hosted workspace."
        subheadline={
          <p>
            See call activity as calls complete, run reports on demand, and drill from summary dashboards into detailed
            call events for extensions and call center groups.
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
                  Monitor volume, distribution, and agent states in real-time. Drill down from high-level metrics to
                  detailed call events so teams can resolve issues quickly.
                </p>
              }
              cta={
                <Link href="/pricing">
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
                  Identify peak call periods, staffing gaps, and cost drivers with text and graphical reports. Add AI
                  licensing when you want deeper automated insights.
                </p>
              }
              cta={
                <Link href="/pricing#comparison">
                  Compare add-ons <ArrowNarrowRightIcon />
                </Link>
              }
            />
          </>
        }
      />

      <StatsWithGraph
        id="stats"
        eyebrow="Operational impact"
        headline="Increase productivity, reduce costs, and identify trends faster."
        subheadline={
          <p>
            Cloud SWEET helps leaders and supervisors track all call activity, manage staffing with confidence, and
            share export-ready reports without infrastructure overhead.
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
          question="Are there hidden infrastructure costs?"
          answer="No. Cloud SWEET is hosted and managed by DATEL, so there are no extra hardware or software requirements to get started."
        />
        <Faq
          id="faq-2"
          question="How quickly can teams start using analytics?"
          answer="Implementation begins with a pre-configuration checklist. DATEL then installs, configures, tests, and validates reporting so teams can onboard quickly."
        />
        <Faq
          id="faq-3"
          question="Can we schedule reports and export data?"
          answer="Yes. You can schedule reports to save time and export data to PDF or Excel for sharing with stakeholders."
        />
        <Faq
          id="faq-4"
          question="What support is included?"
          answer="The first year of maintenance and support is included, with technical support by phone, email, and web plus access to product resources."
        />
      </FAQsTwoColumnAccordion>

      <PricingMultiTier
        id="pricing"
        headline="Cloud SWEET pricing built around your base platform and add-ons"
        subheadline={
          <p>
            Start with the Cloud SWEET base platform, then add Real-Time Licensing or AI Licensing based on your
            operational needs.
          </p>
        }
        plans={
          <>
            <Plan
              name="Base Platform"
              price="Contact Sales"
              subheadline={<p>Hosted call analytics with fast deployment and no extra hardware or software.</p>}
              features={[
                'Hosted interface available on any device',
                'Instant call reporting after call completion',
                'Drill-down from summary to detailed call events',
                'Scheduled reports and automatic email delivery',
                'Export to PDF or Excel',
                'Unlimited user accounts with robust security',
              ]}
              cta={
                <SoftButtonLink href="/schedule-demo" size="lg">
                  Request quote
                </SoftButtonLink>
              }
            />
            <Plan
              name="Real-Time Licensing Add-On"
              price="Contact Sales"
              subheadline={<p>Add live operational visibility for teams that need immediate queue and extension tracking.</p>}
              badge="Popular add-on"
              features={[
                'Real-time display by extension and call center group',
                'Live call volume and distribution monitoring',
                'Supervisor alerts for service thresholds',
                'Real-time graphs for proactive staffing decisions',
              ]}
              cta={
                <SoftButtonLink href="/schedule-demo" size="lg">
                  Add real-time
                </SoftButtonLink>
              }
            />
            <Plan
              name="AI Licensing Add-On"
              price="Contact Sales"
              subheadline={<p>Add AI-powered summaries and trend detection to extend Cloud SWEET reporting workflows.</p>}
              features={[
                'AI-assisted trend summaries',
                'Automated pattern recognition across call activity',
                'Faster issue prioritization for supervisors',
                'Extended planning insights for operations leaders',
              ]}
              cta={
                <SoftButtonLink href="/schedule-demo" size="lg">
                  Add AI licensing
                </SoftButtonLink>
              }
            />
          </>
        }
      />

    </>
  )
}
