import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { queryOpayPaymentStatus } from "@/server/actions/opay_payment";



export const Route = createFileRoute("/payment/opay_success")({
  component: PaymentSuccess,
});



function PaymentSuccess() {
  const { ref } = Route.useSearch<{ ref?: string }>();
  const [status, setStatus] = useState<"checking" | "success" | "pending" | "failed">("checking");

  useEffect(() => {
    if (!ref) { setStatus("failed"); return; }

    queryOpayPaymentStatus({ data: { reference: ref } }).then((res) => {
      const s = res.data?.status?.toUpperCase();
      if (s === "SUCCESS") setStatus("success");
      else if (s === "PENDING") setStatus("pending");
      else setStatus("failed");
    }).catch((e) => {
      setStatus("failed")
      console.log(e)
    });
  }, [ref]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      {status === "checking" && <p className="text-gray-500">Verifying payment...</p>}

      {status === "success" && (
        <>
          <div className="text-5xl">✅</div>
          <h1 className="text-2xl font-bold text-green-600">Payment Successful!</h1>
          <p className="text-gray-500">Reference: <code>{ref}</code></p>
        </>
      )}

      {status === "pending" && (
        <>
          <div className="text-5xl">⏳</div>
          <h1 className="text-2xl font-bold text-yellow-600">Payment Pending</h1>
          <p className="text-gray-500">We'll notify you once confirmed.</p>
        </>
      )}

      {status === "failed" && (
        <>
          <div className="text-5xl">❌</div>
          <h1 className="text-2xl font-bold text-red-600">Payment Failed</h1>
          <p className="text-gray-500">Something went wrong. Please try again.</p>
        </>
      )}
    </div>
  );
}