import { ArrowRight, Heart, Star } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { PetDetailPage } from "./PetDetails";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Item } from "@radix-ui/react-dropdown-menu";

type PetImage ={
  image_url: string;
}
type Pet={
  listing_id: number;
  pet_id: number;
  slug: string;
  pet_name: string;
  description: string;
  price: number;
  current_status: string;
  breed: string | null;
  address: string;
  images: PetImage[];
  type: string;
};

export function ContentFeed() {
  // const feedItems = [
  //   {
  //     id: 1,
  //     type: "adoption",
  //     image:
  //       "https://images.unsplash.com/photo-1754499265662-a1b9367c95f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwZ29sZGVuJTIwcmV0cmlldmVyJTIwZG9nfGVufDF8fHx8MTc1NzQxNDk0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  //     title: "Max - Golden Retriever",
  //     description: "3 years old • Male • Friendly and energetic",
  //     action: "Adopt Me",
  //     actionType: "adoption",
  //     location: "Happy Paws Shelter",
  //   },
  //   {
  //     id: 2,
  //     type: "product",
  //     image:
  //       "https://images.unsplash.com/photo-1676193866128-03a926df76ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjBmb29kJTIwZG9nJTIwa2liYmxlfGVufDF8fHx8MTc1NzQxNDk5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  //     title: "Premium Dog Food",
  //     description: "High-quality nutrition for adult dogs",
  //     price: "$29.99",
  //     action: "$29.99",
  //     actionType: "product",
  //     rating: 4.8,
  //   },
  //   {
  //     id: 3,
  //     type: "adoption",
  //     image:
  //       "https://images.unsplash.com/photo-1609854892250-72dab0fc9282?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwa2l0dGVuJTIwY2F0JTIwb3JhbmdlfGVufDF8fHx8MTc1NzQxNDk0NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  //     title: "Luna - Orange Tabby",
  //     description: "1 year old • Female • Playful and affectionate",
  //     action: "Adopt Me",
  //     actionType: "adoption",
  //     location: "Whiskers & Tails Rescue",
  //   },
  //   {
  //     id: 4,
  //     type: "product",
  //     image:
  //       "https://images.unsplash.com/photo-1535294435445-d7249524ef2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjB0b3lzJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzU3Mzg2NjAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  //     title: "Interactive Pet Toys Set",
  //     description: "Keep your pets entertained and active",
  //     price: "$19.99",
  //     action: "$19.99",
  //     actionType: "product",
  //     rating: 4.6,
  //   },
  //   {
  //     id: 5,
  //     type: "adoption",
  //     image:
  //       "https://images.unsplash.com/photo-1629598624490-609d11c95b63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwcHVwcHklMjBsYWJyYWRvcnxlbnwxfHx8fDE3NTc0MTQ5OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  //     title: "Buddy - Labrador Mix",
  //     description: "6 months old • Male • Gentle and curious",
  //     action: "Adopt Me",
  //     actionType: "adoption",
  //     location: "City Animal Shelter",
  //   },
  //   {
  //     id: 6,
  //     type: "article",
  //     image:
  //       "https://images.unsplash.com/photo-1754499265662-a1b9367c95f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwZ29sZGVuJTIwcmV0cmlldmVyJTIwZG9nfGVufDF8fHx8MTc1NzQxNDk0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  //     title: "Pet Care Tips for New Owners",
  //     description: "Essential guide for first-time pet parents",
  //     action: "Read More",
  //     actionType: "article",
  //     readTime: "5 min read",
  //   },
  // ];
  const navigate = useNavigate();

const [pets, setPets] = useState<Pet[]>([]);
const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await fetch(
          "https://wowpetspalace.com/test/pets/pet-listings",
        );
        const data = await res.json();

        if (data.success) {
          setPets(data.data.slice(0, 10)); // limit to 10
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  const getImage = (images:PetImage[]) => {
    if (!images?.length) return "/fallback.jpg";
    return `https://wowpetspalace.com/test/${images[0].image_url}`;
  };
const normalize = (str: string) =>
  str?.toLowerCase().replace(/\s+/g, "").trim();

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
  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8 text-foreground">
          Featured Pets & Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((item) => {
            const statusConfig = getStatusConfig(
              item.type,
              item.price,
            );

            return (
              <Card
                key={item.listing_id}
                className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 overflow-hidden"
                onClick={() => navigate(`/pet/${item.slug}`)}
              >
                <div className="relative">
                  <ImageWithFallback
                    src={getImage(item.images)}
                    alt={item.pet_name}
                    className="w-full h-48 object-cover"
                  />

           <Badge className={`absolute top-3 right-3 border-0 ${statusConfig.badgeColor}`}>
  {item.type.toUpperCase()}
</Badge>
                </div>

                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2 text-foreground">
                    {item.pet_name}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-2">
                    {item.breed || "Unknown Breed"}
                  </p>

                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  <p className="text-xs text-muted-foreground mb-4">
                    {item.address || "Location not available"}
                  </p>

                  <Button className={`rounded-full px-6 ${statusConfig.buttonColor}`}>
                    {statusConfig.label}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <div className="text-center mt-10">
          <Button
            variant="outline"
                        onClick={() => navigate("/pets")}

            size="lg"
            className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-6 rounded-full transition-all duration-300 cursor-pointer"
          >
            View All Pets
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
        </div>
      </div>
    </section>
  );
}
