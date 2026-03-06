import Image from 'next/image'
import { MotionReveal } from '@/components/elements/motion'

const partnershipPillars = [
  {
    label: 'Easy onboarding',
    title: 'Easy',
    body: 'Dedicated teams support pricing, solution design, and tailored demonstrations.',
  },
  {
    label: 'Profitable delivery',
    title: 'Profitable',
    body: 'DATEL-led delivery reduces internal lift so your team can stay focused on customer growth.',
  },
  {
    label: 'Innovative solutions',
    title: 'Innovative',
    body: 'Cloud SWEET and Contact SWEET provide scalable capabilities for analytics, reporting, and contact center management.',
  },
  {
    label: 'Experienced support',
    title: 'Experienced',
    body: 'Longstanding platform partnerships and operational expertise support stable outcomes.',
  },
  {
    label: 'Implementation included',
    title: 'Implementation included',
    body: 'Remote installation, configuration, and validation are handled by experienced DATEL specialists.',
  },
  {
    label: 'Training included',
    title: 'Training included',
    body: 'Training sessions are tailored to team roles, workflows, and reporting goals.',
  },
  {
    label: 'Customer delight',
    title: 'Customer delight',
    body: 'Our service model prioritizes timely issue resolution and proactive communication.',
  },
  {
    label: 'Support resources',
    title: 'Support resources',
    body: 'Customers receive access to ticketing, training resources, FAQs, and product updates.',
  },
]

const caseStudies = [
  {
    name: 'Crown Wallpaper & Fabrics',
    sector: 'Retail customer service',
    logo: '/img/customer-logos/crown-wallpaper-and-fabrics.svg',
    summary:
      'Crown needed better visibility into call distribution and supervisor performance across customer service teams in Toronto, Montreal, and Vancouver.',
    result:
      'With real time monitoring and widget-based controls, supervisors now track queue flow, distribution, and log in and log out behavior to improve response quality.',
    highlight: 'Improved call distribution and faster issue correction',
  },
  {
    name: 'Food For The Poor, Inc.',
    sector: 'Nonprofit fundraising operations',
    logo: '/img/customer-logos/food-for-the-poor.svg',
    summary:
      'Food For The Poor replaced an outdated reporting system and needed deeper departmental and individual visibility across 14 departments.',
    result:
      'Scheduled weekly and monthly reporting, call retrieval, and agent accountability tools helped recover missed donor opportunities and improve operational planning.',
    highlight: 'Break-even in approximately 18 months',
  },
  {
    name: 'Jurupa Community Services District',
    sector: 'Utilities and public service',
    logo: '/img/customer-logos/jurupa-community-services-district.svg',
    summary:
      'As service territory grew, JCSD needed stronger insight into queue behavior and customer service performance after telephony modernization.',
    result:
      'Calls were answered three times faster, abandoned calls were reduced significantly, and live views enabled supervisors to manage queue pressure without floor disruption.',
    highlight: 'Faster answer speed and fewer abandoned calls',
  },
  {
    name: 'Local Government',
    sector: 'Municipal multi-office operations',
    logo: '/img/customer-logos/municipal-government.svg',
    summary:
      'A municipality coordinating 26 offices needed reliable call visibility across departments including utilities, fire, building safety, and urban safety.',
    result:
      'Using Avaya Aura and DATEL UCCS, supervisors gained live queue alarms, benchmarking tools, and department-level planning data to improve staffing and budgets.',
    highlight: 'Lost calls reduced by more than half on peak days',
  },
  {
    name: 'Municipal Government',
    sector: 'Regional government services',
    logo: '/img/customer-logos/municipal-government.svg',
    summary:
      'The region needed one platform for both call accounting and contact center management to support inbound service calls and outbound campaigns.',
    result:
      'DATEL implemented an integrated platform with full training and support, giving managers a unified view of historical and live operations in one interface.',
    highlight: 'Unified call data and live management in one system',
  },
  {
    name: 'On Time Transport Inc.',
    sector: 'Medical transportation',
    logo: '/img/customer-logos/on-time-transport.svg',
    summary:
      'On Time Transport needed accurate, trusted reporting to handle emergency and routine call demand in a 24/7 medical environment.',
    result:
      'Real time and historical reporting identified peak windows, improved staffing decisions, and made scheduled reporting easier for daily operations.',
    highlight: 'Greater visibility into peak periods and shift planning',
  },
  {
    name: 'Online Vacation Center',
    sector: 'Travel sales and service',
    logo: '/img/customer-logos/online-vacation-center.svg',
    summary:
      'Online Vacation Center needed more control over call center operations and better visibility into dropped calls and agent activity across office and remote teams.',
    result:
      'Managers gained live queue and status visibility, faster dropped-call follow-up, and stronger real time coaching support for sales and service performance.',
    highlight: 'Improved proactive follow-up and agent efficiency',
  },
  {
    name: 'Whaley Foodservice Repairs',
    sector: 'Field service and repairs',
    logo: '/img/customer-logos/whaley-parts-and-supply.svg',
    summary:
      'Whaley replaced a competing solution to gain clearer reporting on multi-group call handling, idle time, and unavailable states across a distributed operation.',
    result:
      'Daily and monthly reporting plus live supervisor views helped optimize staffing windows, reduce abandoned calls, and avoid additional hiring.',
    highlight: 'Abandoned calls cut by more than half',
  },
] as const

