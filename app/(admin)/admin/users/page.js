"use client";

import { Ban, Download, RefreshCw, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  adminExportSubscribers,
  adminFetchUsers,
  adminToggleUserStatus,
} from "@/lib/api-helpers";

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminFetchUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleStatus = async (authId, isActive) => {
    try {
      await adminToggleUserStatus(authId, isActive);
      setUsers((prev) =>
        prev.map((u) =>
          u.authId === authId ? { ...u, isActive: !isActive } : u,
        ),
      );
    } catch (err) {
      console.error("Error toggling user status:", err);
    }
  };

  const handleNewsletterExport = async () => {
    try {
      setExporting(true);
      const subs = await adminExportSubscribers();
      if (subs.length === 0) {
        alert("No subscribers found to export.");
        return;
      }

      // Build CSV string
      const headers = ["Name", "Email", "Date Joined"];
      const rows = subs.map((sub) => {
        const name = (sub.name || "User").replace(/"/g, '""');
        const email = sub.email || "";
        const date = sub.createdAt
          ? new Date(sub.createdAt).toLocaleDateString()
          : "—";
        return `"${name}","${email}","${date}"`;
      });

      const csvContent = `\uFEFF${[headers.join(","), ...rows].join("\n")}`;
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `vouchiqo_newsletter_subscribers_${new Date().toISOString().split("T")[0]}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error exporting newsletter subscribers:", err);
      alert("Error generating subscriber export CSV.");
    } finally {
      setExporting(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      (u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <DashboardLayout
      title="User Management"
      user={{ name: "Platform Admin", role: "admin" }}
    >
      <div className="space-y-4 text-left font-sans w-full pb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-3">
          <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
            Platform User Profiles
          </h2>

          <div className="flex gap-2 w-full sm:w-auto">
            <InputGroup className="bg-white border border-slate-200 rounded-lg h-8 px-1 w-full sm:w-60 shadow-2xs flex-grow sm:flex-grow-0">
              <InputGroupAddon>
                <Search className="w-3.5 h-3.5 text-slate-400" />
              </InputGroupAddon>
              <InputGroupInput
                type="text"
                placeholder="Search user name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs placeholder-slate-400 h-full font-normal"
              />
            </InputGroup>

            <Button
              onClick={handleNewsletterExport}
              disabled={exporting}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 px-3 flex items-center gap-1.5 font-medium rounded-lg cursor-pointer border-0 shadow-2xs"
            >
              {exporting ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>Export Newsletter CSV</span>
            </Button>
          </div>
        </div>

        <Card className="border-slate-200/80 shadow-2xs rounded-xl bg-white overflow-hidden text-left p-0">
          <Table className="w-full text-xs">
            <TableHeader className="bg-slate-50/80 border-b border-slate-100">
              <TableRow>
                <TableHead className="p-3 text-slate-500 font-medium uppercase tracking-wider text-[11px] h-auto">
                  User Details
                </TableHead>
                <TableHead className="p-3 text-slate-500 font-medium uppercase tracking-wider text-[11px] h-auto">
                  Email
                </TableHead>
                <TableHead className="p-3 text-slate-500 font-medium uppercase tracking-wider text-[11px] h-auto">
                  Registered Date
                </TableHead>
                <TableHead className="p-3 text-slate-500 font-medium uppercase tracking-wider text-[11px] h-auto">
                  Role
                </TableHead>
                <TableHead className="p-3 text-slate-500 font-medium uppercase tracking-wider text-[11px] h-auto">
                  Newsletter
                </TableHead>
                <TableHead className="p-3 text-slate-500 font-medium uppercase tracking-wider text-[11px] h-auto">
                  Status
                </TableHead>
                <TableHead className="p-3 text-slate-500 font-medium uppercase tracking-wider text-[11px] text-right h-auto">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 font-normal text-slate-700">
              {loading ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={7}
                    className="p-8 text-center text-slate-400 font-medium h-auto"
                  >
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-600" />
                    <span>Loading registered users...</span>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={7}
                    className="p-8 text-center text-slate-400 font-normal h-auto"
                  >
                    No users found matching search query.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((u, idx) => (
                  <TableRow
                    key={u.authId || idx}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <TableCell className="p-3 flex flex-col h-auto">
                      <span className="font-semibold text-slate-900">
                        {u.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {u.email}
                      </span>
                    </TableCell>
                    <TableCell className="p-3 font-mono text-slate-600 text-xs">
                      {u.email}
                    </TableCell>
                    <TableCell className="p-3 text-slate-500 font-normal text-xs">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </TableCell>
                    <TableCell className="p-3 capitalize">
                      <span className="text-slate-700 font-medium uppercase text-[10px]">
                        {u.role}
                      </span>
                    </TableCell>
                    <TableCell className="p-3">
                      {u.role === "customer" ? (
                        <Badge
                          variant="outline"
                          className={`rounded font-medium text-[9px] px-1.5 py-0.5 border ${
                            u.emailNotifications !== false
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-slate-50 text-slate-500 border-slate-200"
                          }`}
                        >
                          {u.emailNotifications !== false
                            ? "Subscribed"
                            : "Unsubscribed"}
                        </Badge>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="p-3">
                      <Badge
                        className={`rounded-full text-[9px] font-medium py-0.5 px-2 border-0 shadow-none ${
                          u.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {u.isActive ? "Active" : "Suspended"}
                      </Badge>
                    </TableCell>
                    <TableCell className="p-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(u.authId, u.isActive)}
                        className={`text-xs py-1 px-3 font-medium flex items-center gap-1.5 justify-center ml-auto h-7 cursor-pointer rounded-md ${
                          u.isActive
                            ? "border-rose-200 text-rose-700 hover:bg-rose-50"
                            : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        }`}
                      >
                        {u.isActive ? (
                          <Ban className="w-3.5 h-3.5" />
                        ) : (
                          <RefreshCw className="w-3.5 h-3.5" />
                        )}
                        <span>{u.isActive ? "Suspend" : "Activate"}</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
}
