import { useState, useTransition } from "react";
import { initOpayPayment } from "@/server/actions/opay_payment";
import type { InitPaymentInput } from "@/server/actions/opay_payment";



interface PayButtonProps extends InitPaymentInput {
  label?: string;
}



export function PayButton({ label = "Pay Now", ...paymentData }: PayButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handlePay = () => {
    setError(null);
    startTransition(async () => {
      try {
        const { cashierUrl } = await initOpayPayment({ data: paymentData });
        // Hard navigate to Opay's hosted checkout
        window.location.href = cashierUrl;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Payment initialization failed");
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handlePay}
        disabled={isPending}
        className="flex items-center justify-center gap-2 rounded-lg bg-[#1a8a5a] px-6 py-3 font-semibold text-white transition hover:bg-[#16734b] disabled:cursor-not-allowed disabled:opacity-60"
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

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}