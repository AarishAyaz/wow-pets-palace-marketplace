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
  ChevronRight,
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

/* ─── Types ─────────────────────────────────────────────── */
type Tab = "profile" | "billing" | "shipping";

/* ─── Stat card ─────────────────────────────────────────── */
function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/50 border border-border/50 flex-1 min-w-[80px]">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-xl font-bold text-foreground">{value}</span>
      <span className="text-xs text-muted-foreground text-center leading-tight">{label}</span>
    </div>
  );
}

/* ─── Nav item ───────────────────────────────────────────── */
function NavItem({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 group
        ${active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "hover:bg-muted text-muted-foreground hover:text-foreground"
        }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span>{label}</span>
      <ChevronRight
        className={`w-4 h-4 ml-auto transition-transform duration-150 ${active ? "opacity-70" : "opacity-0 group-hover:opacity-40"}`}
      />
    </button>
  );
}

/* ─── Form field ─────────────────────────────────────────── */
function Field({
  label,
  icon: Icon,
  type = "text",
  placeholder,
  value,
  disabled,
  onChange,
}: {
  label: string;
  icon?: React.ElementType;
  type?: string;
  placeholder?: string;
  value: string;
  disabled?: boolean;
  onChange?: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
        )}
        <Input
          type={type}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          className={`${Icon ? "pl-9" : ""} bg-muted/30 border-border/60 focus-visible:ring-primary/30 transition-all`}
        />
      </div>
    </div>
  );
}

