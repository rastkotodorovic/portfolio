import { ScheduleCallForm } from "@/components/public/schedule/ScheduleCallForm";
import { baseURL, person } from "@/resources";
import { Column, Heading, Meta, Schema, Text } from "@once-ui-system/core";

export async function generateMetadata() {
  return Meta.generate({
    title: `Schedule a call with ${person.name}`,
    description: "Request a call and share the topic you want to discuss.",
    baseURL,
    image: `/api/og/generate?title=${encodeURIComponent("Schedule a call")}`,
    path: "/schedule",
  });
}

export default function SchedulePage() {
  return (
    <Column fillWidth horizontal="center" paddingTop="80" paddingBottom="80">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path="/schedule"
        title={`Schedule a call with ${person.name}`}
        description="Request a call and share the topic you want to discuss."
        image={`/api/og/generate?title=${encodeURIComponent("Schedule a call")}`}
        author={{
          name: person.name,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Column maxWidth="s" fillWidth gap="32" paddingX="24">
        <Column gap="12" horizontal="center" align="center">
          <Text variant="label-strong-m" onBackground="brand-weak">
            Schedule a call
          </Text>
          <Heading variant="display-strong-l" align="center" wrap="balance">
            Pick a time and share the topic.
          </Heading>
          <Text variant="body-default-l" onBackground="neutral-weak" align="center" wrap="balance">
            Send a request with your preferred slot. I will review it and confirm the calendar
            invite from the admin panel.
          </Text>
        </Column>

        <Column fillWidth padding="xl" radius="l" background="surface" border="neutral-alpha-weak">
          <ScheduleCallForm />
        </Column>
      </Column>
    </Column>
  );
}
