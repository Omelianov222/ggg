import { redirect } from "next/navigation";
export const revalidate = 3600;

export default function RootPage() {
   redirect("/en"); // або en, або те, що треба
}
