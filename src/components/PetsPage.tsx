import {
  Search,
  MapPin,
  Filter,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Heart,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LazyLoadImage } from "react-lazy-load-image-component";

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface PetImage {
  image_id: number;
  image_url: string;
  image_type: string;
  sort_order: number;
}

interface Pet {
  listing_id: number;
  pet_id: number;
  slug: string;
  pet_name: string;
  description: string;
  price: number;
  type: "adoption" | "sale" | "lost";
  current_status: string;
  breed: string | null;
  address: string;
  gender: string;
  size_category: string;
  activity_level: string;
  color: string;
  date_of_birth: string;
  category: string | null;
  images: PetImage[];
  tags: { id: number; name: string }[];
}

interface Category {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const BASE = "https://wowpetspalace.com/test";

const getImage = (images: PetImage[]) => {
  if (!images?.length) return "/fallback.jpg";
  return `${BASE}/${images[0].image_url}`;
};

const normalize = (s: string) => s?.toLowerCase().replace(/\s+/g, "").trim();

const getStatusConfig = (type: string, price: number) => {
    const t = normalize(type);

    switch (t) {
      case "adoption":
        return {
          label: "Adopt Me",
          buttonColor: "bg-yellow-500 hover:bg-yellow-600 text-white",
          badgeColor: "bg-yellow-500 text-white",
        };

      case "sale":
        return {
          label: `$${price}`,
          buttonColor: "bg-green-500 hover:bg-green-600 text-white",
          badgeColor: "bg-green-500 text-white",
        };

      case "lost":
        return {
          label: "Lost",
          buttonColor: "bg-red-600 hover:bg-red-700 text-white",
          badgeColor: "bg-red-600 text-white",
        };

      default:
        console.log("UNMATCHED TYPE:", type);
        return {
          label: type,
          buttonColor: "bg-gray-500 text-white",
          badgeColor: "bg-gray-500 text-white",
        };
    }
  };

const calculateAge = (dob: string) => {
  if (!dob) return null;
  const birth = new Date(dob);
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  if (months < 0) { years--; months += 12; }
  if (years > 0) return `${years}y ${months}m`;
  return `${months}mo`;
};

const ITEMS_PER_PAGE = 12;

/* ─── Pet Card ────────────────────────────────────────────────────────────── */
function PetCard({ item, onClick }: { item: Pet; onClick: () => void }) {
  const cfg = getStatusConfig(item.type, item.price);
  const age = calculateAge(item.date_of_birth);
  const [favorited, setFavorited] = useState(false);

  return (
    <Card
      onClick={onClick}
      className="group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl border-0 overflow-hidden bg-card rounded-xl"
      style={{ boxShadow: "0 2px 16px -4px rgba(0,0,0,0.08)" }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: 240 }}>
        <LazyLoadImage
  src={getImage(item.images)}
  alt={item.pet_name}
  effect="blur"
  wrapperClassName="w-full h-full"
  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
  onError={(e: any) => {
    e.target.src = "/fallback.jpg";
  }}
/>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Status badge top-left */}
        <Badge className={`absolute top-3 left-3 flex justify-center border-0 text-xs font-bold tracking-wide ${cfg.badgeColor}`}>
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${cfg.dot} mr-1.5`} />
          {item.type.toUpperCase()}
        </Badge>

        {/* Favorite button top-right */}
        <button
          onClick={(e) => { e.stopPropagation(); setFavorited(f => !f); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-md hover:scale-110 transition-transform"
        >
          <Heart className={`w-4 h-4 ${favorited ? "fill-rose-500 text-rose-500" : "text-gray-500"}`} />
        </button>

        {/* Age pill bottom-right */}
        {age && (
          <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2 py-0.5 rounded-full">
            {age}
          </span>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-base text-foreground leading-tight line-clamp-1">
            {item.pet_name}
          </h3>
          {item.gender && (
            <span className="text-xs text-muted-foreground shrink-0 capitalize">{item.gender}</span>
          )}
        </div>

        <p className="text-sm text-primary/80 font-medium mb-1">
          {item.breed || item.category || "Mixed Breed"}
        </p>

        <p className="text-muted-foreground text-xs mb-3 line-clamp-2 leading-relaxed">
          {item.description || "No description available."}
        </p>

        {/* Pills row */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {item.size_category && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
              {item.size_category}
            </span>
          )}
          {item.activity_level && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
              {item.activity_level} activity
            </span>
          )}
          {item.color && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
              {item.color}
            </span>
          )}
        </div>

        {/* Location */}
        <p className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="line-clamp-1">{item.address || "Location not available"}</span>
        </p>
          <div className="flex items-end justify-end">
             <Button
          className={`w-full rounded-xl text-sm font-semibold h-9 ${cfg.buttonColor}`}
          onClick={(e: any) => e.stopPropagation()}
        >
          {cfg.label}
        </Button>
          </div>
       
      </CardContent>
    </Card>
  );
}

/* ─── Skeleton ────────────────────────────────────────────────────────────── */
function PetCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border-0 bg-card animate-pulse" style={{ boxShadow: "0 2px 16px -4px rgba(0,0,0,0.08)" }}>
      <div className="bg-muted" style={{ height: 220 }} />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-muted rounded w-2/3" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-3 bg-muted rounded w-3/4" />
        <div className="h-9 bg-muted rounded-xl mt-4" />
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────────────── */
/* ─── Main Page ───────────────────────────────────────────────────────────── */
export function PetsPage() {
  const navigate = useNavigate();

  /* --- state --- */
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* --- debounce search --- */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  /* --- reset page on filter change --- */
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedStatus, selectedGenders, selectedSizes, selectedCategories, selectedTags, minPrice, maxPrice]);

 

  /* --- fetch tags --- */
  useEffect(() => {
    axios
      .get(`${BASE}/shop/shopTags`)
      .then(({ data }) => setTags(data || []))
      .catch(() => {});
  }, []);

 /* --- fetch pets --- */
const fetchPets = useCallback(async () => {
  try {
    setLoading(true);

    const params: Record<string, any> = {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    };

    // Search
    if (debouncedSearch.trim()) {
      params.query = debouncedSearch.trim();
    }

    // Listing Type
    if (selectedStatus.length === 1) {
      params.type = selectedStatus[0];
    }

    // Gender
    if (selectedGenders.length === 1) {
      params.gender = selectedGenders[0];
    }

    // Size
    if (selectedSizes.length === 1) {
      params.size_category = selectedSizes[0];
    }

    // Category
    if (selectedCategories.length === 1) {
      params.category_id = selectedCategories[0];
    }

    // Price
    if (minPrice !== null) {
      params.min_price = minPrice;
    }

    if (maxPrice !== null) {
      params.max_price = maxPrice;
    }

    const { data } = await axios.get(
      `${BASE}/pets/pet-listings`,
      { params }
    );

    if (data.success) {
      setPets(data.data || []);
      setTotalCount(data.total || 0);

      setTotalPages(
        data.totalPages ||
        Math.ceil((data.total || 0) / ITEMS_PER_PAGE) ||
        1
      );
    } else {
      setPets([]);
      setTotalCount(0);
      setTotalPages(1);
    }
  } catch (error) {
    console.error("Fetch pets error:", error);

    setPets([]);
    setTotalCount(0);
    setTotalPages(1);
  } finally {
    setLoading(false);
  }
}, [
  currentPage,
  debouncedSearch,
  selectedStatus,
  selectedGenders,
  selectedSizes,
  selectedCategories,
  minPrice,
  maxPrice,
]);
  useEffect(() => { fetchPets(); }, [fetchPets]);

  /* --- filter helpers --- */
  const toggleItem = <T,>(list: T[], setList: (v: T[]) => void, val: T) => {
    setList(list.includes(val) ? list.filter(x => x !== val) : [...list, val]);
  };

  const clearAll = () => {
    setSelectedStatus([]);
    setSelectedGenders([]);
    setSelectedSizes([]);
    setSelectedTags([]);
    setMinPrice(null);
    setMaxPrice(null);
    setSearchQuery("");
  };

  const activeFilterCount =
    selectedStatus.length + selectedGenders.length + selectedSizes.length +
    selectedCategories.length + selectedTags.length +
    (minPrice !== null ? 1 : 0) + (maxPrice !== null ? 1 : 0);

  /* --- filter pill button --- */
  const FilterPill = ({
    label,
    active,
    onClick,
  }: { label: string; active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150 ${
        active
          ? "bg-primary text-primary-foreground border-primary shadow-sm"
          : "hover:bg-muted border-border"
      }`}
    >
      {label}
    </button>
  );

  /* --- sidebar content (shared for desktop + mobile drawer) --- */
  const SidebarContent = () => (
    <div className="flex flex-col gap-6">
      {/* Status */}
      <div>
        <h4 className="font-bold text-sm mb-2 text-foreground">Listing Type</h4>
        <div className="flex flex-wrap gap-2">
          {["adoption", "sale", "lost"].map(s => (
            <FilterPill
              key={s}
              label={s.charAt(0).toUpperCase() + s.slice(1)}
              active={selectedStatus.includes(s)}
              onClick={() => toggleItem(selectedStatus, setSelectedStatus, s)}
            />
          ))}
        </div>
      </div>

      {/* Gender */}
      <div>
        <h4 className="font-bold text-sm mb-2 text-foreground">Gender</h4>
        <div className="flex flex-wrap gap-2">
          {["male", "female"].map(g => (
            <FilterPill
              key={g}
              label={g.charAt(0).toUpperCase() + g.slice(1)}
              active={selectedGenders.includes(g)}
              onClick={() => toggleItem(selectedGenders, setSelectedGenders, g)}
            />
          ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <h4 className="font-bold text-sm mb-2 text-foreground">Size</h4>
        <div className="flex flex-wrap gap-2">
          {["small", "medium", "large", "giant"].map(s => (
            <FilterPill
              key={s}
              label={s.charAt(0).toUpperCase() + s.slice(1)}
              active={selectedSizes.includes(s)}
              onClick={() => toggleItem(selectedSizes, setSelectedSizes, s)}
            />
          ))}
        </div>
      </div>

      {/* Price (for sale listings) */}
      <div>
        <h4 className="font-bold text-sm mb-2 text-foreground">Price Range</h4>
        <div className="flex gap-2 mb-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice ?? ""}
            onChange={e => setMinPrice(e.target.value === "" ? null : Number(e.target.value))}
            className="h-8 text-xs"
          />
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice ?? ""}
            onChange={e => setMaxPrice(e.target.value === "" ? null : Number(e.target.value))}
            className="h-8 text-xs"
          />
        </div>
        <button
          onClick={() => { setMinPrice(null); setMaxPrice(null); }}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Clear price
        </button>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div>
          <h4 className="font-bold text-sm mb-2 text-foreground">Tags</h4>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {tags.map(tag => (
              <FilterPill
                key={tag.id}
                label={tag.name}
                active={selectedTags.includes(tag.id)}
                onClick={() => toggleItem(selectedTags, setSelectedTags, tag.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2 pt-2">
        <Button className="w-full" onClick={() => { fetchPets(); setSidebarOpen(false); }}>
          Apply Filters
        </Button>
        <Button variant="outline" className="w-full" onClick={clearAll}>
          Reset All
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">

        {/* ── Hero header ─────────────────────────────────────────── */}
        <div className="text-center space-y-4 pt-8 lg:pt-10 pb-8 lg:pb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary/70">
            Find your companion
          </p>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
            Pet{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Listings
            </span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm leading-relaxed">
            Browse pets available for adoption, sale, or help reunite lost animals
            with their families.
          </p>
        </div>

        {/* ── Search bar ──────────────────────────────────────────── */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, breed, location…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 rounded-full text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Filter Toggle Button (Hidden on lg layout) */}
        <div className="flex hidden sm:block items-center justify-end mb-4">
          <Button
            variant="outline"
            onClick={() => setSidebarOpen(prev => !prev)}
            className="h-10 px-4 rounded-xl gap-2 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
            {activeFilterCount > 0 && (
              <span className="flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                sidebarOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
        </div>

        {/* Mobile Collapsible Dropdown Filters Container */}
        {sidebarOpen && (
          <div className="lg:hidden mb-6 animate-in slide-in-from-top-2 duration-300">
            <div className="bg-card border rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-base">Filters</h3>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <SidebarContent />
            </div>
          </div>
        )}

        {/* ── Main Layout Wrapper (Flex-col on mobile, flex-row on desktop) ── */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Desktop Sidebar Layout (Hidden on mobile/tablet, always visible on large screen laptops) */}
          <aside className="sm:hidden w-80 shrink-0">
            <div className="bg-card rounded-xl border p-6 sticky top-24 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-lg">Filters</h3>
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <SidebarContent />
            </div>
          </aside>

          {/* ── Products Grid Section (Expands dynamically next to desktop sidebar) ── */}
          <section className="flex-1">

            {/* Count + active filters bar */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-muted-foreground">
                {loading ? "Loading…" : totalCount > 0 ? `${totalCount} pets found` : "0 pets found"}
              </p>
              {activeFilterCount > 0 && (
                <div className="hidden sm:flex items-center gap-2 flex-wrap justify-end">
                  {selectedStatus.map(s => (
                    <span key={s} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium capitalize">
                      {s}
                      <button onClick={() => toggleItem(selectedStatus, setSelectedStatus, s)}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                  {selectedGenders.map(g => (
                    <span key={g} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium capitalize">
                      {g}
                      <button onClick={() => toggleItem(selectedGenders, setSelectedGenders, g)}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                  {selectedSizes.map(s => (
                    <span key={s} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium capitalize">
                      {s}
                      <button onClick={() => toggleItem(selectedSizes, setSelectedSizes, s)}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Content Display (Skeletons / Empty / Cards Grid) */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                  <PetCardSkeleton key={i} />
                ))}
              </div>
            ) : pets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-1">No pets found</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Try adjusting your filters or search query.
                </p>
                <Button variant="outline" onClick={clearAll}>Clear all filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">    
                {pets.map(pet => (
                  <PetCard
                    key={pet.listing_id}
                    item={pet}
                    onClick={() => navigate(`/pet/${pet.slug}?listing_id=${pet.pet_id}`)}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="w-9 h-9 rounded-xl"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                {/* Page numbers items */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page: number;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                          page === currentPage
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "hover:bg-muted text-foreground"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="w-9 h-9 rounded-xl"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Page info block */}
            {!loading && pets.length > 0 && (
              <p className="text-center text-xs text-muted-foreground mt-8">
                Page {currentPage} of {totalPages} · {totalCount} total pets
              </p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}