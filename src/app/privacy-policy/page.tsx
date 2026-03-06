import Link from 'next/link'

import { Section } from '@/components/elements/section'

const usagePurposes = [
  'Providing and maintaining the Services',
  'Responding to inquiries and communications',
  'Improving features and functionality',
  'Complying with applicable legal obligations',
] as const

export default function Page() {
  return (
    <Section id="document" eyebrow="Legal" headline="Privacy Policy" subheadline={<p>Last updated on March 2, 2026.</p>}>
      <div className="mx-auto max-w-4xl space-y-6">
        <p className="text-base/7 text-[#4f6781]">
          DATEL Software Solutions, LLC ("DATEL," "we," "us," or "our") respects your privacy and is committed to
          protecting your personal information. This Privacy Policy describes, in general terms, how we collect, use,
          store, and protect information when you interact with our websites, products, or services (collectively, the
          "Services").
        </p>

        <div>
          <h3 className="text-xl/8 font-semibold text-[#123458]">Information We Collect and How We Use It</h3>
          <p className="mt-3 text-base/7 text-[#4f6781]">
            We may collect information that you voluntarily provide to us when you interact with the Services, such as
            when you contact us, create an account, or otherwise communicate with us. This information may include basic
            personal or account details, such as your name, email address, or similar contact information.
          </p>
          <p className="mt-3 text-base/7 text-[#4f6781]">
            We may also automatically collect limited technical or usage information when you use the Services. This may
            include information such as browser type, device or operating system details, IP address, and general usage
            data.
          </p>
          <p className="mt-3 text-base/7 text-[#4f6781]">Information we collect may be used for purposes such as:</p>
          <ul className="mt-3 space-y-2 text-sm/7 text-[#123458]">
            {usagePurposes.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-2 inline-block h-2 w-2 shrink-0 rounded-full bg-[#0e7c86]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xl/8 font-semibold text-[#123458]">Sharing, Retention, and Security of Information</h3>
          <p className="mt-3 text-base/7 text-[#4f6781]">
            We do not sell your personal information. We may share information with third-party service providers who
            perform services on our behalf, such as hosting or technical support, and only to the extent necessary for
            them to perform those services. We may also disclose information if required to do so by law or in response
            to valid legal requests.
          </p>
          <p className="mt-3 text-base/7 text-[#4f6781]">
            We retain information only for as long as reasonably necessary to fulfill the purposes described in this
            Privacy Policy, unless a longer retention period is required or permitted by law.
          </p>
          <p className="mt-3 text-base/7 text-[#4f6781]">
            We take reasonable administrative, technical, and organizational measures designed to protect information
            from unauthorized access, use, alteration, or disclosure. However, no method of transmission over the
            internet or method of electronic storage is completely secure, and we cannot guarantee absolute security.
          </p>
        </div>

        <div>
          <h3 className="text-xl/8 font-semibold text-[#123458]">Your Choices, Updates, and Contact Information</h3>
          <p className="mt-3 text-base/7 text-[#4f6781]">
            You may choose not to provide certain information to us, though doing so may limit your ability to use some
            features of the Services. Depending on your location, you may have certain rights regarding your personal
            information under applicable laws.
          </p>
          <p className="mt-3 text-base/7 text-[#4f6781]">
            We may update this Privacy Policy from time to time. Any changes will be reflected by updating the "Last
            updated" date at the top of this page. Continued use of the Services after any changes indicates acceptance
            of the updated policy.
          </p>
          <p className="mt-3 text-base/7 text-[#4f6781]">If you have any questions about this Privacy Policy, please contact us at:</p>
          <p className="mt-3 text-sm/7 font-semibold text-[#123458]">DATEL Software Solutions, LLC</p>
          <p className="mt-1 text-sm/7 text-[#4f6781]">
            Email:{' '}
            <Link href="mailto:support@datel-group.com" className="font-semibold text-[#123458] underline underline-offset-4">
              support@datel-group.com
            </Link>
          </p>
          <p className="mt-1 text-sm/7 text-[#4f6781]">
            Phone:{' '}
            <Link href="tel:+17249400400" className="font-semibold text-[#123458] underline underline-offset-4">
              (724) 940-0400
            </Link>
          </p>
        </div>
      </div>
    </Section>
  )
}
