import { useState, useTransition } from "react";
import { initPayment } from "@/server/actions/opay_payment";
import type { InitPaymentInput } from "@/server/actions/opay_payment";
import { toast } from "sonner";


interface OpayButtonProps extends InitPaymentInput {
  label?: string;
}



export function OpayButton({ label = "Pay Now", ...paymentData }: OpayButtonProps) {
  const [isPending, startTransition] = useTransition();
  const handlePay = () => {
    setError(null);
    startTransition(async () => {
      try {
        const result = await initPayment({ data: paymentData });
        console.log("initPayment result: ", result)
        // Hard navigate to Opay's hosted checkout
        window.location.href = result.data.cashierUrl;
      }
      catch (err) {
        toast.error(err.message)
        console.log(err)
      }
    });
  };

  return (
    <button
      onClick={handlePay}
      disabled={isPending}
      className="flex items-center w-full justify-center gap-2 rounded-lg bg-[#1a8a5a] px-6 py-3 font-semibold text-white transition hover:bg-[#16734b] disabled:cursor-not-allowed disabled:bg-gray-500"
    >
      {isPending ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Initializing...
        </>
      ) : (
        label
      )}
    </button>
  );
}