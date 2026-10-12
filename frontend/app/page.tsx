import { redirect } from "next/navigation";

export default function Home() {
  // For the sake of the demo, directly redirect to the dashboard
  redirect("/dashboard");
}
