import { PaymentTabs } from '@/components/collections/payment-tabs';
import { ReceiverTotals } from '@/components/collections/receiver-totals';

export default function TemplePage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-bold text-4xl">Society Temple</h1>
      <PaymentTabs type="temple" />
      <ReceiverTotals type="temple" />
    </div>
  );
}
