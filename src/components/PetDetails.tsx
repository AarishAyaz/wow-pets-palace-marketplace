import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Calendar,
  Info,
  ChevronLeft,
  ChevronRight,
  Phone,
  MessageCircle,
  Star,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Zap,
  ShieldCheck,
  Tag,
  DollarSign,
  AlertCircle,
  User as UserIcon,
  Navigation,
  Mail,
} from "lucide-react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface PetDetailPageProps {
  slug: string;
  onNavigateBack?: () => void;
  onNavigateHome?: () => void;
  cartItemCount?: number;
  onNavigateToCart?: () => void;
  onNavigateToProfile?: () => void;
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
  tags: string[];
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
    name: string;
    image: string;
    rating?: number;
    verified?: boolean;
  };
}

export function PetDetailPage({
  onNavigateBack,
  onNavigateHome,
  cartItemCount = 0,
  onNavigateToCart,
  onNavigateToProfile,
}: PetDetailPageProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const { slug } = useParams();
  // Mock pet data
  // const pet: Pet = {
  //   id: petId,
  //   name: 'Luna',
  //   status: 'adoption',
  //   images: [
  //     'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  //     'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  //     'https://images.unsplash.com/photo-1574158622682-e40e69881006?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800',
  //     'https://images.unsplash.com/photo-1561948955-570b270e7c36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800'
  //   ],
  //   breed: 'Golden Retriever',
  //   category: 'Dog',
  //   gender: 'Female',
  //   size: 'Large',
  //   activityLevel: 'High',
  //   description:
  //     "Meet Luna, a beautiful and energetic Golden Retriever who's looking for her forever home! Luna is a 2-year-old bundle of joy who loves outdoor adventures, playing fetch, and cuddling on the couch after a long day of fun. She's incredibly friendly with both adults and children, making her the perfect family companion. Luna is house-trained, knows basic commands, and walks well on a leash. She gets along wonderfully with other dogs and would thrive in a home with a yard where she can run and play. Luna has been spayed, is up-to-date on all vaccinations, and comes with a clean bill of health from our veterinarian. She's microchipped for safety and ready to bring endless love and happiness to her new family. If you're looking for a loyal, affectionate, and playful companion, Luna is waiting to meet you!",
  //   dateOfBirth: '2024-03-15',
  //   color: 'Golden',
  //   temperament: ['Friendly', 'Playful', 'Gentle', 'Loyal'],
  //   microchipped: true,
  //   microchipId: 'MC-984756321',
  //   neutered: true,
  //   tags: ['family-friendly', 'good-with-kids', 'energetic', 'house-trained', 'vaccinated'],
  //   adoptionStatus: 'Available',
  //   adoptionSource: 'Happy Paws Rescue Center',
  //   location: {
  //     country: 'United States',
  //     address: '123 Rescue Lane, San Francisco, CA 94102',
  //     latitude: 37.7749,
  //     longitude: -122.4194
  //   },
  //   owner: {
  //     name: 'Happy Paws Rescue',
  //     image:
  //       'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  //     rating: 4.9,
  //     verified: true
  //   }
  // };
  const [loading, setLoading] = useState(true);
  const [pet, setPet] = useState<Pet | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://www.wowpetspalace.com/test/pets/pet-listings?slug=${slug}`,
        );

        const data = await res.json();

        if (data?.success && data?.data) {
          const apiPet = data.data[0];

          const formattedPet: Pet = {
            id: apiPet.pet_id?.toString() || "",
            name: apiPet.pet_name || "Unknown",
            status: apiPet.type || "adoption",
            images: apiPet.images?.map(
              (img: any) => `https://wowpetspalace.com/test/${img.image_url}`,
            ) || ["/fallback.jpg"],

            breed: apiPet.breed || "Unknown",
            category: apiPet.type || "Pet",
            gender: "Male",
            size: "Medium",
            activityLevel: "Medium",
            description: apiPet.description || "No description available",
            dateOfBirth: "2023-01-01",
            color: "Unknown",
            temperament: [],
            microchipped: false,
            neutered: false,
            tags: [],
            price: apiPet.price || 0,
            location: {
              country: "Pakistan",
              address: apiPet.address || "Unknown location",
              latitude: 0,
              longitude: 0,
            },
            owner: {
              name: "Pet Owner",
              image: "/fallback.jpg",
            },
          };

          setPet(formattedPet);
        } else {
          setError("Pet not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load pet");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchPet();
  }, [slug]);
  // Related products
  const relatedProducts = [
    {
      id: "1",
      name: "Premium Dog Food",
      price: 49.99,
      image:
        "https://images.unsplash.com/photo-1708746333832-9a8cde4a0cfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      id: "2",
      name: "Interactive Dog Toy",
      price: 24.99,
      image:
        "https://images.unsplash.com/photo-1596822316110-288c7b8f24f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      id: "3",
      name: "Comfortable Dog Bed",
      price: 79.99,
      image:
        "https://images.unsplash.com/photo-1615751072497-5f5169febe17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    {
      id: "4",
      name: "Dog Leash & Collar Set",
      price: 34.99,
      image:
        "https://images.unsplash.com/photo-1633967135884-b38fb62c22e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
  ];

  // Similar pets
  const similarPets = [
    {
      id: "2",
      name: "Max",
      breed: "Golden Retriever",
      age: "3 years",
      image:
        "https://images.unsplash.com/photo-1633967135884-b38fb62c22e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      status: "adoption",
    },
    {
      id: "3",
      name: "Bella",
      breed: "Labrador Retriever",
      age: "2 years",
      image:
        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      status: "adoption",
    },
    {
      id: "4",
      name: "Charlie",
      breed: "Golden Retriever",
      age: "1 year",
      image:
        "https://images.unsplash.com/photo-1600804931749-2da4ce26c869?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      status: "adoption",
    },
  ];

  // Related articles
  const relatedArticles = [
    {
      id: "1",
      title: "Complete Guide to Golden Retriever Care",
      image:
        "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      readTime: "8 min read",
    },
    {
      id: "2",
      title: "Training Your New Puppy: Essential Tips",
      image:
        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      readTime: "6 min read",
    },
    {
      id: "3",
      title: "Nutrition Guide for Large Breed Dogs",
      image:
        "https://images.unsplash.com/photo-1600804931749-2da4ce26c869?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      readTime: "10 min read",
    },
  ];

  const nextImage = () => {
    if (!pet?.images?.length) return;
    setCurrentImageIndex((prev) => (prev + 1) % pet.images.length);
  };

  const prevImage = () => {
    if (!pet?.images?.length) return;
    setCurrentImageIndex(
      (prev) => (prev - 1 + pet.images.length) % pet.images.length,
    );
  };
  const handleShare = () => {
    if (!pet) return;

    if (navigator.share) {
      navigator
        .share({
          title: `Meet ${pet.name}!`,
          text: `Check out ${pet.name}, a ${pet.breed} available for adoption!`,
          url: window.location.href,
        })
        .catch(() => {
          // Fallback for browsers that don't support share
          alert("Share link copied to clipboard!");
        });
    } else {
      alert("Share link copied to clipboard!");
    }
  };
  if (!pet) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  const getStatusBadge = () => {
    switch (pet.status) {
      case "adoption":
        return (
          <Badge className="bg-green-500 text-white border-0 text-base px-4 py-2">
            <Check className="w-4 h-4 mr-2" />
            Available for Adoption
          </Badge>
        );
      case "sale":
        return (
          <Badge className="bg-secondary text-white border-0 text-base px-4 py-2">
            <DollarSign className="w-4 h-4 mr-2" />
            For Sale
          </Badge>
        );
      case "lost":
        return (
          <Badge className="bg-destructive text-white border-0 text-base px-4 py-2">
            <AlertCircle className="w-4 h-4 mr-2" />
            Lost Pet
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
            className="w-full rounded-full bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300 text-lg h-14"
          >
            <Heart className="w-5 h-5 mr-2" />
            Adopt {pet.name}
          </Button>
        );
      case "sale":
        return (
          <Button
            size="lg"
            className="w-full rounded-full bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300 text-lg h-14"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Contact Seller
          </Button>
        );
      case "lost":
        return (
          <Button
            size="lg"
            className="w-full rounded-full bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300 text-lg h-14"
          >
            <Navigation className="w-5 h-5 mr-2" />
            Report Sighting
          </Button>
        );
    }
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

    if (years > 0) {
      return `${years} ${years === 1 ? "year" : "years"} ${months} ${
        months === 1 ? "month" : "months"
      }`;
    }
    return `${months} ${months === 1 ? "month" : "months"}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* Custom Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onNavigateBack}
            className="rounded-full hover:bg-primary/10"
          >
            <ArrowLeft className="w-5 h-5 text-primary" />
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFavorite(!isFavorite)}
              className="rounded-full hover:bg-primary/10"
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite
                    ? "fill-destructive text-destructive"
                    : "text-primary"
                }`}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="rounded-full hover:bg-primary/10"
            >
              <Share2 className="w-5 h-5 text-primary" />
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Image Gallery */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted shadow-xl">
              <ImageWithFallback
                src={pet.images?.[currentImageIndex] || "/fallback.jpg"}
                alt={`${pet.name} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Navigation Arrows */}
              {pet.images?.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg hover:bg-white transition-all hover:scale-110"
                  >
                    <ChevronLeft className="w-6 h-6 text-primary" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg hover:bg-white transition-all hover:scale-110"
                  >
                    <ChevronRight className="w-6 h-6 text-primary" />
                  </button>
                </>
              )}

              {/* Status Badge Overlay */}
              <div className="absolute top-4 left-4">{getStatusBadge()}</div>
            </div>

            {/* Thumbnail Gallery */}
            {pet.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {pet.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? "border-primary scale-105"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`${pet.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Pet Information */}
          <div className="space-y-6">
            {/* Pet Name & Basic Info */}
            <div>
              <h1 className="text-primary mb-4">{pet.name}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
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
                  {pet.category}
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
                  variant="outline"
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
            </div>

            {/* Description */}
            <Card className="rounded-3xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  About {pet.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className={`text-muted-foreground leading-relaxed ${
                    !isDescriptionExpanded ? "line-clamp-4" : ""
                  }`}
                >
                  {pet.description}
                </p>
                <Button
                  variant="ghost"
                  onClick={() =>
                    setIsDescriptionExpanded(!isDescriptionExpanded)
                  }
                  className="mt-2 text-primary hover:text-primary/80"
                >
                  {isDescriptionExpanded ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-2" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-2" />
                      Read More
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Pet Details */}
            <Card className="rounded-3xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground">Pet Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Age</p>
                    <p className="text-foreground">
                      {calculateAge(pet.dateOfBirth)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Color</p>
                    <p className="text-foreground">{pet.color}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Microchipped
                    </p>
                    <div className="flex items-center gap-2">
                      {pet.microchipped ? (
                        <>
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="text-foreground">Yes</span>
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4 text-destructive" />
                          <span className="text-foreground">No</span>
                        </>
                      )}
                    </div>
                  </div>
                  {pet.microchipId && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Chip ID
                      </p>
                      <p className="text-foreground font-mono text-sm">
                        {pet.microchipId}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {pet.gender === "Male" ? "Neutered" : "Spayed"}
                    </p>
                    <div className="flex items-center gap-2">
                      {pet.neutered ? (
                        <>
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="text-foreground">Yes</span>
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4 text-destructive" />
                          <span className="text-foreground">No</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Temperament
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {pet.temperament.map((trait, index) => (
                      <Badge
                        key={index}
                        className="bg-primary/10 text-primary border-0"
                      >
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>

                {pet.tags.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Tags
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {pet.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="border-secondary/30 text-foreground"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Adoption/Sale/Lost Specific Info */}
            {pet.status === "adoption" && pet.adoptionStatus && (
              <Card className="rounded-3xl border-0 shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Adoption Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge className="bg-green-600 text-white border-0">
                      {pet.adoptionStatus}
                    </Badge>
                  </div>
                  {pet.adoptionSource && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Rescue Center
                      </span>
                      <span className="text-foreground">
                        {pet.adoptionSource}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {pet.status === "sale" && pet.price && (
              <Card className="rounded-3xl border-0 shadow-lg bg-gradient-to-r from-secondary/10 to-secondary/5">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Sale Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-lg">Price</span>
                    <span className="text-secondary text-3xl">
                      ${pet.price.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {pet.status === "lost" && (
              <Card className="rounded-3xl border-0 shadow-lg bg-gradient-to-r from-destructive/10 to-orange-50">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-destructive" />
                    Lost Pet Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {pet.dateLost && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Date Lost</span>
                      <span className="text-foreground">{pet.dateLost}</span>
                    </div>
                  )}
                  {pet.lastSeenLocation && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Last Seen Location
                      </p>
                      <p className="text-foreground">{pet.lastSeenLocation}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Location */}
            <Card className="rounded-3xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Address</p>
                  <p className="text-foreground">{pet.location.address}</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    {pet.location.country}
                  </p>
                </div>

                {/* Map Preview */}
                <div className="aspect-video rounded-2xl overflow-hidden bg-muted border-2 border-primary/20">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
                      <p className="text-foreground">
                        {pet.location.latitude.toFixed(4)},{" "}
                        {pet.location.longitude.toFixed(4)}
                      </p>
                      <Button
                        variant="link"
                        className="text-primary hover:text-primary/80 mt-2"
                      >
                        View on Map
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Owner Information */}
            <Card className="rounded-3xl border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-primary" />
                  Owner Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
                    <ImageWithFallback
                      src={pet.owner.image}
                      alt={pet.owner.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-foreground">{pet.owner.name}</h3>
                      {pet.owner.verified && (
                        <ShieldCheck className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    {pet.owner.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-secondary text-secondary" />
                        <span className="text-foreground">
                          {pet.owner.rating.toFixed(1)}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          / 5.0
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <Button
                    variant="outline"
                    className="rounded-xl border-primary/30 hover:border-primary hover:bg-primary/5"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-xl border-primary/30 hover:border-primary hover:bg-primary/5"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* CTA Button */}
            <div className="sticky bottom-4 z-10">{getCTAButton()}</div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-foreground">Products for {pet.name}</h2>
            <Button
              variant="ghost"
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
                  <p className="text-secondary">${product.price.toFixed(2)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Similar Pets */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-foreground">Similar Pets</h2>
            <Button
              variant="ghost"
              className="text-primary hover:text-primary/80"
            >
              View All
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {similarPets.map((similarPet) => (
              <Card
                key={similarPet.id}
                className="group overflow-hidden rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              >
                <div className="relative aspect-square bg-muted">
                  <ImageWithFallback
                    src={similarPet.image}
                    alt={similarPet.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-green-500 text-white border-0">
                      For Adoption
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6 space-y-2">
                  <h3 className="text-foreground">{similarPet.name}</h3>
                  <p className="text-muted-foreground">{similarPet.breed}</p>
                  <p className="text-sm text-muted-foreground">
                    {similarPet.age}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-foreground">Helpful Articles</h2>
            <Button
              variant="ghost"
              className="text-primary hover:text-primary/80"
            >
              View All
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedArticles.map((article) => (
              <Card
                key={article.id}
                className="group overflow-hidden rounded-3xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              >
                <div className="relative aspect-video bg-muted">
                  <ImageWithFallback
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-6 space-y-2">
                  <h3 className="text-foreground line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {article.readTime}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
