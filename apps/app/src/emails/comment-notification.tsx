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

interface CommentNotificationEmailProps {
  projectName: string;
  fileName: string;
  commenterName: string;
  commentContent: string;
  commentUrl: string;
}

export function CommentNotificationEmail({
  projectName,
  fileName,
  commenterName,
  commentContent,
  commentUrl,
}: CommentNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-10 max-w-sm rounded-lg border border-gray-200 p-6">
            <Heading className="text-xl font-bold text-gray-900">
              New comment on {projectName}
            </Heading>
            <Text className="mt-2 text-sm text-gray-600">
              <strong>{commenterName}</strong> commented on{" "}
              <strong>{fileName}</strong>:
            </Text>
            <Section className="my-4 rounded-md bg-gray-50 p-4">
              <Text className="text-sm text-gray-700">{commentContent}</Text>
            </Section>
            <Section className="my-6 text-center">
              <Button
                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white"
                href={commentUrl}
              >
                View comment
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}