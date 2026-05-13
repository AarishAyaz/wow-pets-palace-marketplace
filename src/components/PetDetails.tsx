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
  ArrowRight,
  Navigation,
  Mail,
  User,
  Shield,
  Clock,
  Info,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Eye,
  ThumbsUp,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useRecommendations } from "@/hooks/useRecommendations";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { useEffect, useState, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { ProductCard } from "./ProductCard";
import { useNavigate } from "react-router-dom";

// Inject keyframes once
const shineKeyframes = `
@keyframes shine-sweep {
  0%   { transform: translateX(-120%) skewX(-15deg); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateX(220%) skewX(-15deg); opacity: 0; }
}
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes pulse-ring {
  0%   { transform: scale(1);   opacity: 0.6; }
  100% { transform: scale(1.6); opacity: 0; }
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

interface PetVideo {
  video_id: number;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string | null;
  duration_seconds: number;
  total_views: number;
  total_likes: number;
  published_at: string;
  tags: Tag[];
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

// ─── Video Player Card ───────────────────────────────────────────────────────
function VideoCard({
  video,
  isActive,
  onClick,
  onNext,
  onPrev,
}: {
  video: PetVideo;
  isActive: boolean;
  onClick: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(false);

  const videoSrc = `https://wowpetspalace.com/test/${video.video_url}`;
  const thumbSrc = video.thumbnail_url
    ? `https://wowpetspalace.com/test/${video.thumbnail_url}`
    : null;

  const formatDuration = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const formatCount = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    if (isActive) {
      video
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          setIsPlaying(false);
        });
    } else {
      video.pause();
      video.currentTime = 0;

      setIsPlaying(false);
      setProgress(0);
    }
  }, [isActive, video.video_id]);

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setProgress((v.currentTime / v.duration) * 100);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const togglePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      className="group relative cursor-pointer rounded-2xl overflow-hidden"
      style={{
        background: "hsl(var(--card))",
        boxShadow: isActive
          ? "0 0 0 2px hsl(var(--primary)), 0 20px 60px -10px hsl(var(--primary) / 0.25)"
          : "0 4px 24px -4px rgba(0,0,0,0.12)",
        transition: "box-shadow 0.3s ease, transform 0.3s ease",
        transform: isActive ? "scale(1.01)" : "scale(1)",
      }}
    >
      {/* Video / Poster area */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: "16/9", background: "#0a0a0a" }}
      >
        {/* Poster frame shown when not active */}
        {!isActive && thumbSrc && (
          <img
            src={thumbSrc}
            alt={video.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Dark overlay for poster */}
        {!isActive && (
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300" />
        )}

        {/* Video element */}
        <video
          ref={videoRef}
          src={videoSrc}
          muted={isMuted}
          loop
          playsInline
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="w-full h-full object-cover"
          style={{ display: isActive ? "block" : "none" }}
        />
        {/* Professional Media Controls */}
        {isActive && (
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
              showControls
                ? "opacity-100 bg-black/20"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Previous */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPrev?.();
                }}
                className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:scale-110 hover:bg-black/80 transition-all duration-200 shadow-xl"
              >
                <SkipBack className="w-5 h-5 fill-white" />
              </button>

              {/* Play Pause */}
              <button
                onClick={togglePlayPause}
                className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-all duration-200 shadow-2xl"
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 fill-black" />
                ) : (
                  <Play className="w-7 h-7 fill-black ml-1" />
                )}
              </button>

              {/* Next */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNext?.();
                }}
                className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:scale-110 hover:bg-black/80 transition-all duration-200 shadow-xl"
              >
                <SkipForward className="w-5 h-5 fill-white" />
              </button>
            </div>
          </div>
        )}

        {/* Play button (shown when not active) */}
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Pulsing ring */}
              <span
                className="absolute inset-0 rounded-full bg-white/40"
                style={{ animation: "pulse-ring 1.4s ease-out infinite" }}
              />
              <div className="relative w-14 h-14 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-200">
                <Play
                  className="w-6 h-6 text-gray-900 ml-0.5"
                  fill="currentColor"
                />
              </div>
            </div>
          </div>
        )}

        {/* Duration badge */}
        <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-mono px-2 py-0.5 rounded-md">
          {formatDuration(video.duration_seconds)}
        </div>

        {/* Mute toggle (only when playing) */}
        {isActive && (
          <button
            onClick={toggleMute}
            className="absolute left-4 bottom-4 z-30 w-9 h-9 rounded-full bg-black/70 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/90 transition-all duration-200 shadow-lg"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Progress bar */}
        {isActive && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
            <div
              className="h-full bg-primary transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Info footer */}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h4 className="font-semibold text-sm text-foreground leading-snug line-clamp-1 flex-1">
            {video.title}
          </h4>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-primary/30 hover:bg-primary/10 h-8 w-8"
            >
              <Heart className="w-4 h-4 text-primary" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-primary/30 hover:bg-primary/10 h-8 w-8"
            >
              <Share2 className="w-4 h-4 text-primary" />
            </Button>
          </div>
        </div>

        {video.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {video.description}
          </p>
        )}
        <div className="flex items-center gap-3 pt-1">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Eye className="w-3 h-3" />
            {formatCount(video.total_views)}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <ThumbsUp className="w-3 h-3" />
            {formatCount(video.total_likes)}
          </span>
          <span className="ml-auto text-xs text-muted-foreground">
            {new Date(video.published_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export function PetDetailPage() {
  const { slug } = useParams();
  const [pet, setPet] = useState<Pet | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);

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
                (img: any) => `https://wowpetspalace.com/test/${img.image_url}`,
              ) || [],
            breed: apiPet.breed || "Unknown",
            category: apiPet.category || "Pet",
            gender: apiPet.gender === "male" ? "Male" : "Female",
            size: apiPet.size_category
              ? apiPet.size_category.charAt(0).toUpperCase() +
                apiPet.size_category.slice(1)
              : "Medium",
            activityLevel: apiPet.activity_level
              ? apiPet.activity_level.charAt(0).toUpperCase() +
                apiPet.activity_level.slice(1)
              : "Medium",
            description: apiPet.description || "No description available",
            dateOfBirth: apiPet.date_of_birth || "2023-01-01",
            color: apiPet.color || "Unknown",
            temperament: apiPet.temperament ? [apiPet.temperament] : [],
            microchipped: Boolean(apiPet.microchipped),
            microchipId: apiPet.microchip_id || undefined,
            neutered: Boolean(apiPet.neutered),
            tags:
              apiPet.tags?.map((tag: any) => ({
                id: tag.id,
                name: tag.name,
              })) || [],
            price: apiPet.price || 0,
            location: {
              country: apiPet.country || "Pakistan",
              address: apiPet.address || "Unknown location",
              latitude: apiPet.latitude || 0,
              longitude: apiPet.longitude || 0,
            },
            owner: {
              owner_first_name: apiPet.owner_first_name,
              owner_last_name: apiPet.owner_last_name,
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

  const tagIds = useMemo(() => pet?.tags?.map((t) => t.id) ?? [], [pet?.id]);

  const recommendationPayload = useMemo(
    () => ({
      tag_ids: tagIds,
      is_product: true,
      is_article: true,
      is_breed: true,
      is_pets: true,
      is_video: true,
      limit: 2,
    }),
    [tagIds],
  );

  const { data, loading } = useRecommendations(recommendationPayload);

  const pets = data?.pets || [];
  const products = data?.products || [];
  const articles = data?.articles || [];
  const breeds = data?.breeds || [];
  const videos: PetVideo[] = data?.videos || [];

  useEffect(() => {
    if (videos.length > 0 && !selectedVideoId) {
      setSelectedVideoId(videos[0].video_id);
    }
  }, [videos, selectedVideoId]);
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

  const goToNextVideo = () => {
    if (!videos.length) return;

    const currentIndex = videos.findIndex(
      (v) => v.video_id === selectedVideoId,
    );

    const nextIndex = (currentIndex + 1) % videos.length;

    setSelectedVideoId(videos[nextIndex].video_id);
  };

  const goToPrevVideo = () => {
    if (!videos.length) return;

    const currentIndex = videos.findIndex(
      (v) => v.video_id === selectedVideoId,
    );

    const prevIndex = (currentIndex - 1 + videos.length) % videos.length;

    setSelectedVideoId(videos[prevIndex].video_id);
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

                <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2 z-30">
                  {getStatusBadge()}
                  {pet.breed && (
                    <Badge className="ml-auto bg-background/95 backdrop-blur-sm text-foreground border border-border/50 text-sm font-medium px-3 py-1.5 shadow-md">
                      {pet.breed}
                    </Badge>
                  )}
                </div>

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
            {/* ── VIDEOS SECTION ─────────────────────────────────────────────────────── */}
            {/* {videos.length > 0 && (
          <div className="mt-8"> */}
            {/* Header */}
            {/* <div className="flex items-end justify-between mb-4 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary/70">
                  Watch &amp; Learn
                </p>
                <h2 className="text-xl font-bold text-foreground">
                  Related{" "}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Videos
                  </span>
                </h2>
                <p className="text-muted-foreground text-sm">
                  Curated clips to help you learn more about {pet.name}
                </p>
              </div>
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {videos.length} video{videos.length !== 1 ? "s" : ""}
              </span>
            </div> */}

            {/* Grid — 1 col mobile, 2 col md, 3 col lg */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <VideoCard
                  key={video.video_id}
                  video={video}
                  isActive={activeVideoId === video.video_id}
                  onClick={() =>
                    setActiveVideoId(
                      activeVideoId === video.video_id ? null : video.video_id
                    )
                  }
                />
              ))}
            </div> */}

            {/* Subtle bottom rule */}
            {/* <Separator className="mt-6" />
          </div>
        )} */}
          </div>

          {/* Right Column - Pet Info */}
          <div className="flex flex-col space-y-4 lg:space-y-8">
            <div className="space-y-3">
              <h1 className="text-2xl lg:text-4xl font-bold text-foreground leading-tight">
                {pet.name}
              </h1>

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
                  <span className="text-foreground">{pet.owner.email}</span>
                </div>
              </div>
            </div>

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
        {/* ── VIDEOS SECTION ─────────────────────────────────────────────────────── */}
        {videos.length > 0 && (
          <div className="mt-16 mb-12">
            <div className="mb-6">
              <div className="flex items-end justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary/70">
                    Watch &amp; Learn
                  </p>
                  <h2 className="text-2xl font-bold text-foreground">
                    Related{" "}
                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      Videos
                    </span>
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Watch helpful videos about {pet.breed} care and training
                  </p>
                </div>
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {videos.length} video{videos.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Video List - Left Side */}
              <div className="lg:col-span-1">
                <Card className="rounded-3xl border-0 shadow-lg overflow-hidden">
                  <div className="h-[600px] overflow-y-auto">
                    <div className="divide-y divide-border">
                      {videos.map((video) => {
                        const isActive = selectedVideoId === video.video_id;
                        const thumbSrc = video.thumbnail_url
                          ? `https://wowpetspalace.com/test/${video.thumbnail_url}`
                          : null;
                        const duration = `${Math.floor(video.duration_seconds / 60)}:${String(
                          video.duration_seconds % 60,
                        ).padStart(2, "0")}`;

                        return (
                          <button
                            key={video.video_id}
                            onClick={() => setSelectedVideoId(video.video_id)}
                            className={`w-full p-4 flex gap-3 hover:bg-primary/5 transition-colors duration-200 text-left ${
                              isActive ? "bg-primary/10" : ""
                            }`}
                          >
                            {/* Thumbnail */}
                            <div className="relative flex-shrink-0 w-40 aspect-video rounded-2xl overflow-hidden bg-muted">
                              {thumbSrc ? (
                                <img
                                  src={thumbSrc}
                                  alt={video.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      "/fallback.jpg";
                                  }}
                                />
                              ) : (
                                <video
                                  src={`https://wowpetspalace.com/test/${video.video_url}`}
                                  className="w-full h-full object-cover"
                                  muted
                                  playsInline
                                  preload="metadata"
                                />
                              )}
                              <div className="absolute bottom-2 right-2 z-50 bg-black/90 text-white text-[11px] font-semibold px-2 py-1 rounded-md leading-none shadow-xl">
                                {duration}
                              </div>
                              {isActive && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                  <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center">
                                    <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Video Info */}
                            <div className="flex flex-1 flex-col space-y-4 min-w-0">
                              <h4 className="text-sm font-medium text-foreground line-clamp-2 mb-1">
                                {video.title}
                              </h4>

                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Eye className="w-3 h-3" />
                                <span>
                                  {video.total_views >= 1000
                                    ? `${(video.total_views / 1000).toFixed(1)}k`
                                    : video.total_views}
                                </span>
                                <span>•</span>
                                <span>
                                  {new Date(
                                    video.published_at,
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Video Player - Right Side */}
              <div className="lg:col-span-2">
                {(() => {
                  const activeVideo =
                    videos.find((v) => v.video_id === selectedVideoId) ||
                    videos[0];
                  const thumbSrc = activeVideo.thumbnail_url
                    ? `https://wowpetspalace.com/test/${activeVideo.thumbnail_url}`
                    : null;

                  return (
                    <Card className="rounded-3xl border-0 shadow-xl overflow-hidden">
                      <VideoCard
                        video={activeVideo}
                        isActive={selectedVideoId === activeVideo.video_id}
                        onClick={() => {}}
                        onNext={goToNextVideo}
                        onPrev={goToPrevVideo}
                      />
                      {/* <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{activeVideo.title}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Eye className="w-4 h-4" />
                      <span>{activeVideo.total_views >= 1000 ? `${(activeVideo.total_views / 1000).toFixed(1)}k` : activeVideo.total_views} views</span>
                      <span>•</span>
                      <ThumbsUp className="w-4 h-4" />
                      <span>{activeVideo.total_likes >= 1000 ? `${(activeVideo.total_likes / 1000).toFixed(1)}k` : activeVideo.total_likes}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="rounded-full border-primary/30 hover:bg-primary/10">
                      <Heart className="w-4 h-4 text-primary" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full border-primary/30 hover:bg-primary/10" onClick={handleShare}>
                      <Share2 className="w-4 h-4 text-primary" />
                    </Button>
                  </div>
                </div>

                <Separator />

                {activeVideo.description && (
                  <div className="bg-muted/50 rounded-2xl p-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {activeVideo.description}
                    </p>
                  </div>
                )}
              </CardContent> */}
                    </Card>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Location Section */}
        <div className="mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-6">
            <div className="flex flex-col gap-4 h-full">
              <h2 className="text-2xl font-bold">Location</h2>
              <Card className="border-border/50 overflow-hidden rounded-xl shadow-md">
                <div className="w-full h-96">
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

            {products?.length > 0 && (
              <div className="flex flex-col gap-4 h-full">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Recommended Products</h2>
                  <span className="text-sm text-muted-foreground">
                    {products.length} item{products.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div
                  className="flex-1 min-h-0 overflow-y-auto pr-1 h-[530px]"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "hsl(var(--border)) transparent",
                  }}
                >
                  <div className="grid grid-cols-2 gap-3">
                    {products.map((product: any) => (
                      <div key={product.id} className="flex flex-col">
                        <ProductCard
                          id={product.id}
                          slug={product.slug}
                          name={product.name}
                          image={
                            product.featured_image
                              ? `https://wowpetspalace.com/test/${product.featured_image}`
                              : "/fallback.jpg"
                          }
                          price={product.original_price ?? 0}
                          originalPrice={product.unit_price ?? undefined}
                          discountPercentage={product.is_discount ?? 0}
                          rating={product.overall_rating ?? 0}
                          reviewsCount={null}
                          category={product.tags?.[0]?.name}
                          shipping_cost={product.shipping_cost ?? 0}
                          shop_id={product.shop_id}
                          shopName={product.shop_name ?? ""}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {(!products || products.length === 0) && <div />}
          </div>
        </div>

        {/* Related Pets */}
        {pets?.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Related Pets</h2>
              <span className="text-sm text-muted-foreground">
                {pets.length} pet{pets.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((item: any) => {
                const normalize = (str: string) =>
                  str?.toLowerCase().replace(/\s+/g, "").trim();
                const getStatusConfig = (type: string, price: number) => {
                  switch (normalize(type)) {
                    case "adoption":
                      return {
                        label: "Adopt Me",
                        buttonColor:
                          "bg-yellow-500 hover:bg-yellow-600 text-white",
                        badgeColor: "bg-yellow-500 text-white",
                      };
                    case "sale":
                      return {
                        label: `$${price}`,
                        buttonColor:
                          "bg-green-500 hover:bg-green-600 text-white",
                        badgeColor: "bg-green-500 text-white",
                      };
                    case "lost":
                      return {
                        label: "Lost",
                        buttonColor: "bg-red-600 hover:bg-red-700 text-white",
                        badgeColor: "bg-red-600 text-white",
                      };
                    default:
                      return {
                        label: type,
                        buttonColor: "bg-gray-500 text-white",
                        badgeColor: "bg-gray-500 text-white",
                      };
                  }
                };
                const statusConfig = getStatusConfig(
                  item.type || item.current_status || "adoption",
                  item.price ?? 0,
                );
                const petImage = item.image
                  ? `https://wowpetspalace.com/test/${item.image}`
                  : item.images?.length
                    ? `https://wowpetspalace.com/test/${item.images[0].image_url}`
                    : "/fallback.jpg";

                return (
                  <Card
                    key={item.pet_id}
                    className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 overflow-hidden"
                    onClick={() =>
                      navigate(`/pet/${item.slug}?listing_id=${item.pet_id}`)
                    }
                  >
                    <div className="relative">
                      <img
                        src={petImage}
                        alt={item.pet_name}
                        loading="lazy"
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/fallback.jpg";
                        }}
                      />
                      <Badge
                        className={`absolute top-3 right-3 border-0 ${statusConfig.badgeColor}`}
                      >
                        {(
                          item.type ||
                          item.current_status ||
                          "adoption"
                        ).toUpperCase()}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-2 text-foreground">
                        {item.pet_name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.breed || item.breed_id || "Unknown Breed"}
                      </p>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {item.description || "No description available."}
                      </p>
                      <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        {item.address || "Location not available"}
                      </p>
                      <Button
                        className={`rounded-full px-6 ${statusConfig.buttonColor}`}
                        onClick={(e: any) => e.stopPropagation()}
                      >
                        {statusConfig.label}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Related Breeds */}
        {breeds?.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-foreground">
                  Related{" "}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Breeds
                  </span>
                </h2>
                <p className="text-muted-foreground">
                  Learn about breeds related to {pet.name}
                </p>
              </div>
              <span className="text-sm text-muted-foreground">
                {breeds.length} breed{breeds.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {breeds.map((breed: any) => (
                <Card
                  key={breed.id}
                  className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 bg-card overflow-hidden"
                  onClick={() => navigate(`/breeds/${breed.slug}`)}
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      {breed.image ? (
                        <img
                          src={
                            breed.image.startsWith("http")
                              ? breed.image
                              : `https://www.wowpetspalace.com/test/${breed.image}`
                          }
                          alt={breed.title || breed.breed_title}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/fallback.jpg";
                          }}
                        />
                      ) : (
                        <div className="w-full h-48 bg-muted flex items-center justify-center">
                          <span className="text-muted-foreground text-sm">
                            No image available
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-6 space-y-3">
                      <h3 className="font-semibold text-lg text-foreground">
                        {breed.title || breed.breed_title}
                      </h3>
                      <div className="space-y-2">
                        {(breed.category_title || breed.categoryid) && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Category:
                            </span>
                            <span className="text-foreground font-medium">
                              {breed.category_title ||
                                `Category ${breed.categoryid}`}
                            </span>
                          </div>
                        )}
                        {breed.lifespan && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Lifespan:
                            </span>
                            <span className="text-foreground font-medium">
                              {breed.lifespan}
                            </span>
                          </div>
                        )}
                        {breed.weight && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Weight:
                            </span>
                            <span className="text-foreground font-medium">
                              {breed.weight}
                            </span>
                          </div>
                        )}
                        {breed.shortDescription && (
                          <p className="text-sm text-muted-foreground line-clamp-2 pt-1">
                            {breed.shortDescription}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        className="w-full text-primary hover:text-primary hover:bg-primary/10 group/btn"
                        onClick={(e: any) => e.stopPropagation()}
                      >
                        Learn More{" "}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Related Articles */}
        {articles?.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-foreground">
                  Helpful{" "}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Articles
                  </span>
                </h2>
                <p className="text-muted-foreground">
                  Expert advice and tips related to {pet.name}
                </p>
              </div>
              <span className="text-sm text-muted-foreground">
                {articles.length} article{articles.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article: any) => {
                const getCategoryColor = (category: string) => {
                  const colors: { [key: string]: string } = {
                    "Knowledge-Hub": "bg-green-100 text-green-800",
                    "Pet-Adoption-&-Rescue": "bg-blue-100 text-blue-800",
                    "Pet-Tips-and-Advice": "bg-purple-100 text-purple-800",
                    Dog: "bg-red-100 text-red-800",
                  };
                  return colors[category] || "bg-gray-100 text-gray-800";
                };
                const articleImage = article.image
                  ? article.image.startsWith("http")
                    ? article.image
                    : `https://www.wowpetspalace.com/dashboard/${article.image}`
                  : "/fallback.jpg";
                const categoryName =
                  article.categoryName || article.category_name || "";

                return (
                  <Card
                    key={article.id || article.article_id}
                    className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 bg-card overflow-hidden"
                    onClick={() => navigate(`/articles/${article.slug}`)}
                  >
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={articleImage}
                          alt={article.title}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/fallback.jpg";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {categoryName && (
                          <div className="absolute top-4 left-4">
                            <Badge
                              className={`${getCategoryColor(categoryName)} border-0`}
                            >
                              {categoryName}
                            </Badge>
                          </div>
                        )}
                      </div>
                      <div className="p-6 space-y-4">
                        <h3 className="font-semibold text-lg text-foreground leading-tight line-clamp-2">
                          {article.title}
                        </h3>
                        {(article.short_description || article.description) && (
                          <p
                            className="text-muted-foreground text-sm leading-relaxed line-clamp-3"
                            dangerouslySetInnerHTML={{
                              __html:
                                article.short_description ||
                                article.description ||
                                "",
                            }}
                          />
                        )}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <User className="w-3 h-3" />
                              <span>WowPetsPalace</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>~5 min read</span>
                            </div>
                          </div>
                          {article.time && (
                            <span>
                              {new Date(article.time).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          className="w-full text-primary hover:text-primary hover:bg-primary/10 group/btn"
                          onClick={(e: any) => e.stopPropagation()}
                        >
                          Read Article{" "}
                          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
