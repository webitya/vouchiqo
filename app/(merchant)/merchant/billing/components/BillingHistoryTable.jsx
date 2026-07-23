"use client";

import { Download, FileText } from "lucide-react";
import { DataTable } from "@/components/shared/data";
import { Button } from "@/components/ui/button";
import { showSuccess } from "@/lib/toast";

/** @type {import("@/components/shared/data/DataTable").Column[]} */
const COLUMNS = [
  {
    key: "id",
    header: "Invoice ID",
    cell: (r) => (
      <span className="font-mono text-[11px] font-bold">{r.id}</span>
    ),
  },
  { key: "period", header: "Billing Period", sortable: true },
  {
    key: "plan",
    header: "Package / Plan",
    cell: (r) => <span className="font-bold">{r.plan}</span>,
  },
  {
    key: "gstInvoice",
    header: "GSTIN Invoice",
    cell: (r) => (
      <span className="font-mono text-[10px] text-brand-subtext">
        {r.gstInvoice}
      </span>
    ),
  },
  {
    key: "amount",
    header: "Amount Paid",
    sortable: true,
    cell: (r) => <span className="font-black">{r.amount}</span>,
  },
  {
    key: "download",
    header: "Download GST PDF",
    cell: (r) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => showSuccess(`Downloading ${r.id} GST Tax Invoice PDF…`)}
        className="text-xs font-bold text-brand-blue hover:text-blue-800 hover:bg-blue-50 rounded-xl cursor-pointer"
      >
        <FileText className="w-3.5 h-3.5 mr-1" /> PDF Invoice
      </Button>
    ),
  },
];

/**
 * BillingHistoryTable — shows invoice history using DataTable.
 * @param {{ invoices: object[] }} props
 */
export default function BillingHistoryTable({ invoices = [] }) {
  return (
    <div className="bg-brand-bg border border-brand-border rounded-2xl shadow-sm overflow-hidden text-left">
      <div className="p-5 border-b border-brand-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-heading text-sm font-bold text-brand-text tracking-tight uppercase">
            Invoice & Billing History (Last 12 Transactions)
          </h3>
          <p className="text-[11px] text-brand-subtext font-medium">
            Download GST tax invoices with 18% GST breakdown
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() =>
            showSuccess("Downloading all 12 GST invoices in a ZIP archive…")
          }
          className="text-xs font-bold rounded-xl border-brand-border flex items-center gap-1.5 cursor-pointer shrink-0 shadow-none"
        >
          <Download className="w-3.5 h-3.5 text-[#e85d04]" />
          Download All Invoices
        </Button>
      </div>
      <div className="p-4">
        <DataTable
          columns={COLUMNS}
          data={invoices}
          searchable={false}
          defaultPageSize={12}
        />
      </div>
    </div>
  );
}
