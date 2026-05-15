import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ShoppingCart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

interface ProductCardProps {
  id: number | string;
  slug: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  rating?: number | null;
  reviewsCount?: number | null;
  category?: string;
  shipping_cost?: number;
  shop_id: string | number;
  shopName: string;
}

export function ProductCardrelated({
  id,
  name,
  slug,
  image,
  price,
  originalPrice,
  discountPercentage = 0,
  rating = 0,
  reviewsCount = 0,
  category,
  shipping_cost,
  shop_id,
  shopName,
}: ProductCardProps) {
  const navigate = useNavigate();

  const discountedPrice =
    discountPercentage > 0
      ? +(price * (1 - discountPercentage / 100)).toFixed(2)
      : price;

  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

return (
  <Card
    onClick={() => navigate(`/product/${slug}`)}
    className="group overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border-0 rounded-xl"
  >
    <div className="flex flex-col sm:flex-row h-full">
      {/* Image Section */}
      <div className="relative sm:w-52 w-full h-52 sm:h-auto bg-gray-50 flex items-center justify-center overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <Badge className="absolute top-3 left-3 bg-destructive text-white text-xs">
            {discountPercentage}% OFF
          </Badge>
        )}

        {/* Category Badge */}
        {category && (
          <Badge className="absolute top-3 right-3 text-xs bg-primary/10 text-primary border-primary/20">
            {category}
          </Badge>
        )}
      </div>

      {/* Content Section */}
      <CardContent className="flex flex-col flex-1 justify-between p-6">
        {/* Top Content */}
        <div className="space-y-2 flex-1">
          {/* Product Name */}
          <h3 className="text-base lg:text-lg font-semibold text-primary line-clamp-2 leading-snug">
            {name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(rating ?? 0)
                      ? "fill-secondary text-secondary"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            {reviewsCount !== null && (
              <span className="text-xs text-muted-foreground">
                ({rating})
              </span>
            )}
          </div>

          {/* Pricing */}
          <div className="flex flex-wrap items-center justify-end gap-2">
            <span className="text-xl font-bold text-primary">
              ${discountedPrice}
            </span>

            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${originalPrice}
              </span>
            )}

            {originalPrice && (
              <span className="text-xs text-secondary bg-secondary/10 px-2 py-1 rounded-md">
                Save ${(originalPrice - discountedPrice).toFixed(2)}
              </span>
            )}
          </div>

          {/* Optional Shop Name */}
          {/* <p className="text-sm text-muted-foreground">
            Sold by{" "}
            <span className="font-medium text-foreground">
              {shopName}
            </span>
          </p> */}
        </div>

        {/* Button */}
        <Button
          onClick={(e: any) => {
            e.stopPropagation();

            setAdding(true);

            addToCart({
              id,
              name,
              price: discountedPrice,
              image,
              quantity: 1,
              shipping_cost: shipping_cost || 0,
              shop_id,
              shopName,
            });

            setTimeout(() => setAdding(false), 500);
          }}
          className={`
            mt-5 w-full sm:w-fit 
            text-sm flex items-center justify-center gap-2
            bg-gradient-to-r from-primary to-primary/80
            transition-all duration-300 ease-out
            relative overflow-hidden rounded-xl cursor-pointer

            ${adding ? "scale-[0.98] opacity-90" : "hover:scale-[1.03]"}
          `}
        >
          <ShoppingCart
            className={`
              w-4 h-4 transition-all duration-500
              ${adding ? "scale-125 rotate-12" : "group-hover:scale-110"}
            `}
          />

          <span className="relative z-10">
            {adding ? "Added!" : "Add to Cart"}
          </span>
        </Button>
      </CardContent>
    </div>
  </Card>
);
}