import { CartCheckoutPage } from "./CheckoutN";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartCheckoutWrapper() {
    const {cart, updateQuantity, removeFromCart} = useCart();
    const navigate = useNavigate();

    const cartItems = cart.map((item)=>({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
        inStock: true,
    }));

    const handleUpdateCart = (updatedItems :typeof cartItems)=>{
        updatedItems.forEach((item)=>{
            updateQuantity(item.id, item.quantity);
        });
        cart.forEach((item)=>{
            const exists = updatedItems.find((i)=> i.id === item.id);
            if(!exists) removeFromCart(item.id);
        });
    }
    return(
        <CartCheckoutPage
        cartItems={cartItems}
        onUpdateCart={handleUpdateCart}
        onNavigateHome={()=> navigate("/")}
        onNavigateToProducts={()=>("/shop")}
        />
    );
}