const [featuredCaseStudy, ...supportingCaseStudies] = caseStudies

export default function Page() {
  return (
    <>
      <section id="story" className="py-12 sm:py-16">
        <div className="mx-auto max-w-[var(--layout-max-width)] px-6 lg:px-10">
          <MotionReveal amount={0.15}>
            <div className="relative isolate overflow-hidden rounded-[2rem] border border-[#d7e4ee] bg-white p-8 shadow-[0_18px_40px_rgb(18_52_88/10%)] sm:p-10 lg:p-12">
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#123458] via-[#0e7c86] to-[#FF9F01]" />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 -z-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(73,214,200,0.24)_0%,rgba(73,214,200,0)_68%)]"
            />

            <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <h1 className="text-4xl/11 font-semibold tracking-tight text-[#015596] sm:text-5xl/13">The DATEL Story</h1>
                <p className="mt-5 text-base/7 text-[#4f6781]">
                  DATEL Software Solutions develops solutions that maximize the effectiveness of your telecommunications
                  data. We help teams take control of their telecommunications environment with real time and historical
                  reporting, plus live call center agent monitoring across operations of any size.
                </p>
              </div>
              <div>
                <Image
                  src="/img/photos/pittsburgh.svg"
                  alt="DATEL services and support"
                  width={1800}
                  height={945}
                  className="rounded-2xl not-dark:bg-white/75"
                />
              </div>
            </div>

            <div className="relative z-10 mt-10 border-t border-[#d7e4ee] pt-10">
              <p className="text-sm/6 font-semibold tracking-wide text-[#0e7c86] uppercase">Our history</p>
              <h2 className="mt-2 text-3xl/10 font-semibold tracking-tight text-[#015596] sm:text-4xl">
                Built in 2004 for a rapidly changing call accounting and contact center market
              </h2>
              <p className="mt-4 max-w-4xl text-base/7 text-[#4f6781]">
                DATEL Software Solutions was established in 2004 and built on more than 25 years of industry experience
                from The DATEL Group. In 2006, DATEL joined the Avaya Developers Connection Program and launched Call
                SWEET Live software for Avaya IP Office. Today, more than 1,000 customers and 150 business partners
                use and sell DATEL solutions.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <article className="rounded-2xl border border-[#d7e4ee] bg-[#f9fbfd] p-5">
                  <h3 className="text-base/7 font-semibold text-[#015596]">Established 2004</h3>
                  <p className="mt-2 text-sm/6 text-[#4f6781]">
                    Focused from day one on practical call accounting and call center analytics solutions.
                  </p>
                </article>
                <article className="rounded-2xl border border-[#d7e4ee] bg-[#f9fbfd] p-5">
                  <h3 className="text-base/7 font-semibold text-[#015596]">Joined in 2006</h3>
                  <p className="mt-2 text-sm/6 text-[#4f6781]">
                    Entered the Avaya Developers Connection Program and delivered Call SWEET Live for IP Office.
                  </p>
                </article>
                <article className="rounded-2xl border border-[#d7e4ee] bg-[#f9fbfd] p-5">
                  <h3 className="text-base/7 font-semibold text-[#015596]">1,000+ customers</h3>
                  <p className="mt-2 text-sm/6 text-[#4f6781]">
                    Adopted by organizations that rely on data-driven contact center operations.
                  </p>
                </article>
                <article className="rounded-2xl border border-[#d7e4ee] bg-[#f9fbfd] p-5">
                  <h3 className="text-base/7 font-semibold text-[#015596]">150 partners</h3>
                  <p className="mt-2 text-sm/6 text-[#4f6781]">
                    Supported by a partner network that sells and implements DATEL solutions.
                  </p>
                </article>
              </div>
            </div>
            </div>
          </MotionReveal>
        </div>
      </section>

      <section id="difference" className="py-12 sm:py-16">
        <div className="mx-auto max-w-[var(--layout-max-width)] px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:auto-rows-fr">
            <MotionReveal y={18} amount={0.15}>
              <article className="h-full rounded-[1.75rem] border border-[#d7e4ee] bg-white p-8 shadow-[0_16px_36px_rgb(18_52_88/10%)]">
              <p className="text-sm/6 font-semibold tracking-wide text-[#0e7c86] uppercase">Company overview</p>
              <p className="mt-4 text-base/7 text-[#4f6781]">
                DATEL Software Solutions provides call accounting and call center solutions that fit the needs of small,
                mid-market, and enterprise teams. Our platform helps customers gain control with real time visibility,
                historical reporting, and live monitoring tools.
              </p>
              </article>
            </MotionReveal>
            <MotionReveal delay={0.06} y={18} amount={0.15}>
              <article className="h-full rounded-[1.75rem] border border-[#d7e4ee] bg-white p-8 shadow-[0_16px_36px_rgb(18_52_88/10%)]">
              <p className="text-sm/6 font-semibold tracking-wide text-[#0e7c86] uppercase">The DATEL Difference</p>
              <p className="mt-4 text-base/7 text-[#4f6781]">
                DATEL is focused on customer satisfaction in every phase of sales and implementation. We work closely
                with business partners to deliver solutions and support models that keep customers 100% delighted with
                our solutions.
              </p>
              </article>
            </MotionReveal>
            <MotionReveal delay={0.1} y={18} amount={0.15}>
              <article className="h-full rounded-[1.75rem] border border-[#d7e4ee] bg-white p-8 shadow-[0_16px_36px_rgb(18_52_88/10%)]">
              <p className="text-sm/6 font-semibold tracking-wide text-[#0e7c86] uppercase">Pre-sales support</p>
              <p className="mt-4 text-base/7 text-[#4f6781]">
                Bring DATEL an opportunity and our team supports the full pre-sales cycle with quick proposal turnaround,
                technical consultation, and live customer demonstrations tailored to the use case.
              </p>
              </article>
            </MotionReveal>
            <MotionReveal delay={0.14} y={18} amount={0.15}>
              <article className="h-full rounded-[1.75rem] border border-[#d7e4ee] bg-white p-8 shadow-[0_16px_36px_rgb(18_52_88/10%)]">
              <p className="text-sm/6 font-semibold tracking-wide text-[#0e7c86] uppercase">Ongoing support</p>
              <p className="mt-4 text-base/7 text-[#4f6781]">
                DATEL includes a one-year ForeverSWEET! Customer Care subscription with all solutions. Customers
                receive patches, upgrades, unlimited phone support, and unlimited remote access during year one at no
                additional charge. Sales and technical support are core reasons DATEL delivers strong long-term value.
              </p>
              </article>
            </MotionReveal>
          </div>
        </div>
      </section>

      <section id="case-studies" className="py-12 sm:py-16">
        <div className="mx-auto max-w-[var(--layout-max-width)] px-6 lg:px-10">
          <MotionReveal className="mx-auto max-w-3xl text-center" amount={0.15}>
            <p className="text-sm/6 font-semibold tracking-wide text-[#0e7c86] uppercase">Case studies</p>
            <p className="mt-1 text-sm/6 text-[#4f6781]">Home / Resources / Case Studies</p>
            <h2 className="mt-3 text-3xl/10 font-semibold tracking-tight text-[#015596] sm:text-4xl">
              Customer outcomes across government, nonprofit, logistics, and service operations
            </h2>
            <p className="mt-4 max-w-3xl text-base/7 text-[#4f6781]">
              DATEL customers use real time visibility and historical reporting to reduce lost calls, improve staffing decisions, and increase service quality.
            </p>
          </MotionReveal>

          <div className="mt-12 space-y-8">
            <MotionReveal amount={0.12}>
              <figure className="overflow-hidden rounded-[1.75rem] border border-[#d7e4ee] bg-white shadow-[0_18px_40px_rgb(18_52_88/12%)]">
                <blockquote className="p-6 sm:p-10">
                  <p className="text-lg/8 font-semibold tracking-tight text-[#123458] sm:text-xl/8">{`“${featuredCaseStudy.summary}”`}</p>
                  <p className="mt-4 text-base/7 text-[#4f6781]">{featuredCaseStudy.result}</p>
                </blockquote>
                <figcaption className="flex flex-wrap items-center gap-x-4 gap-y-4 border-t border-[#d7e4ee] px-6 py-5 sm:flex-nowrap sm:px-10">
                  <div className="flex h-[3.75rem] w-[13.5rem] flex-none items-center justify-center overflow-hidden rounded-2xl border border-[#d7e4ee] bg-white p-0">
                    <Image src={featuredCaseStudy.logo} alt={featuredCaseStudy.name} width={371} height={101} className="h-full w-full rounded-2xl object-cover" />
                  </div>
                  <div className="flex-auto">
                    <p className="font-semibold text-[#123458]">{featuredCaseStudy.name}</p>
                    <p className="text-sm/6 text-[#4f6781]">{featuredCaseStudy.sector}</p>
                  </div>
                  <p className="inline-flex rounded-full border border-[#ffd698] bg-[#fff7e8] px-3 py-1 text-xs/6 font-semibold text-[#b16800]">
                    {featuredCaseStudy.highlight}
                  </p>
                </figcaption>
              </figure>
            </MotionReveal>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 xl:auto-rows-fr">
              {supportingCaseStudies.map((study, index) => (
                <MotionReveal key={study.name} delay={(index % 6) * 0.04} y={18} amount={0.12}>
                  <figure className="h-full rounded-2xl border border-[#d7e4ee] bg-white p-6 shadow-[0_14px_34px_rgb(18_52_88/10%)]">
                    <blockquote>
                      <p className="text-sm/6 text-[#4f6781]">{study.summary}</p>
                      <p className="mt-3 text-sm/6 text-[#4f6781]">{study.result}</p>
                    </blockquote>
                    <figcaption className="mt-6 border-t border-[#d7e4ee] pt-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-40 flex-none items-center justify-center overflow-hidden rounded-2xl border border-[#d7e4ee] bg-white p-0">
                          <Image src={study.logo} alt={study.name} width={371} height={101} className="h-full w-full rounded-2xl object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#123458]">{study.name}</p>
                          <p className="text-xs/6 font-medium text-[#0e7c86]">{study.sector}</p>
                        </div>
                      </div>
                      <p className="mt-3 inline-flex rounded-full border border-[#ffd698] bg-[#fff7e8] px-2.5 py-1 text-xs/6 font-semibold text-[#b16800]">
                        {study.highlight}
                      </p>
                    </figcaption>
                  </figure>
                </MotionReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="team" className="relative isolate py-12 sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/3 -z-10 mx-auto h-72 w-[72rem] max-w-full bg-[radial-gradient(circle,rgba(73,214,200,0.2)_0%,rgba(73,214,200,0)_68%)] blur-3xl"
        />
        <div className="mx-auto max-w-[var(--layout-max-width)] px-6 lg:px-10">
          <MotionReveal className="mx-auto max-w-3xl text-center" amount={0.15}>
            <p className="text-sm/6 font-semibold tracking-wide text-[#0e7c86] uppercase">Partnership model</p>
            <h2 className="mt-2 text-3xl/10 font-semibold tracking-tight text-[#015596] sm:text-4xl">
              What makes a DATEL partnership valuable
            </h2>
            <p className="mt-4 text-base/7 text-[#4f6781]">
              Our approach is designed to be straightforward to deploy, practical to scale, and reliable to support
              across SMB, mid-market, and enterprise environments.
            </p>
          </MotionReveal>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {partnershipPillars.map((pillar, index) => (
              <MotionReveal key={pillar.title} delay={(index % 4) * 0.06} y={18} amount={0.15}>
                <article className="rounded-[1.5rem] border border-[#d7e4ee] bg-white p-6 shadow-[0_12px_30px_rgb(18_52_88/9%)]">
                <p className="inline-flex rounded-full bg-[#eef4f8] px-2.5 py-1 text-xs/6 font-semibold text-[#123458]">{pillar.label}</p>
                <h3 className="mt-4 text-lg/7 font-semibold text-[#123458]">{pillar.title}</h3>
                <p className="mt-3 text-sm/6 text-[#4f6781]">{pillar.body}</p>
                </article>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

    </>
  )
}