/* ─── Toast ──────────────────────────────────────────────── */
function SaveToast({ visible }: { visible: boolean }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-foreground text-background px-4 py-3 rounded-xl text-sm font-medium shadow-lg transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
      }`}
    >
      <Check className="w-4 h-4 text-green-400" />
      Changes saved successfully
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
export default function ProfilePage() {
  const { user, setUser } = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [toastVisible, setToastVisible] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phoneNumber || "",
    billing_address: "",
    billing_city: "",
    billing_state: "",
    billing_zip: "",
    billing_country: "",
    shipping_address: "",
    shipping_city: "",
    shipping_state: "",
    shipping_zip: "",
    shipping_country: "",
    sameAsBilling: false,
  });

  const set = (field: string, value: string | boolean) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    const updatedUser = { ...user, ...formData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  const initials = `${formData.firstName?.charAt(0) ?? ""}${formData.lastName?.charAt(0) ?? ""}`.toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto px-4 py-12 max-w-6xl">
        {/* Page heading */}
        <div className="text-center space-y-2 pt-6 pb-8">
          <h1 className="text-primary">My Account</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Manage your profile, addresses, and preferences.
          </p>
        </div>

        <div className="flex flex-col  gap-6">

          {/* ── Sidebar ───────────────────────────────────────────── */}
          <aside className="w-full lg:w-72 shrink-0">
           <Card className="rounded-2xl border border-border/50 shadow-sm sticky top-24 backdrop-blur bg-background/80">
              <CardContent className="p-6 flex flex-col items-center gap-4">

                {/* Avatar */}
                <div className="relative group">
                  <Avatar className="w-24 h-24 ring-4 ring-primary/10">
                    <AvatarImage src={user?.user_profile_photo} />
                    <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                 <button className="absolute bottom-1 right-1 p-2 rounded-full bg-primary text-white shadow-md opacity-0 group-hover:opacity-100 transition-all">
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Name & email */}
                <div className="text-center">
                  <h2 className="font-bold text-lg text-foreground">
                    {formData.firstName || "Your"} {formData.lastName || "Name"}
                  </h2>
                  <p className="text-sm text-muted-foreground">{formData.email}</p>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    Member since 2024
                  </Badge>
                </div>

                <Separator />

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-2 w-full">
                  <StatCard icon={ShoppingBag} label="Orders" value={12} color="bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400" />
                  <StatCard icon={Heart} label="Saved" value={4} color="bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400" />
                  <StatCard icon={Star} label="Reviews" value={7} color="bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400" />
                </div>

                <Separator />

                {/* Navigation */}
                <nav className="w-full flex flex-col gap-1">
                  <NavItem icon={User} label="Personal Info" active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
                  <NavItem icon={CreditCard} label="Billing Address" active={activeTab === "billing"} onClick={() => setActiveTab("billing")} />
                  <NavItem icon={Package} label="Shipping Address" active={activeTab === "shipping"} onClick={() => setActiveTab("shipping")} />
                </nav>

              </CardContent>
            </Card>
          </aside>

          {/* ── Main panel ────────────────────────────────────────── */}
          <section className="flex-1 flex flex-col gap-4">

            {/* ── Profile tab ──────────────────────────────────────── */}
            {activeTab === "profile" && (
              <Card className="rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-foreground">Personal Info</h3>
                    <span className="text-xs text-muted-foreground">* Email cannot be changed</span>
                  </div>
                </CardHeader>
<CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-6">                  <Field label="First Name" icon={User} placeholder="Jane" value={formData.firstName} onChange={(v) => set("firstName", v)} />
                  <Field label="Last Name" icon={User} placeholder="Doe" value={formData.lastName} onChange={(v) => set("lastName", v)} />
                  <Field label="Email" icon={Mail} type="email" placeholder="jane@example.com" value={formData.email} disabled />
                  <Field label="Phone" icon={Phone} type="tel" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={(v) => set("phone", v)} />
                </CardContent>
              </Card>
            )}

            {/* ── Billing tab ───────────────────────────────────────── */}
            {activeTab === "billing" && (
              <Card className="rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-2">
                  <h3 className="text-lg font-bold text-foreground">Billing Address</h3>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-6">
                  <div className="sm:col-span-2">
                    <Field label="Street Address" icon={MapPin} placeholder="123 Main St, Apt 4B" value={formData.billing_address} onChange={(v) => set("billing_address", v)} />
                  </div>
                  <Field label="City" placeholder="New York" value={formData.billing_city} onChange={(v) => set("billing_city", v)} />
                  <Field label="State / Province" placeholder="NY" value={formData.billing_state} onChange={(v) => set("billing_state", v)} />
                  <Field label="ZIP / Postal Code" placeholder="10001" value={formData.billing_zip} onChange={(v) => set("billing_zip", v)} />
                  <Field label="Country" placeholder="United States" value={formData.billing_country} onChange={(v) => set("billing_country", v)} />
                </CardContent>
              </Card>
            )}

            {/* ── Shipping tab ──────────────────────────────────────── */}
            {activeTab === "shipping" && (
              <Card className="rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-2">
                  <h3 className="text-lg font-bold text-foreground">Shipping Address</h3>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-6">

                  {/* Same-as-billing toggle */}
                  <div className="sm:col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none w-fit">
                      <div
                        onClick={() => {
                          const next = !formData.sameAsBilling;
                          set("sameAsBilling", next);
                          if (next) {
                            setFormData((prev) => ({
                              ...prev,
                              sameAsBilling: true,
                              shipping_address: prev.billing_address,
                              shipping_city: prev.billing_city,
                              shipping_state: prev.billing_state,
                              shipping_zip: prev.billing_zip,
                              shipping_country: prev.billing_country,
                            }));
                          }
                        }}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors cursor-pointer
                          ${formData.sameAsBilling ? "bg-primary border-primary" : "border-border"}`}
                      >
                        {formData.sameAsBilling && <Check className="w-3 h-3 text-primary-foreground" />}
                      </div>
                      <span className="text-sm text-muted-foreground">Same as billing address</span>
                    </label>
                  </div>

                  <div className="sm:col-span-2">
                    <Field label="Street Address" icon={MapPin} placeholder="456 Oak Ave" value={formData.shipping_address} onChange={(v) => set("shipping_address", v)} />
                  </div>
                  <Field label="City" placeholder="Los Angeles" value={formData.shipping_city} onChange={(v) => set("shipping_city", v)} />
                  <Field label="State / Province" placeholder="CA" value={formData.shipping_state} onChange={(v) => set("shipping_state", v)} />
                  <Field label="ZIP / Postal Code" placeholder="90001" value={formData.shipping_zip} onChange={(v) => set("shipping_zip", v)} />
                  <Field label="Country" placeholder="United States" value={formData.shipping_country} onChange={(v) => set("shipping_country", v)} />
                </CardContent>
              </Card>
            )}

            {/* ── Action bar ────────────────────────────────────────── */}
            <div className="flex justify-end gap-3 pt-1">
              <Button
                variant="outline"
                onClick={() =>
                  setFormData({
                    firstName: user?.firstName || "",
                    lastName: user?.lastName || "",
                    email: user?.email || "",
                    phone: user?.phoneNumber || "",
                    billing_address: "",
                    billing_city: "",
                    billing_state: "",
                    billing_zip: "",
                    billing_country: "",
                    shipping_address: "",
                    shipping_city: "",
                    shipping_state: "",
                    shipping_zip: "",
                    shipping_country: "",
                    sameAsBilling: false,
                  })
                }
              >
                Discard
              </Button>
              <Button onClick={handleSave} className="px-6">
                Save Changes
              </Button>
            </div>

          </section>
        </div>
      </main>

      <SaveToast visible={toastVisible} />
    </div>
  );
}