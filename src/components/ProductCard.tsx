import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ShoppingCart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
}

export function ProductCard({
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
}: ProductCardProps) {
  const navigate = useNavigate();

  const discountedPrice =
    discountPercentage > 0
      ? +(price * (1 - discountPercentage / 100)).toFixed(2)
      : price;

  return (
    <Card
  onClick={() => navigate(`/product/${slug}`)}
  className="group flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
>
  {/* Image */}
  <div className="relative w-full overflow-hidden">
    <div className="aspect-square w-full overflow-hidden bg-gray-50 sm:h-56 lg:h-48">
      <ImageWithFallback
        src={image}
        alt={name}
        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
    </div>
           <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    {discountPercentage > 0 && (
      <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs">
        {discountPercentage}% OFF
      </Badge>
    )}
    {category && (
      <Badge className="absolute top-3 right-3 text-xs bg-primary/10 text-primary border-primary/20">
        {category}
      </Badge>
    )}
  </div>

  {/* Content */}
  <CardContent className="flex flex-col flex-1 p-4 gap-3">
    <h3 className="text-primary text-sm lg:text-base font-medium line-clamp-2">
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
        <span className="text-xs text-muted-foreground hidden sm:inline">
          {rating} ({reviewsCount})
        </span>
      )}
    </div>

    {/* Pricing */}
<div className="flex justify-between items-center">
  <div className="flex items-center gap-2">
    <span className="text-lg lg:text-xl font-semibold text-primary">
      ${discountedPrice}
    </span>
    {originalPrice && (
      <span className="text-sm text-muted-foreground line-through">
        ${originalPrice}
      </span>
    )}
  </div>
  {originalPrice && (
    <span className="text-xs text-secondary bg-secondary/10 px-2 py-0.5 rounded">
      Save ${(originalPrice - discountedPrice).toFixed(2)}
    </span>
  )}
</div>

    {/* Add to Cart */}
    <Button className="mt-auto w-full bg-gradient-to-r from-primary to-primary/80 text-xs lg:text-sm flex items-center justify-center gap-1">
      <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform" />
      Add to Cart
    </Button>
  </CardContent>
</Card>
  );
}