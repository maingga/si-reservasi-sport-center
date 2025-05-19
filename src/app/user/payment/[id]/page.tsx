// src/app/user/payment/[id]/page.tsx
import PaymentClient from "./PaymentClient";

interface PageProps {
  params: { id: string };
}

export default function PaymentPage({ params }: PageProps) {
  const reservationId = params.id;
  return <PaymentClient reservationId={reservationId} />;
}
