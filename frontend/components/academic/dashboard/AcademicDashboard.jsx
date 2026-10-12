"use client";
import React, { useEffect, useState } from "react";
import { academicDashboardApi } from "@/services/api/academicDashboardApi";
import AcademicLayout from "./layout/AcademicLayout";
import AcademicTopbar from "./layout/AcademicTopbar";
import AcademicSidebar from "./layout/AcademicSidebar";
import ClassesSectionsCard from "./overview/ClassesSectionsCard";
import SubjectsCard from "./overview/SubjectsCard";
import CurriculumProgressCard from "./overview/CurriculumProgressCard";
import LessonPlanningPanel from "./lessonPlanning/LessonPlanningPanel";
import StudyMaterialSummary from "./materials/StudyMaterialSummary";
import HomeworkStatusPanel from "./homework/HomeworkStatusPanel";
import RecentAcademicActivities from "./activities/RecentAcademicActivities";
import AcademicPerformancePanel from "./insights/AcademicPerformancePanel";
import QuickActionsPanel from "./quickActions/QuickActionsPanel";
import AcademicAnalyticsChart from "./analytics/AcademicAnalyticsChart";
import InsightsSummaryCard from "./analytics/InsightsSummaryCard";

export default function AcademicDashboard() {
  const [overview, setOverview] = useState(null);
  const [curriculum, setCurriculum] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [homework, setHomework] = useState(null);
  const [materials, setMaterials] = useState(null);
  const [activities, setActivities] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [o, c, l, h, m, act, ins] = await Promise.all([
        academicDashboardApi.fetchAcademicOverview(),
        academicDashboardApi.fetchCurriculumProgress(),
        academicDashboardApi.fetchLessonPlanningStats(),
        academicDashboardApi.fetchHomeworkStatus(),
        academicDashboardApi.fetchStudyMaterialSummary(),
        academicDashboardApi.fetchAcademicActivities(),
        academicDashboardApi.fetchPerformanceInsights(),
      ]);
      setOverview(o || {});
      setCurriculum(c || {});
      setLesson(l || {});
      setHomework(h || {});
      setMaterials(m || {});
      setActivities(Array.isArray(act) ? act : []);
      setInsights(ins || {});
    } catch (e) {
      setError(e?.message || "Failed to load academic dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <AcademicLayout>
      <AcademicTopbar onRefresh={load} loading={loading} />

      <div className="grid grid-cols-1 xl:grid-cols-[240px_minmax(0,1fr)] gap-4">
        <AcademicSidebar />
        <div className="space-y-4">
          {error ? (
            <div className="rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-600">{error}</div>
          ) : null}

          {loading ? (
            <div className="p-10 text-center animate-pulse text-primary">Loading academic dashboard...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ClassesSectionsCard overview={overview} />
                <SubjectsCard overview={overview} />
                <CurriculumProgressCard curriculum={curriculum} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <LessonPlanningPanel data={lesson} />
                <StudyMaterialSummary data={materials} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <HomeworkStatusPanel homework={homework} />
                <RecentAcademicActivities items={activities} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <AcademicPerformancePanel insights={insights} />
                <InsightsSummaryCard insights={insights} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <AcademicAnalyticsChart curriculum={curriculum} homework={homework} lesson={lesson} />
                <QuickActionsPanel />
              </div>
            </>
          )}
        </div>
      </div>
    </AcademicLayout>
  );
}
