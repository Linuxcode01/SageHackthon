/**
 * TeacherNotifications.jsx — Full notifications screen.
 */
import DashboardLayout from "../../components/DashboardLayout";
import NotificationPanel from "../../components/NotificationPanel";
import { NOTIFICATIONS } from "../../data/mockData";

export default function TeacherNotifications() {
  return (
    <DashboardLayout title="Notifications" subtitle="Stay updated with alerts">
      <div className="max-w-2xl">
        <NotificationPanel notifications={NOTIFICATIONS} />
      </div>
    </DashboardLayout>
  );
}
