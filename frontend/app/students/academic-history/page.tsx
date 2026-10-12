import AcademicHistoryDashboard from "@/components/students/academicHistory/AcademicHistoryDashboard";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const idParam = searchParams?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam || "";
  return <AcademicHistoryDashboard initialStudentId={id} />;
}

