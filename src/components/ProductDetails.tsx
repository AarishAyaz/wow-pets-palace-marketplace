import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  ChevronDown,
  ChevronUp,
  Truck,
  Shield,
  RefreshCw,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { useNavigate } from "react-router-dom";

// Inject keyframes once
const shineKeyframes = `
@keyframes shine-sweep {
  0%   { transform: translateX(-120%) skewX(-15deg); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateX(220%) skewX(-15deg); opacity: 0; }
}
`;

if (typeof document !== "undefined") {
  const styleId = "__product-shine-style__";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = shineKeyframes;
    document.head.appendChild(style);
  }
}

export function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("https://www.wowpetspalace.com/test/product/getallFeaturedProduct")
      .then((res) => {
        const allProducts = res.data.result || [];
        const found = allProducts.find((p: any) => String(p.id) === String(id));

        if (found) {
          setProduct(found);
          const mainImage = `https://www.wowpetspalace.com/test/${found.featured_image}`;
          setSelectedImage(mainImage);

          const related = allProducts.filter(
            (p: any) =>
              p.categoryTitle === found.categoryTitle &&
              String(p.id) !== String(found.id),
          );
          setRelatedProducts(related.slice(0, 6));
        }

        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Product not found</h2>
          <p className="text-muted-foreground">
            The product you're looking for doesn't exist.
          </p>
        </Card>
      </div>
    );
  }

  const getProductImages = () => {
    const baseUrl = "https://www.wowpetspalace.com/test/";
    const images: string[] = [];

    if (product.featured_image) {
      images.push(`${baseUrl}${product.featured_image}`);
    }

    if (product.images && Array.isArray(product.images)) {
      product.images.forEach((img: any) => {
        const imgUrl =
          typeof img === "string"
            ? `${baseUrl}${img}`
            : `${baseUrl}${img.path || img.url || img.image}`;
        if (!images.includes(imgUrl)) images.push(imgUrl);
      });
    }

    if (product.product_images && Array.isArray(product.product_images)) {
      product.product_images.forEach((img: any) => {
        const imgUrl =
          typeof img === "string"
            ? `${baseUrl}${img}`
            : `${baseUrl}${img.path || img.url || img.image}`;
        if (!images.includes(imgUrl)) images.push(imgUrl);
      });
    }

    return images;
  };

  const productImages = getProductImages();
  const hasMultipleImages = productImages.length > 1;

  const discountedPrice =
    product.discountPercentage > 0
      ? (
          product.original_price *
          (1 - product.discountPercentage / 100)
        ).toFixed(2)
      : product.original_price;

  const hasDiscount = product.discountPercentage > 0;
  const description =
    product.description ||
    "Premium quality product designed for your pet's health and happiness. Made with natural ingredients and crafted with care to ensure the best nutrition and taste.";
  const shouldShowReadMore = description.length > 200;
  const truncatedDescription =
    shouldShowReadMore && !isDescriptionExpanded
      ? description.slice(0, 200) + "..."
      : description;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 lg:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <a href="/" className="hover:text-foreground transition-colors">
            Home
          </a>
          <span>/</span>
          <a
            href="/wowpets/shop"
            className="hover:text-foreground transition-colors"
          >
            Products
          </a>
          <span>/</span>
          <span className="text-foreground font-medium">
            {product.categoryTitle}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Images */}
          <div className="space-y-4 object-contain">
            {/* Main Image with Professional Shine Effect */}
