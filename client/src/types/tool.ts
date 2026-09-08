export interface Tool {
  id: string;
  binNo: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  inStock: boolean;
}

export interface CartItem {
  tool: Tool;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  deliveryNotes?: string;
}

export interface VerifiedOrderItem {
  id: string;
  binNo: string;
  name: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface VerifiedOrderReceipt {
  orderRef: string;
  timestamp: string;
  customer: {
    name: string;
    phone: string;
    deliveryNotes?: string;
  };
  items: VerifiedOrderItem[];
  totalAmount: number;
  formattedTotal: string;
  amountInWords?: string;
  whatsappNumber: string;
  whatsappUrl: string;
  whatsappMessage: string;
}
