import { redirect } from "next/navigation";

export default function Home() {
  // !Temporary
  redirect("/login");
  return <></>;
}
