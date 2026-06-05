import Link from "next/link";

const features = [
  {
    icon: "📁",
    title: "File upload & versioning",
    desc: "Drag-and-drop files into projects. Every upload creates a new version — never lose track of the latest file.",
  },
  {
    icon: "💬",
    title: "Pin comments on files",
    desc: "Leave feedback directly on images and PDFs. Pin comments to specific areas for crystal-clear revision notes.",
  },
  {
    icon: "✅",
    title: "One-click approvals",
    desc: "Approve, reject, or request changes with a single click. Everyone sees the current status instantly.",
  },
  {
    icon: "📊",
    title: "Activity timeline",
    desc: "Every comment, approval, and upload is logged. See exactly what happened and when.",
  },
  {
    icon: "🔗",
    title: "Client portal",
    desc: "Share projects via a magic link. Clients comment and approve without creating an account.",
  },
  {
    icon: "📧",
    title: "Email notifications",
    desc: "Get notified when clients comment or approve. Never miss a review again.",
  },
  {
    icon: "🌍",
    title: "Multi-language",
    desc: "Full English and Russian support. Add more languages easily.",
  },
  {
    icon: "🔒",
    title: "Secure sharing",
    desc: "One-time share tokens with expiration. Your files stay private.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-5xl px-4 text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          Everything you need for client approvals
        </h1>
        <p className="mb-16 text-lg text-gray-600">
          No bloated project management. Just the tools you need to get files approved fast.
        </p>
      </div>

      <div className="mx-auto max-w-5xl px-4">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div className="mb-3 text-2xl">{f.icon}</div>
              <h3 className="mb-2 font-semibold text-gray-900">{f.title}</h3>
              <p className="text-sm leading-relaxed text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 text-center">
        <Link
          href="https://app.approvalinbox.app/signup"
          className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-medium text-white hover:bg-blue-700"
        >
          Start free trial
        </Link>
      </div>
    </div>
  );
}