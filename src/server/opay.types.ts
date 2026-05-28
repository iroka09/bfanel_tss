export interface CreateOrderPayload {
  amount: {
    total: string; // e.g. "5000.00"
    currency: "NGN";
  };
  callbackUrl: string;
  cancelUrl: string;
  country: "NG";
  productList: Array<{
    productId?: string;
    name?: string,
    description?: string,
    price?: number,      // integer
    quantity?: number,
    imageUrl?: string
  }>;
  reference: string;
  returnUrl: string;
  userInfo: {
    userEmail: string;
    userId: string;
    userName: string;
    userMobile: string;
  };
  expireAt: number; // minutes
}

export interface CreateOrderResponse {
  code: string;       // "00000" = success
  message: string;
  data?: {
    cashierUrl: string;  // redirect user here
    reference: string;
    status: string;
  };
}

export interface WebhookPayload {
  amount: { total: string; currency: string };
  country: string;
  reference: string;
  status: "SUCCESS" | "FAIL" | "PENDING" | "CLOSE";
  type: string;
  reason: string;
  orderNo: string;
}