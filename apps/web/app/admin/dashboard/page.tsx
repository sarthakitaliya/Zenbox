"use client";

import AdminGuard from "@/components/admin/AdminGuard";
import {
  apiAdmin,
  type AdminOverviewStatsResponse,
  type AdminUserListItem,
} from "@repo/api-client/apis";
import { apiFeedback, type AdminFeedbackItem } from "@repo/api-client/apis";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminOverviewStatsResponse | null>(null);
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [feedbackItems, setFeedbackItems] = useState<AdminFeedbackItem[]>([]);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<AdminFeedbackItem | null>(null);
  const [pendingDeleteUser, setPendingDeleteUser] = useState<AdminUserListItem | null>(
    null
  );

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, usersData, feedbackData] = await Promise.all([
        apiAdmin.getAdminOverviewStats(),
        apiAdmin.getAdminUsers({ limit: 20 }),
        apiFeedback.getAdminFeedback({ limit: 20 }),
      ]);
      setStats(statsData);
      setUsers(usersData.users);
      setFeedbackItems(feedbackData.items || []);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load admin dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleConfirmDeleteUser = async () => {
    if (!pendingDeleteUser) return;
    try {
      setDeletingUserId(pendingDeleteUser.id);
      const response = await apiAdmin.deleteUserByAdmin(pendingDeleteUser.id);
      toast.success(response.message || "User deleted successfully");
      setPendingDeleteUser(null);
      await fetchDashboardData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete user");
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleLogout = async () => {
    try {
      await apiAdmin.logoutAdmin();
      toast.success("Logged out");
      router.replace("/admin/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Logout failed");
    }
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#111112] text-white px-4 py-8 md:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">Admin Dashboard</h1>
              <p className="text-sm text-gray-400 mt-1">Operational overview for Zenbox</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-[#34343a] bg-[#1A1A1D] px-4 py-2 text-sm hover:bg-[#222226] cursor-pointer"
            >
              Logout
            </button>
          </div>

          {loading ? (
            <div className="rounded-xl border border-[#2A2A2E] bg-[#171718] p-6 text-sm text-gray-300">
              Loading stats...
            </div>
          ) : stats ? (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Total Users" value={stats.totals.users} />
                <StatCard label="Custom Categories" value={stats.totals.customCategories} />
                <StatCard label="Categorized Mails" value={stats.totals.categorizedMails} />
                <StatCard
                  label="Avg Categories / User"
                  value={
                    stats.totals.users > 0
                      ? Number(
                          (stats.totals.customCategories / stats.totals.users).toFixed(2)
                        )
                      : 0
                  }
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2 mt-4">
                <StatCard label="Active Users (7d)" value={stats.activity.activeUsers7d} />
                <StatCard label="New Users (7d)" value={stats.activity.newUsersLast7d} />
              </div>

              <section className="mt-6 rounded-xl border border-[#2A2A2E] bg-[#171718] p-4 md:p-5">
                <h2 className="text-lg font-medium mb-3">Recent Signups</h2>
                {users.length === 0 ? (
                  <p className="text-sm text-gray-400">No signups yet.</p>
                ) : (
                  <div className="overflow-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-gray-400 border-b border-[#2A2A2E]">
                          <th className="text-left py-2 pr-3">Name</th>
                          <th className="text-left py-2 pr-3">Email</th>
                          <th className="text-left py-2 pr-3">Created At</th>
                          <th className="text-left py-2 pr-3">Last Active</th>
                          <th className="text-left py-2">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user: AdminUserListItem) => (
                          <tr key={user.id} className="border-b border-[#212124]">
                            <td className="py-2 pr-3">{user.name || "-"}</td>
                            <td className="py-2 pr-3">{user.email}</td>
                            <td className="py-2 pr-3 text-gray-300">
                              {new Date(user.createdAt).toLocaleString()}
                            </td>
                            <td className="py-2 pr-3 text-gray-300">
                              {user.lastActiveAt
                                ? new Date(user.lastActiveAt).toLocaleString()
                                : "-"}
                            </td>
                            <td className="py-2">
                              <button
                                type="button"
                                onClick={() => setPendingDeleteUser(user)}
                                disabled={deletingUserId === user.id}
                                className="rounded-md border border-red-500/50 bg-red-500/10 px-2.5 py-1 text-xs text-red-300 hover:bg-red-500/20 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                              >
                                {deletingUserId === user.id ? "Deleting..." : "Delete"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              <section className="mt-6 rounded-xl border border-[#2A2A2E] bg-[#171718] p-4 md:p-5">
                <h2 className="text-lg font-medium mb-3">Recent Feedback</h2>
                {feedbackItems.length === 0 ? (
                  <p className="text-sm text-gray-400">No feedback submitted yet.</p>
                ) : (
                  <div className="overflow-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-gray-400 border-b border-[#2A2A2E]">
                          <th className="text-left py-2 pr-3">Submitted At</th>
                          <th className="text-left py-2 pr-3">From</th>
                          <th className="text-left py-2 pr-3">Rating</th>
                          <th className="text-left py-2 pr-3">Message</th>
                          <th className="text-left py-2">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {feedbackItems.map((item) => {
                          const fromName = item.name || item.user?.name || "Anonymous";
                          const fromEmail = item.email || item.user?.email || "-";
                          return (
                            <tr key={item.id} className="border-b border-[#212124]">
                              <td className="py-2 pr-3 text-gray-300 whitespace-nowrap">
                                {new Date(item.createdAt).toLocaleString()}
                              </td>
                              <td className="py-2 pr-3">
                                <p className="text-gray-100">{fromName}</p>
                                <p className="text-xs text-gray-400">{fromEmail}</p>
                              </td>
                              <td className="py-2 pr-3 text-gray-300">
                                {item.rating ?? "-"}
                              </td>
                              <td className="py-2 text-gray-300">
                                <p className="max-w-[420px] truncate" title={item.message}>
                                  {item.message}
                                </p>
                              </td>
                              <td className="py-2">
                                <button
                                  type="button"
                                  onClick={() => setSelectedFeedback(item)}
                                  className="rounded-md border border-[#3a3a40] bg-[#222226] px-2.5 py-1 text-xs text-gray-200 hover:bg-[#2b2b30] cursor-pointer"
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </>
          ) : (
            <div className="rounded-xl border border-[#2A2A2E] bg-[#171718] p-6 text-sm text-gray-300">
              Unable to load stats.
            </div>
          )}
        </div>
      </div>
      {pendingDeleteUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-xl border border-[#2A2A2E] bg-[#171718] p-5 shadow-xl">
            <h3 className="text-lg font-semibold text-white">Delete User</h3>
            <p className="mt-2 text-sm text-gray-300">
              This will permanently delete{" "}
              <span className="font-medium text-white">
                {pendingDeleteUser.email}
              </span>
              {" "}and related data. This action cannot be undone.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingDeleteUser(null)}
                disabled={deletingUserId === pendingDeleteUser.id}
                className="rounded-md border border-[#3a3a40] bg-[#222226] px-3 py-1.5 text-sm text-gray-200 hover:bg-[#2b2b30] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteUser}
                disabled={deletingUserId === pendingDeleteUser.id}
                className="rounded-md border border-red-500/60 bg-red-500/20 px-3 py-1.5 text-sm text-red-200 hover:bg-red-500/30 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {deletingUserId === pendingDeleteUser.id ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}
      {selectedFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-2xl rounded-xl border border-[#2A2A2E] bg-[#171718] p-5 shadow-xl">
            <h3 className="text-lg font-semibold text-white">Feedback Details</h3>
            <div className="mt-3 space-y-2 text-sm text-gray-300">
              <p>
                <span className="text-gray-500">Submitted At:</span>{" "}
                {new Date(selectedFeedback.createdAt).toLocaleString()}
              </p>
              <p>
                <span className="text-gray-500">From:</span>{" "}
                {selectedFeedback.name || selectedFeedback.user?.name || "Anonymous"} (
                {selectedFeedback.email || selectedFeedback.user?.email || "-"})
              </p>
              <p>
                <span className="text-gray-500">Rating:</span> {selectedFeedback.rating}/5
              </p>
            </div>
            <div className="mt-4 rounded-lg border border-[#2f2f35] bg-[#141416] p-3">
              <p className="whitespace-pre-wrap text-sm text-gray-200">
                {selectedFeedback.message}
              </p>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedFeedback(null)}
                className="rounded-md border border-[#3a3a40] bg-[#222226] px-3 py-1.5 text-sm text-gray-200 hover:bg-[#2b2b30] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminGuard>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-[#2A2A2E] bg-[#171718] p-4">
      <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-semibold mt-2">{value}</p>
    </div>
  );
}
