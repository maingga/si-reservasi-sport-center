import PaymentClient from "./PaymentClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PaymentPage({ params }: PageProps) {
  const resolvedParams = await params;
  const reservationId = resolvedParams.id;

  return <PaymentClient reservationId={reservationId} />;
}
