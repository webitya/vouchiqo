"use client";

import { Ban, RefreshCw, Search } from "lucide-react";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");

  const [users, setUsers] = useState([
    {
      id: "u1",
      name: "Sarah Jenkins",
      email: "sarah@gmail.com",
      role: "Customer",
      status: "Active",
    },
    {
      id: "u2",
      name: "Zomato Partner",
      email: "partner@zomato.com",
      role: "Merchant",
      status: "Active",
    },
    {
      id: "u3",
      name: "David Miller",
      email: "david@yahoo.com",
      role: "Customer",
      status: "Suspended",
    },
  ]);

  const handleToggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const newStatus = u.status === "Active" ? "Suspended" : "Active";
          return { ...u, status: newStatus };
        }
        return u;
      }),
    );
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <DashboardLayout
      title="User Management"
      user={{ name: "Platform Admin", role: "admin" }}
    >
      <div className="flex justify-between items-center gap-4">
        <InputGroup className="bg-brand-bg border border-brand-border rounded-lg h-10 px-1 w-full sm:w-60 shadow-none">
          <InputGroupAddon>
            <Search className="w-4 h-4 text-brand-subtext" />
          </InputGroupAddon>
          <InputGroupInput
            type="text"
            placeholder="Search user profile/email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs placeholder-brand-subtext h-full"
          />
        </InputGroup>
      </div>

      {/* Table */}
      <div className="bg-brand-bg border border-brand-border rounded-xl shadow-sm overflow-hidden flex flex-col justify-between">
        <div className="overflow-x-auto flex-1">
          <Table className="w-full text-xs">
            <TableHeader className="bg-brand-surface border-b border-brand-border hover:bg-transparent">
              <TableRow className="hover:bg-transparent border-b border-brand-border">
                <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                  User
                </TableHead>
                <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                  Role
                </TableHead>
                <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider h-auto">
                  Status
                </TableHead>
                <TableHead className="p-4 text-brand-subtext font-bold uppercase tracking-wider text-right h-auto">
                  Access Controls
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-brand-border font-semibold text-brand-text">
              {filteredUsers.map((u, idx) => (
                <TableRow
                  key={idx}
                  className="hover:bg-brand-surface/40 transition-colors border-b border-brand-border last:border-b-0"
                >
                  <TableCell className="p-4 flex flex-col h-auto">
                    <span className="font-bold text-brand-navy">{u.name}</span>
                    <span className="text-[10px] text-brand-subtext font-bold mt-0.5">
                      {u.email}
                    </span>
                  </TableCell>
                  <TableCell className="p-4">
                    <span className="text-brand-navy font-bold">{u.role}</span>
                  </TableCell>
                  <TableCell className="p-4">
                    <Badge
                      variant={
                        u.status === "Active" ? "success" : "destructive"
                      }
                      className={`rounded-full text-[10px] font-bold py-0.5 px-2 border-0 shadow-none ${
                        u.status === "Active"
                          ? "bg-brand-success/10 text-brand-success hover:bg-brand-success/10"
                          : "bg-brand-error/10 text-brand-error hover:bg-brand-error/10"
                      }`}
                    >
                      {u.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="p-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(u.id)}
                      className={`text-xs py-1.5 px-4 font-bold flex items-center gap-1.5 justify-center ml-auto h-auto cursor-pointer shadow-none ${
                        u.status === "Active"
                          ? "border-brand-error/30 text-brand-error hover:bg-brand-error/5 hover:text-brand-error"
                          : "border-brand-success/30 text-brand-success hover:bg-brand-success/5 hover:text-brand-success"
                      }`}
                    >
                      {u.status === "Active"
                        ? <Ban className="w-3.5 h-3.5" />
                        : <RefreshCw className="w-3.5 h-3.5" />}
                      <span>
                        {u.status === "Active" ? "Suspend" : "Activate"}
                      </span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}
