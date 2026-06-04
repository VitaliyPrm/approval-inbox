import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface MagicLinkEmailProps {
  email: string;
  url: string;
}

export function MagicLinkEmail({ email, url }: MagicLinkEmailProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-10 max-w-sm rounded-lg border border-gray-200 p-6">
            <Heading className="text-xl font-bold text-gray-900">
              Sign in to Approval Inbox
            </Heading>
            <Text className="mt-4 text-sm text-gray-600">
              Click the button below to sign in as <strong>{email}</strong>.
            </Text>
            <Section className="my-6 text-center">
              <Button
                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white"
                href={url}
              >
                Sign in
              </Button>
            </Section>
            <Text className="text-xs text-gray-400">
              If you didn't request this, you can safely ignore this email.
            </Text>
            <Link href={url} className="block break-all text-xs text-gray-400">
              {url}
            </Link>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}