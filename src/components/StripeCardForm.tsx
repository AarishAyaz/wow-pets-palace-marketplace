import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import {
  Lock,
  CreditCard,
  Calendar,
  ShieldCheck,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";

const STRIPE_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "15px",
      color: "#111827",
      fontFamily: "inherit",
      "::placeholder": { color: "#9ca3af" },
    },
    invalid: { color: "#ef4444" },
  },
};

function FieldWrapper({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        {icon}
        {label}
      </label>
      <div className="border-2 border-gray-200 rounded-xl px-4 py-3 bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all duration-200">
        {children}
      </div>
    </div>
  );
}

export function StripeCardForm({
  clientSecret,
  onSuccess,
  onBack,
}: {
  clientSecret: string;
  onSuccess: (paymentIntent: any) => void;
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const cardNumber = elements.getElement(CardNumberElement);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardNumber! },
    });

    setLoading(false);

    if (result.error) {
      setError(result.error.message || "Payment failed. Please try again.");
      return;
    }

    if (result.paymentIntent?.status === "succeeded") {
      onSuccess(result.paymentIntent);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-5 mt-2">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 text-base">
            Card Details
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Enter your payment information below
          </p>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-1 font-medium">
          <ShieldCheck className="w-3 h-3" />
          SSL Secured
        </div>
      </div>

      {/* Accepted cards */}
      <div className="flex gap-1.5">
        {[
          { label: "VISA", color: "text-blue-700 border-blue-100 bg-blue-50" },
          { label: "MC", color: "text-red-600 border-red-100 bg-red-50" },
          { label: "AMEX", color: "text-indigo-600 border-indigo-100 bg-indigo-50" },
        ].map(({ label, color }) => (
          <span
            key={label}
            className={`px-2 py-0.5 rounded-md border text-[10px] font-bold tracking-widest ${color}`}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Card Number */}
      <FieldWrapper
        label="Card Number"
        icon={<CreditCard className="w-3 h-3" />}
      >
        <CardNumberElement options={STRIPE_ELEMENT_OPTIONS} />
      </FieldWrapper>

      {/* Expiry + CVV */}
      <div className="grid grid-cols-2 gap-3">
        <FieldWrapper
          label="Expiry Date"
          icon={<Calendar className="w-3 h-3" />}
        >
          <CardExpiryElement options={STRIPE_ELEMENT_OPTIONS} />
        </FieldWrapper>

        <FieldWrapper
          label="CVV / CVC"
          icon={<Lock className="w-3 h-3" />}
        >
          <CardCvcElement options={STRIPE_ELEMENT_OPTIONS} />
        </FieldWrapper>
      </div>

      {/* Error */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 flex items-start gap-2">
          <span className="mt-0.5 shrink-0">⚠️</span>
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <button
          onClick={onBack}
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-3 rounded-xl border-2 border-gray-200 text-sm text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-all disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <button
          onClick={handlePay}
          disabled={!stripe || loading}
          className="flex-1 bg-gradient-to-r from-primary to-secondary text-white rounded-xl py-3 flex items-center justify-center gap-2 text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 shadow-md"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </span>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Pay Now
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Footer */}
      <p className="text-[11px] text-muted-foreground text-center flex items-center justify-center gap-1.5 pt-1">
        <Lock className="w-3 h-3" />
        Powered by{" "}
        <span className="font-semibold text-[#635BFF]">Stripe</span>. We never
        store your card details.
      </p>
    </div>
  );
}