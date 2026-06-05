import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "For solo freelancers trying out the workflow.",
    features: [
      "1 project",
      "5 files per month",
      "Magic-link client access",
      "Basic email notifications",
    ],
    cta: "Get started",
    href: "https://app.approvalinbox.app/signup",
    highlight: false,
  },
  {
    name: "Solo",
    price: "$9",
    period: "/month",
    desc: "For serious freelancers with multiple clients.",
    features: [
      "10 projects",
      "Unlimited files",
      "Magic-link client access",
      "Custom branding",
      "Priority email support",
    ],
    cta: "Start free trial",
    href: "https://app.approvalinbox.app/signup",
    highlight: true,
  },
  {
    name: "Agency",
    price: "$39",
    period: "/month",
    desc: "For studios and small agencies.",
    features: [
      "Unlimited projects",
      "Unlimited files",
      "Full client accounts (password login)",
      "Team member accounts",
      "Custom branding",
      "Priority support",
    ],
    cta: "Start free trial",
    href: "https://app.approvalinbox.app/signup",
    highlight: false,
  },
];

const faq = [
  {
    q: "Can clients use the platform without creating an account?",
    a: "Yes! On Free and Solo plans, clients receive a magic link and can comment and approve without a password. Agency plan includes full client accounts.",
  },
  {
    q: "What file types are supported?",
    a: "Images (JPG, PNG, WebP, GIF, SVG), PDFs, videos (MP4, MOV), audio (MP3, WAV), and Office documents (DOCX, XLSX, PPTX).",
  },
  {
    q: "Is there a free trial?",
    a: "Yes. Start with the Free plan — no credit card required. Upgrade to Solo or Agency anytime.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. You can cancel your subscription at any time. You'll retain access until the end of your billing period.",
  },
];

export default function PricingPage() {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-5xl px-4 text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          Simple, transparent pricing
        </h1>
        <p className="mb-16 text-lg text-gray-600">
          Start free. Upgrade when you need more projects or clients.
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-6 px-4 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-xl border bg-white p-8 ${
              plan.highlight
                ? "relative border-blue-500 shadow-lg ring-2 ring-blue-500"
                : "shadow-sm"
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-medium text-white">
                Most popular
              </div>
            )}
            <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
            <div className="mt-4">
              <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
              <span className="ml-1 text-sm text-gray-500">{plan.period}</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">{plan.desc}</p>
            <ul className="mt-6 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="mt-0.5 text-blue-600">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={plan.href}
              className={`mt-8 block w-full rounded-lg py-3 text-center text-sm font-medium ${
                plan.highlight
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="mx-auto mt-24 max-w-3xl px-4">
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">
          Frequently asked questions
        </h2>
        <div className="space-y-4">
          {faq.map((item) => (
            <details key={item.q} className="rounded-lg border bg-white p-4">
              <summary className="cursor-pointer font-medium text-gray-900">
                {item.q}
              </summary>
              <p className="mt-2 text-sm text-gray-600">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}