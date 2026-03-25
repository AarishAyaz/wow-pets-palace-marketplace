import { useCart } from "@/context/CartContext";

export default function CheckoutPage(){
    const {cart, getTotalPrice} = useCart();
    
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>
            <div className="space-y-4">
                {cart.map((item)=>(
                    <div key={item.id} className="flex justify-between border p-4 rounded">
                        <div>
                            <p className="font-semibold">{item.name}</p>
                            <p>Qty: {item.quantity}</p>
                        </div>
                        <p>${item.price * item.quantity}</p>
                    </div>
                ))}
            </div>
            <div className="mt-6 text-right">
                <h2 className="text-xl font-bold">Total: ${getTotalPrice()}</h2>
                <button className="mt-4 bg-black text-white px-6 py-2 rounded">
                    Place Order
                </button>
            </div>
        </div>
    )
}