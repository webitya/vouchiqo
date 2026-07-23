"use client";

import { ArrowRight, Check, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CheckoutModal({
  isOpen,
  onClose,
  checkoutStep,
  setCheckoutStep,
  selectedPlan,
  selectedAddOn,
  billingCycle,
  basePrice,
  gst,
  totalPrice,
  gstin,
  setGstin,
  paymentMethod,
  setPaymentMethod,
  executePayment,
  isPending,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-white border border-slate-200/80 rounded-2xl p-6 text-left font-sans">
        <DialogHeader className="border-b border-slate-100 pb-4">
          <DialogTitle className="font-heading text-base font-bold text-slate-900 uppercase tracking-wider flex justify-between items-center w-full">
            <span>Razorpay Payment Gateway</span>
            <Badge className="bg-blue-100 text-blue-800 font-mono text-[9px] font-bold">
              Step {checkoutStep} of 3
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-medium">
            18% GST tax invoice breakdown &amp; instant sandbox activation.
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Review Plan & GSTIN */}
        {checkoutStep === 1 && (
          <div className="space-y-4 font-semibold text-slate-700">
            <div className="bg-slate-50 p-4 border border-slate-200/80 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Selected Product:</span>
                <span className="font-bold text-slate-900">
                  {selectedPlan
                    ? `${selectedPlan.name} (${billingCycle})`
                    : selectedAddOn?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Base Price:</span>
                <span>₹{basePrice.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">GST (18% Tax):</span>
                <span>₹{gst.toLocaleString("en-IN")}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-slate-900 text-sm">
                <span>Total Payable:</span>
                <span className="text-[#e85d04]">
                  ₹{totalPrice.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Optional GSTIN Input for Invoice Generation */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-800">
                Business GSTIN for Tax Credit (Optional)
              </Label>
              <Input
                type="text"
                placeholder="e.g. 27AABCU9603R1ZM"
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                className="bg-white border-slate-200 text-xs h-10 rounded-xl font-mono uppercase"
              />
            </div>

            <Button
              onClick={() => setCheckoutStep(2)}
              className="bg-slate-900 hover:bg-slate-800 text-white w-full text-xs font-bold py-2.5 h-10 rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Proceed to Razorpay Payment</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Step 2: Razorpay Payment Gateway Selection */}
        {checkoutStep === 2 && (
          <div className="space-y-4 font-semibold text-slate-700">
            {isPending ? (
              <div className="py-8 text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-[#e85d04] mx-auto" />
                <span className="text-xs font-bold text-slate-900 block">
                  Processing Secure Razorpay Transaction...
                </span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-800 uppercase">
                    Select Payment Option
                  </Label>
                  <div className="space-y-2">
                    {[
                      {
                        id: "razorpay_upi",
                        label: "Razorpay UPI (Google Pay, PhonePe, Paytm)",
                      },
                      {
                        id: "razorpay_card",
                        label: "Credit / Debit Card (Visa, Mastercard, RuPay)",
                      },
                      {
                        id: "razorpay_netbanking",
                        label: "Netbanking (HDFC, ICICI, SBI, Axis)",
                      },
                    ].map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                          paymentMethod === opt.id
                            ? "bg-orange-50/60 border-[#e85d04] text-slate-900"
                            : "bg-white border-slate-200 text-slate-700"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payMethod"
                          checked={paymentMethod === opt.id}
                          onChange={() => setPaymentMethod(opt.id)}
                          className="accent-[#e85d04]"
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={executePayment}
                  className="bg-[#e85d04] hover:bg-orange-600 text-white w-full text-xs font-bold py-2.5 h-10 rounded-xl cursor-pointer"
                >
                  Pay ₹{totalPrice.toLocaleString("en-IN")} via Razorpay
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Success Animation Screen */}
        {checkoutStep === 3 && (
          <div className="text-center py-6 space-y-5 font-sans">
            <div className="mx-auto w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center border border-emerald-200">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-heading text-lg font-bold text-slate-900">
                Payment Successful!
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed font-medium">
                {selectedPlan
                  ? `Your subscription has been upgraded to ${selectedPlan.name}. Premium features are unlocked immediately.`
                  : `Your add-on purchase has been confirmed. Resources added successfully.`}
              </p>
            </div>
            <Button
              onClick={onClose}
              className="bg-slate-900 text-white text-xs font-bold py-2.5 px-6 rounded-xl inline-flex items-center justify-center cursor-pointer shadow-xs"
            >
              Return to Billing &amp; Subscription
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
