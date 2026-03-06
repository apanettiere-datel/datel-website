export default function Page() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="rounded-2xl border border-[#d7e4ee] bg-white p-8 shadow-[0_8px_24px_rgb(18_52_88/10%)]">
          <h1 className="text-3xl font-semibold tracking-tight text-[#015596] sm:text-4xl">Documentation and enablement</h1>
          <p className="mt-4 text-base/7 text-[#4f6781]">
            Use DATEL documentation to implement Cloud SWEET AI Analytics, configure real-time operations views,
            and standardize reporting for supervisors and leadership teams.
          </p>
          <ul className="mt-6 space-y-2 text-sm/6 text-[#123458]">
            <li>Implementation quick start, pre-configuration checklist, and deployment workflow</li>
            <li>Real-time wallboard setup, queue thresholds, and alerting guidance</li>
            <li>AI-assisted trend and sentiment reporting playbooks for supervisors</li>
            <li>Operational governance, access controls, and support runbooks</li>
            <li>Scheduled reporting templates for weekly and monthly performance reviews</li>
          </ul>
          <p className="mt-6 text-sm/6 text-[#4f6781]">
            Need help applying these guides to your environment? Contact{' '}
            <a className="font-semibold text-[#123458]" href="mailto:support@datel-group.com">
              support@datel-group.com
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  )
}
