import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Truck,
  Shield,
  Tag,
  MapPin,
  Mail,
  Phone,
  User,
  Home,
  ChevronRight,
  Lock,
  Check,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";
import { useEffect } from "react";

interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
  inStock: boolean;
}

interface CartCheckoutPageProps {
  onNavigateHome?: () => void;
  onNavigateToProducts?: () => void;
  cartItems: CartItem[];
  onUpdateCart: (items: CartItem[]) => void;
}

export function CartCheckoutPage({
  onNavigateHome,
  onNavigateToProducts,
  cartItems,
  onUpdateCart,
}: CartCheckoutPageProps) {
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form states
  const [billingDetails, setBillingDetails] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    address: "",
  });

  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    address: "",
    country: "",
  });

  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Related products
  const relatedProducts = [
    {
      id: "101",
      name: "Premium Dog Leash",
      price: 24.99,
      image:
        "https://images.unsplash.com/photo-1596822316110-288c7b8f24f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      rating: 4.6,
    },
    {
      id: "102",
      name: "Pet Grooming Kit",
      price: 34.99,
      image:
        "https://images.unsplash.com/photo-1625279138876-8910c2af9a30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      rating: 4.7,
    },
    {
      id: "103",
      name: "Pet Water Fountain",
      price: 39.99,
      image:
        "https://images.unsplash.com/photo-1747918266318-61b6b9a24a20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      rating: 4.5,
    },
    {
      id: "104",
      name: "Organic Pet Treats",
      price: 16.99,
      image:
        "https://images.unsplash.com/photo-1761660306229-8f99a11ef623?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      rating: 4.8,
    },
  ];

  useEffect(()=>{
if(isInitialized){
  return;
}

    const storedUser = localStorage.getItem("user");

    if(storedUser){
      const parsedUser = JSON.parse(storedUser);
      initializeForm(parsedUser);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const initializeForm = (userData: any) => {
    const fullName = 
    userData.firstName && userData.lastName
    ? `${userData.firstName} ${userData.lastName}`
    : userData.firstName || "";

      // Billing
  const billing = {
    fullName,
    email: userData.billing_email || userData.email || "",
    phone: userData.billing_phone || userData.phoneNumber || "",
    country: userData.billing_country || "",
    address: `${userData.billing_address_1 || ""} ${userData.billing_address_2 || ""}`.trim(),
  };

  // Shipping
 const shipping = {
  fullName:
    userData.shipping_first_name && userData.shipping_last_name
      ? `${userData.shipping_first_name} ${userData.shipping_last_name}`
      : fullName,

  country: userData.shipping_country || userData.billing_country || "",

  address: [
    userData.shipping_address_1,
    userData.shipping_address_2,
  ]
    .filter(Boolean)
    .join(" ") ||
    [
      userData.billing_address_1,
      userData.billing_address_2,
    ]
      .filter(Boolean)
      .join(" "),
};
    setBillingDetails(billing);
    setShippingDetails(shipping)

const isSame =
  billing.address.trim().toLowerCase() ===
    shipping.address.trim().toLowerCase() &&
  billing.country.trim().toLowerCase() ===
    shipping.country.trim().toLowerCase();

    setSameAsBilling(isSame);
  }

  useEffect(()=>{
    if(!sameAsBilling)
      return;
      setShippingDetails({
        fullName: billingDetails.fullName,
        address: billingDetails.address,
        country: billingDetails.country,
  });
    
  }, [ sameAsBilling, billingDetails]);
  // Calculate totals
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shippingCharge = subtotal > 75 ? 0 : 9.99;
  const discountAmount = promoApplied ? subtotal * discount : 0;
  const total = subtotal + shippingCharge - discountAmount;

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const updatedItems = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item,
    );
    onUpdateCart(updatedItems);
  };

  const removeItem = (itemId: string) => {
    const updatedItems = cartItems.filter((item) => item.id !== itemId);
    onUpdateCart(updatedItems);
  };

  const applyPromoCode = () => {
    // Mock promo code validation
    if (promoCode.toUpperCase() === "WOWPETS10") {
      setPromoApplied(true);
      setDiscount(0.1); // 10% discount
    } else if (promoCode.toUpperCase() === "SAVE20") {
      setPromoApplied(true);
      setDiscount(0.2); // 20% discount
    } else {
      alert("Invalid promo code");
    }
  };

  const removePromoCode = () => {
    setPromoApplied(false);
    setDiscount(0);
    setPromoCode("");
  };

  const handleSameAsBilling = (checked: boolean) => {
    setSameAsBilling(checked);
    if(checked){
      setShippingDetails({
        fullName: billingDetails.fullName,
        address: billingDetails.address,
        country: billingDetails.country,
      });
    }
  };

  const handlePlaceOrder = () => {
    // Basic validation
    if (
      !billingDetails.fullName ||
      !billingDetails.email ||
      !billingDetails.phone
    ) {
      alert("Please fill in all required billing details");
      return;
    }

    setIsProcessing(true);
    // Simulate order processing
    setTimeout(() => {
      setIsProcessing(false);
      alert(
        "Order placed successfully! Thank you for shopping at Wow Pets Palace.",
      );
      // Clear cart
      onUpdateCart([]);
      if (onNavigateHome) onNavigateHome();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* <Header onNavigateHome={onNavigateHome} cartItemCount=0 /> */}

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm mb-8">
          <Button
            variant="ghost"
            onClick={onNavigateHome}
            className="text-muted-foreground hover:text-primary"
          >
            Home
          </Button>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground">Cart & Checkout</span>
        </nav>

        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-primary mb-4">Your Cart & Checkout</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Review your items and complete your purchase securely
          </p>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <Card className="max-w-2xl mx-auto rounded-3xl border-0 shadow-xl">
            <CardContent className="p-12 text-center space-y-6">
              <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center">
                <ShoppingCart className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="text-foreground">Your cart is empty</h2>
              <p className="text-muted-foreground">
                Add some amazing pet products to get started!
              </p>
              <Button
                size="lg"
                onClick={onNavigateToProducts}
                className="rounded-full bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 shadow-lg"
              >
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Cart with Items */
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Cart Items & Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Cart Items Section */}

              {/* Billing Details */}
              <Card className="rounded-3xl border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <User className="w-6 h-6 text-primary" />
                    Billing & Shipping Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Billing Details */}
                  <div className="space-y-4">
                    <h3 className="text-foreground flex items-center gap-2">
                      <Home className="w-5 h-5 text-secondary" />
                      Billing Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-foreground">
                          Full Name *
                        </Label>
                        <Input
                          id="fullName"
                          placeholder="John Doe"
                          value={billingDetails.fullName}
                          onChange={(e) =>
                            setBillingDetails({
                              ...billingDetails,
                              fullName: e.target.value,
                            })
                          }
                          className="rounded-xl border-primary/30 focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-foreground">
                          Email Address *
                        </Label>
                        <div className="relative">
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            value={billingDetails.email}
                            onChange={(e) =>
                              setBillingDetails({
                                ...billingDetails,
                                email: e.target.value,
                              })
                            }
                            className="pl-10 rounded-xl border-primary/30 focus:border-primary"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-foreground">
                          Phone Number *
                        </Label>
                        <div className="relative">
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            value={billingDetails.phone}
                            onChange={(e) =>
                              setBillingDetails({
                                ...billingDetails,
                                phone: e.target.value,
                              })
                            }
                            className="pl-10 rounded-xl border-primary/30 focus:border-primary"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country" className="text-foreground">
                          Country *
                        </Label>
                        <div className="relative">
                          <Input
                            id="country"
                            placeholder="United States"
                            value={billingDetails.country}
                            onChange={(e) =>
                              setBillingDetails({
                                ...billingDetails,
                                country: e.target.value,
                              })
                            }
                            className="pl-10 rounded-xl border-primary/30 focus:border-primary"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="billingAddress"
                        className="text-foreground"
                      >
                        Billing Address *
                      </Label>
                      <textarea
                        id="billingAddress"
                        rows={3}
                        placeholder="Enter your complete billing address..."
                        value={billingDetails.address}
                        onChange={(e) =>
                          setBillingDetails({
                            ...billingDetails,
                            address: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl border-2 border-primary/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background resize-none"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Shipping Details */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-foreground flex items-center gap-2">
                        <Truck className="w-5 h-5 text-secondary" />
                        Shipping Information
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="sameAsBilling"
                          checked={sameAsBilling}
                          onCheckedChange={(checked) =>
                            handleSameAsBilling(checked as boolean)
                          }
                        />
                        <Label
                          htmlFor="sameAsBilling"
                          className="text-sm text-muted-foreground cursor-pointer"
                        >
                          Same as billing
                        </Label>
                      </div>
                    </div>

                    {!sameAsBilling && (
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="shippingName"
                            className="text-foreground"
                          >
                            Full Name
                          </Label>
                          <Input
                            id="shippingName"
                            placeholder="John Doe"
                            value={shippingDetails.fullName}
                            onChange={(e) =>
                              setShippingDetails({
                                ...shippingDetails,
                                fullName: e.target.value,
                              })
                            }
                            className="rounded-xl border-primary/30 focus:border-primary"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="shippingCountry"
                            className="text-foreground"
                          >
                            Country
                          </Label>
                          <Input
                            id="shippingCountry"
                            placeholder="United States"
                            value={shippingDetails.country}
                            onChange={(e) =>
                              setShippingDetails({
                                ...shippingDetails,
                                country: e.target.value,
                              })
                            }
                            className="rounded-xl border-primary/30 focus:border-primary"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <Label
                            htmlFor="shippingAddress"
                            className="text-foreground"
                          >
                            Shipping Address
                          </Label>
                          <textarea
                            id="shippingAddress"
                            rows={3}
                            placeholder="Enter shipping address..."
                            value={shippingDetails.address}
                            onChange={(e) =>
                              setShippingDetails({
                                ...shippingDetails,
                                address: e.target.value,
                              })
                            }
                        className="w-full px-4 py-3 rounded-xl border-2 border-primary/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background resize-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="rounded-3xl border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-primary" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                  >
                    <div className="space-y-3">
                      {/* Credit/Debit Card */}
                      <div
                        className={`flex items-center space-x-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                          paymentMethod === "card"
                            ? "border-secondary bg-secondary/5"
                            : "border-muted hover:border-primary/30"
                        }`}
                        onClick={() => setPaymentMethod("card")}
                      >
                        <RadioGroupItem value="card" id="card" />
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <Label htmlFor="card" className="cursor-pointer">
                              Credit / Debit Card
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Pay securely with your card
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Card Details - Show when card is selected */}
                      {paymentMethod === "card" && (
                        <div className="ml-4 pl-4 border-l-2 border-secondary space-y-4 py-4">
                          <div className="space-y-2">
                            <Label
                              htmlFor="cardNumber"
                              className="text-foreground"
                            >
                              Card Number
                            </Label>
                            <Input
                              id="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              value={cardDetails.cardNumber}
                              onChange={(e) =>
                                setCardDetails({
                                  ...cardDetails,
                                  cardNumber: e.target.value,
                                })
                              }
                              className="rounded-xl border-primary/30 focus:border-primary"
                              maxLength={19}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label
                                htmlFor="expiry"
                                className="text-foreground"
                              >
                                Expiry Date
                              </Label>
                              <Input
                                id="expiry"
                                placeholder="MM/YY"
                                value={cardDetails.expiry}
                                onChange={(e) =>
                                  setCardDetails({
                                    ...cardDetails,
                                    expiry: e.target.value,
                                  })
                                }
                                className="rounded-xl border-primary/30 focus:border-primary"
                                maxLength={5}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cvv" className="text-foreground">
                                CVV
                              </Label>
                              <Input
                                id="cvv"
                                placeholder="123"
                                type="password"
                                value={cardDetails.cvv}
                                onChange={(e) =>
                                  setCardDetails({
                                    ...cardDetails,
                                    cvv: e.target.value,
                                  })
                                }
                                className="rounded-xl border-primary/30 focus:border-primary"
                                maxLength={4}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* PayPal */}
                      <div
                        className={`flex items-center space-x-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                          paymentMethod === "paypal"
                            ? "border-secondary bg-secondary/5"
                            : "border-muted hover:border-primary/30"
                        }`}
                        onClick={() => setPaymentMethod("paypal")}
                      >
                        <RadioGroupItem value="paypal" id="paypal" />
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-lg">
                              P
                            </span>
                          </div>
                          <div>
                            <Label htmlFor="paypal" className="cursor-pointer">
                              PayPal
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Pay with your PayPal account
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Cash on Delivery */}
                      <div
                        className={`flex items-center space-x-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                          paymentMethod === "cod"
                            ? "border-secondary bg-secondary/5"
                            : "border-muted hover:border-primary/30"
                        }`}
                        onClick={() => setPaymentMethod("cod")}
                      >
                        <RadioGroupItem value="cod" id="cod" />
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                            <span className="text-2xl">💵</span>
                          </div>
                          <div>
                            <Label htmlFor="cod" className="cursor-pointer">
                              Cash on Delivery
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Pay when you receive your order
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Security Badge */}
              <Card className="rounded-3xl border-0 shadow-lg bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md">
                      <Lock className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-foreground flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        Secure Checkout
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Your payment information is encrypted and secure. We
                        never store your card details.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary (Sticky) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <Card className="rounded-3xl border-0 shadow-xl ">
                  <CardHeader>
                    <CardTitle>Your Items</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded object-cover"
                        />

                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ${item.price} × {item.quantity}
                          </p>
                        </div>

                        <p className="text-sm font-semibold text-primary">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>

                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <Minus className="w-3 h-3" />
                          </Button>

                          <span>{item.quantity}</span>

                          <Button
                            size="icon"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus />
                          </Button>
                        </div>

                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card className="rounded-3xl border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-foreground">
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Promo Code */}
                    <div className="space-y-3">
                      <Label className="text-foreground flex items-center gap-2">
                        <Tag className="w-4 h-4 text-secondary" />
                        Have a promo code?
                      </Label>
                      {!promoApplied ? (
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter code"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            className="rounded-xl border-primary/30 focus:border-primary"
                          />
                          <Button
                            onClick={applyPromoCode}
                            className="rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                          >
                            Apply
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-200">
                          <div className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-green-600" />
                            <span className="text-sm text-green-700">
                              {promoCode.toUpperCase()} Applied
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={removePromoCode}
                            className="h-6 w-6 rounded-full text-green-700 hover:text-green-900 hover:bg-green-100"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Price Breakdown */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span className="flex items-center gap-2">
                          Shipping
                          {subtotal > 75 && (
                            <Badge
                              variant="outline"
                              className="text-xs border-green-600 text-green-600"
                            >
                              FREE
                            </Badge>
                          )}
                        </span>
                        <span>
                          {shippingCharge === 0
                            ? "FREE"
                            : `$${shippingCharge.toFixed(2)}`}
                        </span>
                      </div>
                      {subtotal <= 75 && (
                        <p className="text-xs text-muted-foreground">
                          Add ${(75 - subtotal).toFixed(2)} more for free
                          shipping!
                        </p>
                      )}
                      {promoApplied && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount ({(discount * 100).toFixed(0)}%)</span>
                          <span>-${discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Total */}
                    <div className="flex justify-between items-center">
                      <span className="text-foreground text-lg">Total</span>
                      <span className="text-secondary text-2xl">
                        ${total.toFixed(2)}
                      </span>
                    </div>

                    {/* Place Order Button */}
                    <Button
                      size="lg"
                      onClick={handlePlaceOrder}
                      disabled={isProcessing || cartItems.length === 0}
                      className="w-full rounded-full bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300 h-14 text-lg"
                    >
                      {isProcessing ? (
                        <span className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Lock className="w-5 h-5" />
                          Place Order
                        </span>
                      )}
                    </Button>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <div className="text-center p-2">
                        <Shield className="w-6 h-6 mx-auto mb-1 text-green-600" />
                        <p className="text-xs text-muted-foreground">
                          Secure Payment
                        </p>
                      </div>
                      <div className="text-center p-2">
                        <Truck className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                        <p className="text-xs text-muted-foreground">
                          Fast Delivery
                        </p>
                      </div>
                      <div className="text-center p-2">
                        <Check className="w-6 h-6 mx-auto mb-1 text-primary" />
                        <p className="text-xs text-muted-foreground">
                          Easy Returns
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Related Products - Only show when cart has items */}
        {cartItems.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-foreground">You May Also Like</h2>
              <Button
                variant="ghost"
                onClick={onNavigateToProducts}
                className="text-primary hover:text-primary/80"
              >
                View All
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <Card
                  key={product.id}
                  className="group overflow-hidden rounded-2xl border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                >
                  <div className="relative aspect-square bg-muted">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-4 space-y-2">
                    <h3 className="text-sm text-foreground line-clamp-2 min-h-[2.5rem]">
                      {product.name}
                    </h3>
                    <p className="text-secondary">
                      ${product.price.toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
