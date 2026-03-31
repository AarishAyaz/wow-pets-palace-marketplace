import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const { cart, getTotalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-6">
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground">
          Add items to your cart to proceed to checkout.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 flex flex-col lg:flex-row gap-6">
      {/* Items */}
      <div className="flex-1 space-y-4">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex justify-between border p-4 rounded-lg hover:shadow-sm transition-shadow"
          >
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-muted-foreground">
                Qty: {item.quantity} x ${item.price.toFixed(2)}
              </p>
            </div>
            <p className="font-semibold">
              ${ (item.price * item.quantity).toFixed(2) }
            </p>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="lg:w-1/3 bg-white border rounded-lg shadow-md p-6 flex flex-col gap-4 sticky top-6">
        <h2 className="text-xl font-bold">Order Summary</h2>
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>$ {getTotalPrice().toFixed(2)}</span>
        </div>
        {/* Placeholder for taxes/shipping */}
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>$ 0.00</span>
        </div>
        <div className="border-t my-2"></div>
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>$ {getTotalPrice().toFixed(2)}</span>
        </div>
        <Button className="mt-4 w-full bg-primary text-white hover:bg-primary/90">
          Place Order
        </Button>
      </div>
    </div>
  );
}