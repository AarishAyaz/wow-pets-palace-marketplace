import { Search, Mic } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { useEffect, useState } from "react";
import axios from "axios";

interface Product {
  id: string;
  slug: string;
  name: string;
  featured_image: string;
  original_price: number;
  discountPercentage: number;
  rating: number;
  reviewsCount: number;
  categoryTitle: string;
}

interface Category {
  id: string;
  title: string;
  productCount: number;
}

interface Tag {
  id: number;
  name: string;
}

export function ProductsPage() {
  const baseUrl = "https://www.wowpetspalace.com/test/";
  const itemsPerPage = 12;

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  /* ---------------- Image Helper ---------------- */
  const getProductCardImage = (item: any) => {
    if (item.featured_image) return `${baseUrl}${item.featured_image}`;
    if (Array.isArray(item.images) && item.images.length > 0)
      return `${baseUrl}${item.images[0]}`;
    return "/placeholder-image.png";
  };

  /* ---------------- Fetch Products (Server Side Filtering) ---------------- */
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const params: any = {
        limit: itemsPerPage,
        page: currentPage,
      };

      // Category filter
      if (selectedCategory) {
        const selected = categories.find(
          (cat) => cat.title === selectedCategory
        );
        if (selected) params.cat_id = selected.id;
      }

      // Price filter
      if (minPrice !== null) params.min_price = minPrice;
      if (maxPrice !== null) params.max_price = maxPrice;

      // Tag filter
      if (selectedTags.length > 0) {
        params["search_tag[]"] = selectedTags;
      }

      // Search filter
      if (searchQuery) params.search = searchQuery;

      const { data } = await axios.get(
        "https://www.wowpetspalace.com/test/product/getProducts/1",
        { params }
      );

      const mapped = data.data.map((item: any) => ({
        id: item.id,
        slug: item.slug,
        name: item.name,
        featured_image: getProductCardImage(item),
        original_price: item.original_price,
        discountPercentage: item.discountPercentage ?? 0,
        rating: item.overall_rating ?? 0,
        reviewsCount: item.reviewsCount ?? 0,
        categoryTitle: item.categoryTitle,
      }));

      setProducts(mapped);

      // If backend returns total count, use it
      if (data.total) {
        setTotalPages(Math.ceil(data.total / itemsPerPage));
      }
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Fetch Categories ---------------- */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          "https://www.wowpetspalace.com/test/subCategory/getCountCategoryProduct"
        );

        const mapped = data.result.map((item: any) => ({
          id: item.category_id,
          title: item.category_name,
          productCount: item.product_count,
        }));

        setCategories(mapped);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    fetchCategories();
  }, []);

  /* ---------------- Fetch Tags ---------------- */
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const { data } = await axios.get(
          "https://www.wowpetspalace.com/test/shop/shopTags"
        );
        setTags(data);
      } catch (error) {
        console.error("Error fetching tags", error);
      }
    };

    fetchTags();
  }, []);

  /* ---------------- Reset Page When Filters Change ---------------- */
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, minPrice, maxPrice, selectedTags, searchQuery]);

  /* ---------------- Fetch Products When Dependencies Change ---------------- */
  useEffect(() => {
    fetchProducts();
  }, [
    currentPage,
    selectedCategory,
    minPrice,
    maxPrice,
    selectedTags,
    searchQuery,
    categories,
  ]);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">

        {/* Page Title */}
        <div className="text-center space-y-4 pt-8 pb-8">
          <h1 className="text-primary">Shop Pet Products</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Find the perfect food, toys, treats, and accessories for your pet.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search pet foods, toys, treats, accessories…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-12 py-6 rounded-full"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <Mic className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar */}
          <aside className="w-80 shrink-0 sm:w-full">
            <div className="bg-card rounded-xl border p-6 sticky top-24 flex flex-col gap-6">

              {/* Categories */}
              <div>
                <h3 className="font-semibold text-base mb-3">Categories</h3>
                <ScrollArea className="h-[220px] pr-2">
                  <ul className="space-y-2">
                    <li>
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-muted"
                      >
                        All Categories
                      </button>
                    </li>

                    {categories.map((category) => (
                      <li key={category.id}>
                        <button
                          onClick={() =>
                            setSelectedCategory(category.title)
                          }
                          className="w-full flex justify-between px-3 py-2 rounded-md text-sm font-medium hover:bg-muted"
                        >
                          <span>{category.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {category.productCount}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </div>

              {/* Price Filter */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Filter by Price</h4>
                <div className="flex gap-2 mb-3">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={minPrice ?? ""}
                    onChange={(e) =>
                      setMinPrice(
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={maxPrice ?? ""}
                    onChange={(e) =>
                      setMaxPrice(
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                  />
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setMinPrice(null);
                    setMaxPrice(null);
                  }}
                >
                  Clear Price
                </Button>
              </div>

              {/* Tags */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Filter by Tags</h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => {
                        if (selectedTags.includes(tag.id)) {
                          setSelectedTags(
                            selectedTags.filter((t) => t !== tag.id)
                          );
                        } else {
                          setSelectedTags([...selectedTags, tag.id]);
                        }
                      }}
                      className="px-3 py-1 rounded-full text-xs font-medium border hover:bg-muted"
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* Products */}
          <section className="flex-1">
            {loading ? (
              <p>Loading products...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    slug={product.slug}
                    name={product.name}
                    image={product.featured_image}
                    price={product.original_price}
                    originalPrice={product.original_price}
                    discountPercentage={product.discountPercentage}
                    rating={product.rating}
                    reviewsCount={product.reviewsCount}
                    category={product.categoryTitle}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center gap-4 mt-8">
              <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </Button>

              <span className="flex items-center">
                Page {currentPage} of {totalPages}
              </span>

              <Button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}