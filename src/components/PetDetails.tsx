import {
  Heart,
  Share2,
  MapPin,
  ChevronDown,
  ChevronUp,
  Phone,
  MessageCircle,
  Star,
  Check,
  X,
  Zap,
  ShieldCheck,
  Tag,
  DollarSign,
  AlertCircle,
  User as UserIcon,
  Navigation,
  Mail,
  Truck,
  Shield,
  RefreshCw,
  Info,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useRecommendations } from "@/hooks/useRecommendations";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Inject keyframes once (same as ProductDetailsPage)
const shineKeyframes = `
@keyframes shine-sweep {
  0%   { transform: translateX(-120%) skewX(-15deg); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateX(220%) skewX(-15deg); opacity: 0; }
}
`;

if (typeof document !== "undefined") {
  const styleId = "__pet-shine-style__";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = shineKeyframes;
    document.head.appendChild(style);
  }
}

interface Tag {
  id: number;
  name: string;
}

interface Pet {
  id: string;
  name: string;
  status: "adoption" | "sale" | "lost";
  images: string[];
  breed: string;
  category: string;
  gender: "Male" | "Female";
  size: "Small" | "Medium" | "Large" | "Giant";
  activityLevel: "Low" | "Medium" | "High";
  description: string;
  dateOfBirth: string;
  color: string;
  temperament: string[];
  microchipped: boolean;
  microchipId?: string;
  neutered: boolean;
  tags: Tag[];
  price?: number;
  adoptionStatus?: string;
  adoptionDate?: string;
  adoptionSource?: string;
  lastSeenLocation?: string;
  dateLost?: string;
  location: {
    country: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  owner: {
    owner_first_name: string;
    owner_last_name: string;
    image: string;
    email?: string;
    phone?: string;
    rating?: number;
    verified?: boolean;
  };
}

export function PetDetailPage() {
  const { slug } = useParams();
  const [pet, setPet] = useState<Pet | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `https://www.wowpetspalace.com/test/pets/pet-listings?slug=${slug}`,
        );
        const data = await res.json();

