"use client";

import {
  Check,
  CreditCard,
  Image as ImageIcon,
  ShieldAlert,
  Store,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MerchantKycDialog({
  open,
  onOpenChange,
  merchant,
  onAction,
}) {
  if (!merchant) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white p-6 rounded-2xl border border-slate-200 text-left shadow-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1 pb-3 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#e85d04]" />
              Merchant KYC Audit: {merchant.businessName}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-500 font-medium">
            Verify submitted statutory documents, PAN, GSTIN &amp; settlement
            bank details
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="legal" className="w-full text-xs pt-2 space-y-4">
          <TabsList className="grid grid-cols-3 bg-slate-100 p-1 rounded-xl">
            <TabsTrigger
              value="legal"
              className="text-xs font-bold rounded-lg py-1.5 flex items-center gap-1"
            >
              <Store className="w-3.5 h-3.5" /> Legal &amp; KYC
            </TabsTrigger>
            <TabsTrigger
              value="bank"
              className="text-xs font-bold rounded-lg py-1.5 flex items-center gap-1"
            >
              <CreditCard className="w-3.5 h-3.5" /> Settlement Bank
            </TabsTrigger>
            <TabsTrigger
              value="visuals"
              className="text-xs font-bold rounded-lg py-1.5 flex items-center gap-1"
            >
              <ImageIcon className="w-3.5 h-3.5" /> Store Media
            </TabsTrigger>
          </TabsList>

          <TabsContent value="legal" className="space-y-4">
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Legal Entity Name
                </span>
                <span className="font-bold text-slate-900">
                  {merchant.businessName}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Constitution Type
                </span>
                <span className="font-bold text-slate-900 uppercase">
                  {merchant.constitution || "Proprietorship"}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Permanent Account Number (PAN)
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {merchant.pan || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  GSTIN Registration
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {merchant.isGstExempt
                    ? "Exempt Micro-Merchant"
                    : merchant.gstin || "N/A"}
                </span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bank" className="space-y-4">
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Account Holder Name
                </span>
                <span className="font-bold text-slate-900">
                  {merchant.bankDetails?.holderName || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Account Typology
                </span>
                <span className="font-bold text-slate-900 uppercase">
                  {merchant.bankDetails?.accountType || "Current"}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Core Account Serial Number
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {merchant.bankDetails?.accountNumber || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Bank IFSC Code
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {merchant.bankDetails?.ifsc || "N/A"}
                </span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="visuals" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                  Shop Front Photograph
                </span>
                {merchant.shopImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={merchant.shopImage}
                    alt="Shop Front"
                    className="h-32 mx-auto object-contain rounded-lg"
                  />
                ) : (
                  <span className="text-xs text-slate-400">
                    No shop photo uploaded
                  </span>
                )}
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                  Store Logo
                </span>
                {merchant.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={merchant.logo}
                    alt="Logo"
                    className="h-32 mx-auto object-contain rounded-lg"
                  />
                ) : (
                  <span className="text-xs text-slate-400">
                    No logo uploaded
                  </span>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={() => onAction(merchant._id, "reject")}
            className="bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200 text-xs font-bold rounded-xl cursor-pointer shadow-none gap-1.5"
          >
            <X className="w-4 h-4" /> Reject Application
          </Button>

          <Button
            onClick={() => onAction(merchant._id, "approve")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-none gap-1.5"
          >
            <Check className="w-4 h-4" /> Approve &amp; Activate Account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
