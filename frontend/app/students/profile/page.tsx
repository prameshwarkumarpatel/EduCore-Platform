import StudentProfileDashboard from "@/components/students/profile/StudentProfileDashboard";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const idParam = searchParams?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam || "";
  return <StudentProfileDashboard studentId={id} />;
}

