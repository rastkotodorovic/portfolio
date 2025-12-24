import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Column, Heading, Text, Button, Row, Avatar } from "@once-ui-system/core";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { SignOutButton } from "./SignOutButton";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <Column fillWidth gap="l">
      <Row fillWidth horizontal="between" vertical="center">
        <Heading variant="heading-strong-xl">Admin Dashboard</Heading>
        <Row gap="m" vertical="center">
          {/*{session.user.image && (*/}
          {/*  <Avatar src={session.user.image} size="m" />*/}
          {/*)}*/}
          <Text variant="body-default-m">{session.user.email}</Text>
          <SignOutButton />
        </Row>
      </Row>
      <Text variant="body-default-m" onBackground="neutral-weak">
        Welcome to the admin dashboard.
      </Text>
    </Column>
  );
}
