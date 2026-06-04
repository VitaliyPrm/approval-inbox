import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface ApprovalNotificationEmailProps {
  projectName: string;
  fileName: string;
  reviewerName: string;
  status: "approved" | "rejected" | "changes_requested";
  projectUrl: string;
}

const statusLabels = {
  approved: { emoji: "✅", label: "Approved" },
  rejected: { emoji: "❌", label: "Rejected" },
  changes_requested: { emoji: "🔄", label: "Changes requested" },
} as const;

export function ApprovalNotificationEmail({
  projectName,
  fileName,
  reviewerName,
  status,
  projectUrl,
}: ApprovalNotificationEmailProps) {
  const s = statusLabels[status];

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-10 max-w-sm rounded-lg border border-gray-200 p-6">
            <Heading className="text-xl font-bold text-gray-900">
              {s.emoji} {s.label}
            </Heading>
            <Text className="mt-2 text-sm text-gray-600">
              <strong>{reviewerName}</strong> {status === "approved" ? "approved" : status === "rejected" ? "rejected" : "requested changes on"} <strong>{fileName}</strong> in <strong>{projectName}</strong>.
            </Text>
            <Section className="my-6 text-center">
              <Button
                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white"
                href={projectUrl}
              >
                View in project
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}