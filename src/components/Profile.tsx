import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Package,
  ShoppingBag,
  Star,
  Heart,
  Camera,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";

/* ───────── FIELD ───────── */
function Field({
  label,
  icon: Icon,
  ...props
}: any) {
  return (
    <div className="space-y-2 w-full">
      
      {/* Label */}
      <label className="text-sm font-medium text-foreground">
        {label}
      </label>

      {/* Input wrapper */}
      <div className="relative flex items-center">

        {Icon && (
          <Icon className="absolute left-4 w-4 h-4 text-muted-foreground pointer-events-none" />
        )}

        <Input
          {...props}
          className={`
            h-12 w-full rounded-xl border-border
            ${Icon ? "!pl-11" : "!pl-4"}
            pr-4
            focus-visible:ring-2 focus-visible:ring-primary/30
            transition-all
          `}
        />
      </div>
    </div>
  );
}

/* ───────── MAIN ───────── */
export default function ProfilePage() {
  const { user, setUser } = useAuth();

  const [toast, setToast] = useState("");

  const [profile, setProfile] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phoneNumber || "",
  });

  const [billing, setBilling] = useState({
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const [shipping, setShipping] = useState({
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const save = (type: string) => {
    const updatedUser = { ...user, profile, billing, shipping };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setToast(`${type} updated successfully`);
    setTimeout(() => setToast(""), 2500);
  };

  const initials =
    `${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}`.toUpperCase() ||
    "U";

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold">My Account</h1>
          <p className="text-muted-foreground text-sm">
            Manage your personal details, addresses and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">

          {/* SIDEBAR */}
          <Card className="h-fit sticky top-24 shadow-sm">
            <CardContent className="p-6 flex flex-col items-center gap-5">

              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user?.user_profile_photo} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full">
                </button>
              </div>

              <div className="text-center">
                <h2 className="font-semibold text-lg">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {profile.email}
                </p>
                <Badge className="mt-4 inline-block">Active User</Badge>
              </div>

              <Separator />

              {/* Stats */}
              {/* <div className="grid grid-cols-3 gap-3 w-full text-center">
                <div>
                  <ShoppingBag className="mx-auto mb-1 w-4 h-4" />
                  <p className="text-sm font-semibold">12</p>
                  <p className="text-xs text-muted-foreground">Orders</p>
                </div>
                <div>
                  <Heart className="mx-auto mb-1 w-4 h-4" />
                  <p className="text-sm font-semibold">4</p>
                  <p className="text-xs text-muted-foreground">Saved</p>
                </div>
                <div>
                  <Star className="mx-auto mb-1 w-4 h-4" />
                  <p className="text-sm font-semibold">7</p>
                  <p className="text-xs text-muted-foreground">Reviews</p>
                </div>
              </div> */}
            </CardContent>
          </Card>

          {/* MAIN CONTENT */}
          <div className="space-y-8">

            {/* PROFILE */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-lg">Personal Information</h3>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <Field label="First Name"  value={profile.firstName}
                  onChange={(e: any) => setProfile(p => ({ ...p, firstName: e.target.value }))} />

                <Field label="Last Name"  value={profile.lastName}
                  onChange={(e: any) => setProfile(p => ({ ...p, lastName: e.target.value }))} />

                <Field label="Email"  value={profile.email} disabled />

                <Field label="Phone"  value={profile.phone}
                  onChange={(e: any) => setProfile(p => ({ ...p, phone: e.target.value }))} />

                <div className="md:col-span-2 flex justify-end gap-3">
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={() => save("Profile")}>Save</Button>
                </div>
              </CardContent>
            </Card>

            {/* BILLING */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-lg">Billing Address</h3>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <Field label="Address" icon={MapPin} value={billing.address}
                  onChange={(e: any) => setBilling(b => ({ ...b, address: e.target.value }))} />

                <Field label="City" value={billing.city}
                  onChange={(e: any) => setBilling(b => ({ ...b, city: e.target.value }))} />

                <Field label="State" value={billing.state}
                  onChange={(e: any) => setBilling(b => ({ ...b, state: e.target.value }))} />

                <Field label="ZIP" value={billing.zip}
                  onChange={(e: any) => setBilling(b => ({ ...b, zip: e.target.value }))} />

                <Field label="Country" value={billing.country}
                  onChange={(e: any) => setBilling(b => ({ ...b, country: e.target.value }))} />

                <div className="md:col-span-2 flex justify-end gap-3">
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={() => save("Billing")}>Save</Button>
                </div>
              </CardContent>
            </Card>

            {/* SHIPPING */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-lg">Shipping Address</h3>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <Field label="Address" icon={MapPin} value={shipping.address}
                  onChange={(e: any) => setShipping(s => ({ ...s, address: e.target.value }))} />

                <Field label="City" value={shipping.city}
                  onChange={(e: any) => setShipping(s => ({ ...s, city: e.target.value }))} />

                <Field label="State" value={shipping.state}
                  onChange={(e: any) => setShipping(s => ({ ...s, state: e.target.value }))} />

                <Field label="ZIP" value={shipping.zip}
                  onChange={(e: any) => setShipping(s => ({ ...s, zip: e.target.value }))} />

                <Field label="Country" value={shipping.country}
                  onChange={(e: any) => setShipping(s => ({ ...s, country: e.target.value }))} />

                <div className="md:col-span-2 flex justify-end gap-3">
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={() => save("Shipping")}>Save</Button>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-black text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
          <Check className="w-4 h-4 text-green-400" />
          {toast}
        </div>
      )}
    </div>
  );
}