<Card className="overflow-hidden border-2 border-border/50">
  <div
    className="relative group mx-auto w-full"
    style={{
      height: "70vh",        // Fixed height
      maxHeight: "70vh",
      overflow: "hidden",
    }}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
    <img
      src={selectedImage}
      alt={product.name}
      className="w-full h-full object-contain relative z-10 bg-muted/20"
      style={{
        transition: "transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        transform: isHovered ? "scale(1.04)" : "scale(1)",
      }}
    />
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 20,
                    pointerEvents: "none",
                    overflow: "hidden",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: "-50%",
                      left: "-50%",
                      width: "60%",
                      height: "200%",
                      background:
                        "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0.15) 58%, transparent 70%)",
                      transform: "translateX(-120%) skewX(-15deg)",
                      opacity: 0,
                      animation: isHovered
                        ? "shine-sweep 0.75s cubic-bezier(0.4, 0, 0.2, 1) forwards"
                        : "none",
                    }}
                  />
                </span>

                {/* Soft vignette for depth */}
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 11,
                    pointerEvents: "none",
                    background:
                      "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.04) 100%)",
                    transition: "opacity 0.3s ease",
                    opacity: isHovered ? 1 : 0,
                  }}
                />

                {/* Badges Overlay */}
                <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2 z-30">
                  {hasDiscount && (
                    <Badge className="bg-destructive/95 backdrop-blur-sm text-white border-0 text-sm font-semibold px-3 py-1.5 shadow-lg">
                      -{product.discountPercentage}% OFF
                    </Badge>
                  )}
                  {product.categoryTitle && (
                    <Badge className="ml-auto bg-background/95 backdrop-blur-sm text-foreground border border-border/50 text-sm font-medium px-3 py-1.5 shadow-md">
                      {product.categoryTitle}
                    </Badge>
                  )}
                </div>

                {/* Quick Actions */}
                <div
                  className="absolute top-4 right-4 flex flex-col gap-2 z-30"
                  style={{
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? "translateX(0)" : "translateX(8px)",
                    transition: "opacity 0.25s ease, transform 0.25s ease",
                  }}
                >
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-10 w-10 rounded-full shadow-lg backdrop-blur-sm"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-10 w-10 rounded-full shadow-lg backdrop-blur-sm"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Thumbnail Gallery */}
            {hasMultipleImages && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === img
                        ? "border-primary shadow-md ring-2 ring-primary/20"
                        : "border-border/50 hover:border-primary/50 hover:shadow-sm"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} - View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div className="flex flex-col">
            <div className="space-y-3">
              <h1 className="text-2xl lg:text-4xl font-bold text-foreground leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.overall_rating || 0)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {product.overall_rating?.toFixed(1) || "4.8"}
                  </span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-sm text-muted-foreground">
                  {product.reviewsCount || 124} reviews
                </span>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-3">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl lg:text-4xl font-bold text-primary">
                  ${discountedPrice}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-muted-foreground line-through font-medium">
                    ${product.original_price?.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {hasDiscount && (
                  <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400 border border-green-200 dark:border-green-800 text-sm font-semibold px-3 py-1.5">
                    Save $
                    {(product.original_price - discountedPrice).toFixed(2)}
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className="text-sm font-medium px-3 py-1.5"
                >
                  In Stock
                </Badge>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Description</h3>
              <div className="text-muted-foreground leading-relaxed">
                <p>{truncatedDescription}</p>
                {shouldShowReadMore && (
                  <Button
                    variant="link"
                    onClick={() =>
                      setIsDescriptionExpanded(!isDescriptionExpanded)
                    }
                    className="px-0 mt-2 h-auto text-primary font-semibold"
                  >
                    {isDescriptionExpanded ? (
                      <>
                        Show Less <ChevronUp className="ml-1 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Read More <ChevronDown className="ml-1 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Quantity</h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 px-4 rounded-none border-r"
                  >
                    -
                  </Button>
                  <div className="px-6 py-2 min-w-[60px] text-center font-semibold">
                    {quantity}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-10 px-4 rounded-none border-l"
                  >
                    +
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  {quantity} {quantity === 1 ? "item" : "items"} selected
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="flex-1 gap-2 h-12 text-base font-semibold"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1 h-12 text-base font-semibold border-2"
              >
                Buy Now
              </Button>
            </div>

            <Card className="mt-6 bg-muted/50 border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between flex-row sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Truck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Free Delivery</p>
                      <p className="text-xs text-muted-foreground">
                        Orders over $50
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Secure Payment</p>
                      <p className="text-xs text-muted-foreground">
                        100% Protected
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <RefreshCw className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Easy Returns</p>
                      <p className="text-xs text-muted-foreground">
                        30 day guarantee
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Related Products</h2>
              <span className="text-sm text-muted-foreground">
                More from {product.categoryTitle}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <Card
                  onClick={() => navigate(`/product/${item.id}`)}
                  key={item.id}
                  className="cursor-pointer group border border-border/60 hover:border-primary/40 hover:shadow-md transition-all duration-200"
                >
                  <div
                    className="aspect-square bg-muted/30 relative overflow-hidden"
                    style={{ overflow: "hidden" }}
                  >
                    <img
                      src={`https://www.wowpetspalace.com/test/${item.featured_image}`}
                      alt={item.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Shine on related product cards too */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 pointer-events-none overflow-hidden z-10"
                    >
                      <span
                        className="absolute top-[-50%] left-[-50%] h-[200%] w-[55%] opacity-0 group-hover:opacity-100"
                        style={{
                          background:
                            "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.12) 58%, transparent 70%)",
                          animation:
                            "shine-sweep 0.65s cubic-bezier(0.4,0,0.2,1) forwards",
                          animationPlayState: "paused",
                        }}
                      />
                    </span>

                    {item.discountPercentage > 0 && (
                      <Badge className="absolute top-3 left-3 bg-destructive text-white z-20">
                        -{item.discountPercentage}%
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold text-sm line-clamp-2">
                      {item.name}
                    </h3>

                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary">
                        $
                        {item.discountPercentage > 0
                          ? (
                              item.original_price *
                              (1 - item.discountPercentage / 100)
                            ).toFixed(2)
                          : item.original_price}
                      </span>

                      {item.discountPercentage > 0 && (
                        <span className="text-xs line-through text-muted-foreground">
                          ${item.original_price}
                        </span>
                      )}
                    </div>

                    <Button
                      size="sm"
                      className="w-full mt-2"
                      onClick={() =>
                        (window.location.href = `/wowpets/product/${item.id}`)
                      }
                    >
                      View Product
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}