        if (data?.success && data?.data) {
          const apiPet = data.data[0];

          const images: string[] =
            apiPet.images?.map(
              (img: any) => `https://wowpetspalace.com/test/${img.image_url}`,
            ) || [];

          const formattedPet: Pet = {
  id: apiPet.pet_id?.toString() || "",

  name: apiPet.pet_name || "Unknown",

  status: apiPet.type || "adoption",

  images:
    apiPet.images?.map(
      (img: any) =>
        `https://wowpetspalace.com/test/${img.image_url}`
    ) || [],

  breed: apiPet.breed || "Unknown",

  category: apiPet.category || "Pet",

  gender:
    apiPet.gender === "male"
      ? "Male"
      : "Female",

  size:
    apiPet.size_category
      ? apiPet.size_category.charAt(0).toUpperCase() +
        apiPet.size_category.slice(1)
      : "Medium",

  activityLevel:
    apiPet.activity_level
      ? apiPet.activity_level.charAt(0).toUpperCase() +
        apiPet.activity_level.slice(1)
      : "Medium",

  description:
    apiPet.description || "No description available",

  dateOfBirth:
    apiPet.date_of_birth || "2023-01-01",

  color: apiPet.color || "Unknown",

  temperament:
    apiPet.temperament
      ? [apiPet.temperament]
      : [],

  microchipped:
    Boolean(apiPet.microchipped),

  microchipId:
    apiPet.microchip_id || undefined,

  neutered:
    Boolean(apiPet.neutered),

  tags:
    apiPet.tags?.map((tag: any) => ({
      id: tag.id,
      name: tag.name,
    })) || [],

  price: apiPet.price || 0,

  location: {
    country: apiPet.country || "Pakistan",

    address:
      apiPet.address || "Unknown location",

    latitude:
      apiPet.latitude || 0,

    longitude:
      apiPet.longitude || 0,
  },

  owner: {
    owner_first_name:
      apiPet.owner_first_name,

    owner_last_name:
      apiPet.owner_last_name,

    image: apiPet.owner_profile_photo
      ? `https://wowpetspalace.com/test/${apiPet.owner_profile_photo}`
      : "/fallback.jpg",

    email: apiPet.owner_email,

    phone: apiPet.owner_phone,
  },
};

          setPet(formattedPet);
          if (images.length > 0) setSelectedImage(images[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchPet();
  }, [slug]);

  const nextImage = () => {
    if (!pet?.images?.length) return;
    const nextIndex = (currentImageIndex + 1) % pet.images.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(pet.images[nextIndex]);
  };

  const prevImage = () => {
    if (!pet?.images?.length) return;
    const prevIndex =
      (currentImageIndex - 1 + pet.images.length) % pet.images.length;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(pet.images[prevIndex]);
  };

  const handleShare = () => {
    if (!pet) return;
    if (navigator.share) {
      navigator
        .share({
          title: `Meet ${pet.name}!`,
          text: `Check out ${pet.name}, a ${pet.breed}!`,
          url: window.location.href,
        })
        .catch(() => {});
    }
  };

  const getMapEmbedUrl = () => {
    if (!pet) return "";

    const { latitude, longitude } = pet.location;

    if (!latitude || !longitude) return "";

    return `https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }
    if (years > 0) return `${years} yr${years !== 1 ? "s" : ""} ${months} mo`;
    return `${months} month${months !== 1 ? "s" : ""}`;
  };
  const { data, loading } = useRecommendations({
    tag_ids: pet?.tags?.map((t) => t.id) || [],
    is_product: true,
    is_article: true,
    is_breed: true,
    is_pets: true,
    limit: 2,
  });

  const pets = data?.pets || [];
  const products = data?.products || [];
  const articles = data?.articles || [];
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Pet not found</h2>
          <p className="text-muted-foreground">
            The pet you're looking for doesn't exist.
          </p>
        </Card>
      </div>
    );
  }

  const hasMultipleImages = pet.images.length > 1;

  const description = pet.description || "No description available.";
  const shouldShowReadMore = description.length > 200;
  const truncatedDescription =
    shouldShowReadMore && !isDescriptionExpanded
      ? description.slice(0, 200) + "..."
      : description;

  const getStatusBadge = () => {
    switch (pet.status) {
      case "adoption":
        return (
          <Badge className="!bg-green-600 !text-white text-sm font-bold px-3 py-1.5 shadow-md rounded-md">
            <Check className="w-3 h-3 mr-1" /> Available for Adoption
          </Badge>
        );
      case "sale":
        return (
          <Badge
            variant="destructive"
            className="text-sm font-bold px-3 py-1.5 shadow-md rounded-md"
          >
            <DollarSign className="w-3 h-3 mr-1" /> For Sale
          </Badge>
        );
      case "lost":
        return (
          <Badge className="!bg-orange-500 !text-white text-sm font-bold px-3 py-1.5 shadow-md rounded-md">
            <AlertCircle className="w-3 h-3 mr-1" /> Lost Pet
          </Badge>
        );
    }
  };

  const getCTAButton = () => {
    switch (pet.status) {
      case "adoption":
        return (
          <Button
            size="lg"
            className="flex-1 gap-2 h-12 text-base font-semibold"
          >
            <Heart className="w-5 h-5" /> Adopt {pet.name}
          </Button>
        );
      case "sale":
        return (
          <Button
            size="lg"
            className="flex-1 gap-2 h-12 text-base font-semibold"
          >
            <MessageCircle className="w-5 h-5" /> Contact Seller
          </Button>
        );
      case "lost":
        return (
          <Button
            size="lg"
            className="flex-1 gap-2 h-12 text-base font-semibold"
          >
            <Navigation className="w-5 h-5" /> Report Sighting
          </Button>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 lg:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <a href="/" className="hover:text-foreground transition-colors">
            Home
          </a>
          <span>/</span>
          <a href="/pets" className="hover:text-foreground transition-colors">
            Pets
          </a>
          <span>/</span>
          <span className="text-foreground font-medium">{pet.breed}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image with Shine Effect */}
            <Card className="overflow-hidden border-2 border-border/50">
              <div
                className="relative group mx-auto w-full"
                style={{
                  height: "70vh",
                  maxHeight: "70vh",
                  overflow: "hidden",
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <img
                  src={selectedImage || pet.images[0] || "/fallback.jpg"}
                  alt={pet.name}
                  className="w-full h-full object-contain relative z-10 bg-muted/20"
                  style={{
                    transition:
                      "transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    transform: isHovered ? "scale(1.04)" : "scale(1)",
                  }}
                />

                {/* Shine overlay */}
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

                {/* Vignette */}
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

                {/* Nav arrows for multiple images */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg hover:bg-white transition-all z-30"
                    >
                      <ChevronLeft className="w-5 h-5 text-primary" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg hover:bg-white transition-all z-30"
                    >
                      <ChevronRight className="w-5 h-5 text-primary" />
                    </button>
                  </>
                )}

                {/* Status Badge Overlay */}
                <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2 z-30">
                  {getStatusBadge()}
                  {pet.breed && (
                    <Badge className="ml-auto bg-background/95 backdrop-blur-sm text-foreground border border-border/50 text-sm font-medium px-3 py-1.5 shadow-md">
                      {pet.breed}
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
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart
                      className={`h-4 w-4 ${isFavorite ? "fill-destructive text-destructive" : ""}`}
                    />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-10 w-10 rounded-full shadow-lg backdrop-blur-sm"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Thumbnail Gallery */}
            {hasMultipleImages && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                {pet.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImage(img);
                      setCurrentImageIndex(index);
                    }}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === img
                        ? "border-primary shadow-md ring-2 ring-primary/20"
                        : "border-border/50 hover:border-primary/50 hover:shadow-sm"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${pet.name} - View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Pet Info */}
          <div className="flex flex-col space-y-4 lg:space-y-8">
            <div className="space-y-3">
              <h1 className="text-2xl lg:text-4xl font-bold text-foreground leading-tight">
                {pet.name}
              </h1>

              {/* Breed & Category badges */}
              <div className="flex items-center gap-2 flex-wrap mt-2">
                <Badge
                  variant="outline"
                  className="border-primary/30 text-foreground px-3 py-1"
                >
                  {pet.breed}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-primary/30 text-foreground px-3 py-1"
                >
                  {pet.gender}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-primary/30 text-foreground px-3 py-1"
                >
                  {pet.size}
                </Badge>
                <Badge
                  className={`px-3 py-1 border-0 ${
                    pet.activityLevel === "High"
                      ? "bg-green-100 text-green-700"
                      : pet.activityLevel === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                  }`}
                >
                  <Zap className="w-3 h-3 mr-1" />
                  {pet.activityLevel} Activity
                </Badge>
              </div>

              {/* Age & Location row */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    {calculateAge(pet.dateOfBirth)}
                  </span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {pet.location.address}
                  </span>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Price (if for sale) */}
            {pet.status === "sale" && pet.price && pet.price > 0 && (
              <>
                <div className="space-y-3">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-3xl lg:text-4xl font-bold text-primary">
                      ${pet.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className="text-sm font-medium px-3 py-1.5"
                    >
                      Available
                    </Badge>
                  </div>
                </div>
                <Separator className="my-6" />
              </>
            )}

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">About {pet.name}</h3>
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
                        <ChevronUp className="ml-1 h-4 w-4 mr-1" /> Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="ml-1 h-4 w-4 mr-1" /> Read More
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Pet Details Grid */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Pet Details</h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Color</p>
                  <p className="text-sm font-medium text-foreground">
                    {pet.color}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Category</p>
                  <p className="text-sm font-medium text-foreground">
                    {pet.category}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Microchipped
                  </p>
                  <div className="flex items-center gap-1">
                    {pet.microchipped ? (
                      <>
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">Yes</span>
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4 text-destructive" />
                        <span className="text-sm font-medium">No</span>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {pet.gender === "Male" ? "Neutered" : "Spayed"}
                  </p>
                  <div className="flex items-center gap-1">
                    {pet.neutered ? (
                      <>
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">Yes</span>
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4 text-destructive" />
                        <span className="text-sm font-medium">No</span>
                      </>
                    )}
                  </div>
                </div>
                {pet.microchipId && (
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground mb-1">
                      Chip ID
                    </p>
                    <p className="text-sm font-medium font-mono text-foreground">
                      {pet.microchipId}
                    </p>
                  </div>
                )}
              </div>

              {/* Temperament */}
              {pet.temperament.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground mb-2">
                    Temperament
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {pet.temperament.map((trait, i) => (
                      <Badge
                        key={i}
                        className="bg-primary/10 text-primary border-0"
                      >
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {pet.tags.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Tags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {pet.tags.map((tag, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="border-border/50 text-foreground"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Lost Pet Info */}
            {pet.status === "lost" && (
              <>
                <Separator className="my-6" />
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-destructive">
                    <AlertCircle className="w-5 h-5" /> Lost Pet Information
                  </h3>
                  {pet.dateLost && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Date Lost
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {pet.dateLost}
                      </span>
                    </div>
                  )}
                  {pet.lastSeenLocation && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Last Seen Location
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {pet.lastSeenLocation}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Adoption Info */}
            {pet.status === "adoption" && pet.adoptionStatus && (
              <>
                <Separator className="my-6" />
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">
                    Adoption Information
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Status
                    </span>
                    <Badge className="bg-green-50 text-green-700 border border-green-200 text-sm font-semibold px-3 py-1.5">
                      {pet.adoptionStatus}
                    </Badge>
                  </div>
                  {pet.adoptionSource && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Rescue Center
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {pet.adoptionSource}
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Owner Info */}
            <Separator className="my-6" />
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Owner Information</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0 border border-border">
                  <img
                    src={pet.owner.image}
                    alt={pet.owner.owner_first_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/fallback.jpg";
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-foreground">
                      {pet.owner.owner_first_name} {pet.owner.owner_last_name}
                    </span>

                    {pet.owner.verified && (
                      <ShieldCheck className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  {pet.owner.rating && (
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={
                            i < Math.floor(pet.owner.rating!)
                              ? "#fbbf24"
                              : "transparent"
                          }
                          stroke={
                            i < Math.floor(pet.owner.rating!)
                              ? "#fbbf24"
                              : "#d1d5db"
                          }
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">
                        {pet.owner.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                  <span className=" text-foreground">{pet.owner.email}</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              {getCTAButton()}
              <Button
                size="lg"
                variant="outline"
                className="flex-1 h-12 text-base font-semibold border-2 gap-2"
                onClick={handleShare}
              >
                <Share2 className="w-5 h-5" /> Share
              </Button>
            </div>

            {/* Contact Buttons */}
            <div className="mt-5 flex gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-lg border-primary/30 hover:border-primary hover:bg-primary/5 gap-2"
              >
                <Phone className="w-4 h-4" /> Call
              </Button>
              <Button
                variant="outline"
                className="flex-1 rounded-lg border-primary/30 hover:border-primary hover:bg-primary/5 gap-2"
              >
                <Mail className="w-4 h-4" /> Email
              </Button>
              <Button
                variant="outline"
                className="flex-1 rounded-lg border-primary/30 hover:border-primary hover:bg-primary/5 gap-2"
              >
                <MessageCircle className="w-4 h-4" /> Chat
              </Button>
            </div>

            {/* Trust Badges Card */}
            <Card className="mt-6 bg-muted/50 border-border/50 space-y-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between flex-row gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Verified Listing</p>
                      <p className="text-xs text-muted-foreground">100% Safe</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Health Checked</p>
                      <p className="text-xs text-muted-foreground">
                        Vet Approved
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Heart className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Loved & Cared</p>
                      <p className="text-xs text-muted-foreground">Happy Pet</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Location Section */}
        {/* Location Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Location</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-4 ">
              {/* MAP */}
              <Card className="border-border/50 overflow-hidden rounded-xl shadow-md">
                <div className="w-full h-96 ">
                  {pet.location.latitude && pet.location.longitude ? (
                    <iframe
                      src={getMapEmbedUrl()}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      Location not available
                    </div>
                  )}
                </div>
              </Card>

              {/* LOCATION DETAILS BELOW MAP */}
              {pet.location.latitude && pet.location.longitude && (
                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg mt-0.5">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>

                      <div>
                        <p className="font-semibold text-foreground">
                          {pet.location.address}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {pet.location.country}
                        </p>

                        <div className="mt-3 text-xs text-muted-foreground">
                          Lat: {pet.location.latitude || "N/A"} <br />
                          Lng: {pet.location.longitude || "N/A"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* RIGHT COLUMN (empty for now) */}
            {/* Recommendations Section */}
            <div className="mt-20 space-y-14">
              {/* Related Pets */}
              {pets?.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Related Pets</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                    {pets.map((item: any) => (
                      <Card
                        key={item.pet_id}
                        className="overflow-hidden hover:shadow-xl transition-all duration-300 group"
                      >
                        <div className="aspect-square overflow-hidden bg-muted">
                          <img
                            src={item.image}
                            alt={item.pet_name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        <CardContent className="p-4">
                          <h3 className="font-semibold line-clamp-1">
                            {item.pet_name}
                          </h3>

                          <p className="text-sm text-muted-foreground mt-1">
                            {item.breed}
                          </p>

                          <Button className="w-full mt-4" variant="outline">
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* Related Products */}
              {products?.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-6">
                    Recommended Products
                  </h2>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                    {products.map((product: any) => (
                      <Card
                        key={product.product_id}
                        className="overflow-hidden hover:shadow-xl transition-all duration-300"
                      >
                        <div className="aspect-square bg-muted overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.product_name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <CardContent className="p-4">
                          <h3 className="font-medium line-clamp-2 min-h-[48px]">
                            {product.product_name}
                          </h3>

                          <p className="text-primary font-bold mt-2">
                            ${product.price}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* Related Articles */}
              {articles?.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold mb-6">Helpful Articles</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {articles.map((article: any) => (
                      <Card
                        key={article.article_id}
                        className="overflow-hidden hover:shadow-lg transition-all"
                      >
                        <div className="aspect-video overflow-hidden bg-muted">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <CardContent className="p-5">
                          <h3 className="font-semibold text-lg line-clamp-2">
                            {article.title}
                          </h3>

                          <p className="text-sm text-muted-foreground mt-3 line-clamp-3">
                            {article.short_description}
                          </p>

                          <Button variant="link" className="px-0 mt-3">
                            Read More
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}
              {/* Related Breeds */}
{data?.breeds?.length > 0 && (
  <section>
    <h2 className="text-2xl font-bold mb-6">
      Related Breeds
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {data.breeds.map((breed: any) => (
        <Card
          key={breed.id}
          className="overflow-hidden hover:shadow-lg transition-all"
        >
          <CardContent className="p-5">
            <h3 className="font-semibold text-lg">
              {breed.title}
            </h3>

            <p className="text-sm text-muted-foreground mt-3 line-clamp-3">
              {breed.shortDescription}
            </p>

            <Button
              variant="link"
              className="px-0 mt-3"
            >
              Explore Breed
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  </section>
)}
            </div>
            <div />
          </div>
        </div>
      </div>
    </div>
  );
}
