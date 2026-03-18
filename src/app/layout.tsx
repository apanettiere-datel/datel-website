import { SoftButtonLink } from '@/components/elements/button'
import { Main } from '@/components/elements/main'
import { MobileNavAutoClose } from '@/components/elements/mobile-nav-auto-close'
import {
  FooterCategory,
  FooterLink,
  FooterWithNewsletterFormCategoriesAndSocialIcons,
  NewsletterForm,
} from '@/components/sections/footer-with-newsletter-form-categories-and-social-icons'
import {
  NavbarLogo,
  NavbarMenu,
  NavbarMobileMenuGroup,
  NavbarWithLinksActionsAndCenteredLogo,
} from '@/components/sections/navbar-with-links-actions-and-centered-logo'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DATEL Cloud SWEET Real-Time Call Analytics',
  description:
    'Cloud SWEET from DATEL is a hosted and managed call analytics platform with real-time reporting, drill-down visibility, and optional AI insights.',
}

const productMenu = [
  {
    name: 'Cloud SWEET Base Platform',
    description: 'Hosted and managed call analytics with fast deployment, scheduled reports, and drill-down visibility.',
    href: '/pricing',
  },
  {
    name: 'Real-Time Analytics',
    description: 'Live views for call activity, distribution, and supervisor decision support.',
    href: '/pricing#comparison',
  },
  {
    name: 'AI Analytics Add-On',
    description: 'AI-powered summaries and trend insights layered on top of Cloud SWEET reporting.',
    href: '/pricing#comparison',
  },
]

const solutionsMenu = [
  {
    name: 'Cloud SWEET',
    description: 'DATEL hosted and DATEL managed call analytics with real-time visibility and optional AI licensing.',
    href: '/pricing',
  },
  {
    name: 'Contact SWEET Standard Edition',
    description: 'Tangible reporting and call activity visibility for teams that need practical daily control.',
    href: '/contact-sweet?edition=standard#standard-edition',
  },
  {
    name: 'Contact SWEET Small Business Edition',
    description: 'Quick to deploy contact center tools for single-site teams with up to 10 agents.',
    href: '/contact-sweet?edition=small-business#small-business-edition',
  },
  {
    name: 'Contact SWEET Enterprise Edition',
    description: 'Multi-channel operations for voice, email, and web chat in one unified workflow.',
    href: '/contact-sweet?edition=enterprise#enterprise-edition',
  },
]

const companyMenu = [
  { name: 'About DATEL', href: '/about' },
  { name: 'Case Studies', href: '/about#case-studies' },
  { name: 'Privacy policy', href: '/privacy-policy' },
]

const contactMenu = [
  {
    name: 'Contact Sales',
    description: 'Talk with the DATEL team about pricing, rollout plans, and solution fit.',
    href: '/contact?team=sales#contact',
  },
  {
    name: 'Technical Support',
    description: 'Get hands-on help with configuration, reporting, and platform questions.',
    href: '/contact?team=support#contact',
  },
  {
    name: 'Request a Demo',
    description: 'Book a guided product walkthrough with a DATEL specialist.',
    href: '/schedule-demo',
  },
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <>
          <div className="relative isolate">
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[38rem] overflow-hidden">
              <div className="absolute left-[14%] top-2 h-[22rem] w-[22rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,159,1,0.2)_0%,rgba(255,159,1,0)_70%)]" />
              <div className="absolute right-[8%] top-[-3rem] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(73,214,200,0.16)_0%,rgba(73,214,200,0)_72%)]" />
              <div className="absolute left-1/2 top-[-7rem] h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,159,1,0.18)_0%,rgba(255,159,1,0)_72%)]" />
            </div>

            <NavbarWithLinksActionsAndCenteredLogo
              id="navbar"
              links={
                <>
                  <NavbarMenu label="Product" items={productMenu} panelClassName="w-[30rem]" />
                  <NavbarMenu label="Solutions" items={solutionsMenu} panelClassName="w-[32rem]" />
                  <NavbarMenu label="Company" items={companyMenu} panelClassName="w-64" />
                  <NavbarMenu label="Contact" items={contactMenu} panelClassName="w-[30rem]" />

                  <NavbarMobileMenuGroup title="Product" items={productMenu.map((item) => ({ name: item.name, href: item.href }))} />
                  <NavbarMobileMenuGroup title="Solutions" items={solutionsMenu.map((item) => ({ name: item.name, href: item.href }))} />
                  <NavbarMobileMenuGroup title="Company" items={companyMenu} />
                  <NavbarMobileMenuGroup title="Contact" items={contactMenu.map((item) => ({ name: item.name, href: item.href }))} />
                </>
              }
              logo={
                <NavbarLogo href="/" className="px-0 py-0">
                  <img
                    src="https://www.datel-group.com/wp-content/uploads/2015/05/datel-logo-retina-display1.png"
                    width="404"
                    height="120"
                    alt="Datel Group"
                    className="fusion-logo-1x fusion-standard-logo h-7 w-auto sm:h-10 lg:h-11"
                  />
                </NavbarLogo>
              }
              actions={
                <>
                  <SoftButtonLink href="/schedule-demo" className="hidden xl:inline-flex">
                    Request demo
                  </SoftButtonLink>
                </>
              }
            />

            <MobileNavAutoClose />
            <Main>{children}</Main>
          </div>

          <FooterWithNewsletterFormCategoriesAndSocialIcons
            id="footer"
            cta={
              <NewsletterForm
                headline="Stay informed"
                subheadline={
                  <p>
                    Receive product updates, implementation guidance, and analytics best practices for modern contact center teams.
                  </p>
                }
                action="#"
              />
            }
            links={
              <>
                <FooterCategory title="Platform">
                  <FooterLink href="/pricing">Cloud SWEET Platform</FooterLink>
                  <FooterLink href="/pricing#comparison">Base and add-on comparison</FooterLink>
                  <FooterLink href="/schedule-demo">Request demo</FooterLink>
                </FooterCategory>
                <FooterCategory title="Resources">
                  <FooterLink href="/docs">Documentation</FooterLink>
                  <FooterLink href="/about#case-studies">Case studies</FooterLink>
                  <FooterLink href="/about">Implementation approach</FooterLink>
                </FooterCategory>
                <FooterCategory title="Support">
                  <FooterLink href="/contact?team=support#contact">Contact support</FooterLink>
                  <FooterLink href="mailto:support@datel-group.com">support@datel-group.com</FooterLink>
                  <FooterLink href="tel:+17249400400">(724) 940-0400</FooterLink>
                </FooterCategory>
                <FooterCategory title="Company">
                  <FooterLink href="/about">About DATEL</FooterLink>
                  <FooterLink href="/contact?team=sales#contact">Contact DATEL</FooterLink>
                  <FooterLink href="/privacy-policy">Privacy policy</FooterLink>
                </FooterCategory>
                <FooterCategory title="Sales">
                  <FooterLink href="mailto:sales@datel-group.com">sales@datel-group.com</FooterLink>
                  <FooterLink href="tel:+17249400400">(724) 940-0400</FooterLink>
                  <FooterLink href="/schedule-demo">Request a demo</FooterLink>
                </FooterCategory>
              </>
            }
            fineprint="© 2026 DATEL Software Solutions, LLC"
          />
        </>
      </body>
    </html>
  )
}
