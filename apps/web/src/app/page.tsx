import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="py-24 text-center">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-6 inline-block rounded-full bg-blue-50 px-4 py-1 text-sm font-medium text-blue-700">
            Client approvals without chaos
          </div>
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900">
            Stop searching for approvals.
            <br />
            <span className="text-blue-600">Start shipping.</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600">
            Approval Inbox centralizes client feedback from Telegram, email, Slack,
            and voice messages into one minimal workflow. Approve files, track
            revisions, and keep your team moving.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="https://app.approvalinbox.app/signup"
              className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-medium text-white hover:bg-blue-700"
            >
              Start free trial
            </Link>
            <Link
              href="/features"
              className="rounded-lg border border-gray-300 px-8 py-3 text-lg font-medium text-gray-700 hover:bg-gray-50"
            >
              See features
            </Link>
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="border-t bg-gray-50 py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border bg-white p-8">
              <h2 className="mb-4 text-2xl font-bold text-red-600">The problem</h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span>📱</span> Feedback scattered across Telegram, email, Slack, and voice messages
                </li>
                <li className="flex items-start gap-2">
                  <span>❌</span> Approvals and revisions get lost in threads
                </li>
                <li className="flex items-start gap-2">
                  <span>📁</span> Teams waste hours searching for the latest file version
                </li>
                <li className="flex items-start gap-2">
                  <span>😤</span> No clear overview of what's approved and what's pending
                </li>
              </ul>
            </div>
            <div className="rounded-xl border bg-white p-8">
              <h2 className="mb-4 text-2xl font-bold text-green-600">Our solution</h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span>📥</span> All client feedback in one approval inbox
                </li>
                <li className="flex items-start gap-2">
                  <span>✅</span> One-click approve / reject with clear status
                </li>
                <li className="flex items-start gap-2">
                  <span>🔄</span> Automatic file versioning — never lose the latest
                </li>
                <li className="flex items-start gap-2">
                  <span>📊</span> Activity timeline with every decision logged
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h2 className="mb-12 text-3xl font-bold text-gray-900">How it works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Upload files",
                desc: "Drag and drop designs, videos, or documents into a project.",
              },
              {
                step: "2",
                title: "Share with clients",
                desc: "Send a magic link — no account needed for clients.",
              },
              {
                step: "3",
                title: "Get approvals",
                desc: "Clients comment and approve. You get notified instantly.",
              },
            ].map((item) => (
              <div key={item.step} className="rounded-xl border bg-white p-8">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-gray-50 py-24 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            Ready to stop the chaos?
          </h2>
          <p className="mb-8 text-lg text-gray-600">
            Join freelancers and agencies who use Approval Inbox to keep client work
            moving.
          </p>
          <Link
            href="https://app.approvalinbox.app/signup"
            className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-medium text-white hover:bg-blue-700"
          >
            Get started free
          </Link>
        </div>
      </section>
    </div>
  );
}