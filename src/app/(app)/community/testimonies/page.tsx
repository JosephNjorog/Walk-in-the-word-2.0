import { redirect } from "next/navigation";

// Testimonies now live as a tab on the Prayer Wall screen.
export default function TestimoniesRedirect() {
  redirect("/community/prayer?tab=testimony");
}
