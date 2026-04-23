import {
  User,
  Camera,
  Edit,
  Save,
  MapPin,
  Phone,
  Mail,
  Lock,
  Package,
  Heart,
  LogOut,
  Shield,
  Home,
  ChevronRight,
  Check,
  Eye,
  EyeOff,
  ArrowLeft,
  Settings,
  Clock,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import API from "./api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";


interface UserProfilePageProps {
  onNavigateHome?: () => void;
  onNavigateBack?: () => void;
  cartItemCount?: number;
  onNavigateToCart?: () => void;
}

interface Order {
  id: string;
  date: string;
  statusTitle: "processing" | "shipped" | "delivered";
  total: number;
  items: number;
}

export function UserProfilePage({
  onNavigateHome,
  onNavigateBack,
  cartItemCount = 0,
  onNavigateToCart,
}: UserProfilePageProps) {
  // Profile state
  const [profileImage, setProfileImage] = useState(
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  );
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    phone: "",
    email: "",
    status: "",
    deviceType: "",
    userType: "",
    isVerified: false,
    isShopAdmin: false,
    facebookId: "",
    googleId: "",
    appleId: "",
    aboutMe: "",
  });
  // Address state
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [billingAddress, setBillingAddress] = useState({
    company: "",
    address1: "",
    address2: "",
    country: "",
    countryId: "" as number | "",
    state: "",
    city: "",
    postalCode: "",
    email: "",
    phone: "",
  });
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    company: "",
    address1: "",
    address2: "",
    country: "",
    state: "",
    city: "",
    postalCode: "",
    email: "",
    phone: "",
  });
  const [isEditingBilling, setIsEditingBilling] = useState(false);
  const [isEditingShipping, setIsEditingShipping] = useState(false);

  const navigate = useNavigate();
  // Password dialog state
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const { setUser} = useAuth();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const mapOrderStatus = (statusTitle: string): Order["statusTitle"] => {
    switch (statusTitle?.toLowerCase()) {
      case "pending":
      case "processing":
        return "processing";

      case "shipped":
        return "shipped";

      case "completed":
      case "delivered":
        return "delivered";
      default:
        return "processing";
    }
  };
  const fetchOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const token = user?.authToken?.auth_token || user?.auth_token;

      if (!token) {
        console.error("No token found");
        return;
      }

      const res = await API.get("/product/v2/getAllOrder", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const apiOrders = res.data?.data || [];

      const formattedOrders: Order[] = apiOrders.map((o: any) => ({
        id: o.order_no,
        date: formatOrderDate(o.added_date),
        statusTitle: mapOrderStatus(o.statusTitle),
        total: Number(o.total_item_amount || 0),
        items: o.total_item_count || o.items?.length || 0,
      }));
      setOrders(formattedOrders);
    } catch (error) {
      console.error("Failed to fetch orders", error);
      toast.error("Failed to fetch orders");
    }
  };

  const formatOrderDate = (dateString: string) => {
    const orderDate = new Date(dateString.replace(" ", "T"));
    const now = new Date();

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfOrder = new Date(
      orderDate.getFullYear(),
      orderDate.getMonth(),
      orderDate.getDate()
    )
    const diffMs = startOfToday.getTime() - startOfOrder.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 *24));

    if(diffDays < 1 ) return "Today";
    if(diffDays === 1) return "1 day ago";
    if(diffDays < 7) return `${diffDays} days ago`;

    return orderDate.toLocaleDateString();
  }
  const [countries, setCountries] = useState<any[]>([]);

  const fetchCountries = async () => {
    try {
      const res = await API.get("/authUser/getCountries");
      setCountries(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch Countries", error);
      toast.error("Failed to fetch countries");
    }
  };

  //https://wowpetspalace.com/test/authUser/getCountries
  //product/v2/getAllOrder
  const fetchProfile = async () => {
    try {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const token = user?.authToken?.auth_token || user?.auth_token;
      const res = await API.get(`/authUser/fetchprofile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data.data;

      setProfileData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        bio: data.user_about_me || "",
        phone: data.phoneNumber || "",
        email: data.email || "",
        status: data.status || "",
        deviceType: data.devicetype || "",
        userType: data.user_type || "",
        isVerified: !!data.isVerified,
        isShopAdmin: !!data.is_shop_admin,
        facebookId: data.facebook_id || "",
        googleId: data.google_id || "",
        appleId: data.apple_id || "",
        aboutMe: data.user_about_me || "",
      });

      setBillingAddress({
        company: data.billing_company || "",
        address1: data.billing_address_1 || "",
        address2: data.billing_address_2 || "",
        country: data.billing_country || "",
        countryId: data.country_id ? Number(data.country_id) : "",
        state: data.billing_state || "",
        city: data.billing_city || "",
        postalCode: data.billing_postal_code || "",
        email: data.billing_email || "",
        phone: data.billing_phone || "",
      });

      setShippingAddress({
        firstName: data.shipping_first_name || "",
        lastName: data.shipping_last_name || "",
        company: data.shipping_company || "",
        address1: data.shipping_address_1 || "",
        address2: data.shipping_address_2 || "",
        country: data.shipping_country || "",
        state: data.shipping_state || "",
        city: data.shipping_city || "",
        postalCode: data.shipping_postal_code || "",
        email: data.shipping_email || "",
        phone: data.shipping_phone || "",
      });

      const normalize = (val: any) =>
        (val || "").toString().trim().toLowerCase();

      const billing = {
        address1: normalize(data.billing_address_1),
        address2: normalize(data.billing_address_2),
        city: normalize(data.billing_city),
        state: normalize(data.billing_state),
        country: normalize(data.billing_country),
        postalCode: normalize(data.billing_postal_code),
        email: normalize(data.billing_email),
        phone: normalize(data.billing_phone),
        company: normalize(data.billing_company),
      };

      const shipping = {
        address1: normalize(data.shipping_address_1),
        address2: normalize(data.shipping_address_2),
        city: normalize(data.shipping_city),
        state: normalize(data.shipping_state),
        country: normalize(data.shipping_country),
        postalCode: normalize(data.shipping_postal_code),
        email: normalize(data.shipping_email),
        phone: normalize(data.shipping_phone),
        company: normalize(data.shipping_company),
      };
      const isBillingEmpty = Object.values(billing).every((v) => !v);
      const isShippingEmpty = Object.values(shipping).every((v) => !v);

      const isSame = Object.keys(billing).every(
        (key) =>
          billing[key as keyof typeof billing] ===
          shipping[key as keyof typeof shipping],
      );
      billing.address1 === shipping.address1 &&
        billing.address2 === shipping.address2 &&
        billing.city === shipping.city &&
        billing.state === shipping.state &&
        billing.country === shipping.country &&
        billing.postalCode === shipping.postalCode;

      if (isBillingEmpty && isShippingEmpty) {
        setSameAsShipping(true);
      } else {
        setSameAsShipping(isSame);
      }

      // ✅ Fix image
      if (data.user_profile_photo) {
        setProfileImage(
          `https://www.wowpetspalace.com/test/${data.user_profile_photo}`,
        );
      }

      // ✅ IMPORTANT: sync localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          ...res.data.data,
        }),
      );
    } catch (err) {
      toast.error("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProfile();
    fetchCountries();
    fetchOrders();
  }, []);

  const updateProfile = async (data: any) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = user?.authToken?.auth_token || user?.auth_token;
      const response = await API.patch("/authUser/updateProfile", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error(
        "Update Profile Error:",
        error?.response?.data || error.message,
      );
      throw error;
    }
  };

  const buildPayload = () => {
    return {
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      phoneNumber: profileData.phone,
      status: profileData.status,
      devicetype: profileData.deviceType,
      user_type: profileData.userType,
      isVerified: profileData.isVerified,
      is_shop_admin: profileData.isShopAdmin,
      facebook_id: profileData.facebookId,
      google_id: profileData.googleId,
      apple_id: profileData.appleId,
      user_about_me: profileData.bio,

      billing_company: billingAddress.company,
      billing_address_1: billingAddress.address1,
      billing_address_2: billingAddress.address2,
      billing_country: billingAddress.country,
      billing_state: billingAddress.state,
      billing_city: billingAddress.city,
      billing_postal_code: billingAddress.postalCode,
      billing_email: billingAddress.email,
      billing_phone: billingAddress.phone,
      country_id: billingAddress.countryId,

      shipping_company: sameAsShipping
        ? billingAddress.company
        : shippingAddress.company,
      shipping_address_1: sameAsShipping
        ? billingAddress.address1
        : shippingAddress.address1,
      shipping_address_2: sameAsShipping
        ? billingAddress.address2
        : shippingAddress.address2,
      shipping_country: sameAsShipping
        ? billingAddress.country
        : shippingAddress.country,
      shipping_state: sameAsShipping
        ? billingAddress.state
        : shippingAddress.state,
      shipping_city: sameAsShipping
        ? billingAddress.city
        : shippingAddress.city,
      shipping_postal_code: sameAsShipping
        ? billingAddress.postalCode
        : shippingAddress.postalCode,
      shipping_email: sameAsShipping
        ? billingAddress.email
        : shippingAddress.email,
      shipping_phone: sameAsShipping
        ? billingAddress.phone
        : shippingAddress.phone,
    };
  };

  const handleProfileImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      const existingUser = JSON.parse(localStorage.getItem("user") || "{}");

      const file = e.target.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("user_profile_photo", file);
      const token =
        existingUser?.authToken?.auth_token || existingUser?.auth_token;

      const res = await API.patch("/authUser/updateProfile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const imageUrl = res.data?.data?.user_profile_photo;

      if (imageUrl) {
        setProfileImage(`https://www.wowpetspalace.com/test/${imageUrl}`);
      }

      // ✅ update local storage properly
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...existingUser,
          ...res.data,
        }),
      );
      toast.success("Image updated");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    }
  };
  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const payload = buildPayload();

      const res = await updateProfile(payload);
      // await fetchProfile();
      const existingUser = JSON.parse(localStorage.getItem("user") || "{}");

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...existingUser,
          ...res.data,
        }),
      );
      setIsEditingProfile(false);

      toast.success("Profile Updated Successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBillingAddress = async () => {
    try {
      setLoading(true);
      const payload = buildPayload();

      await updateProfile(payload);
      setIsEditingBilling(false);

      toast.success("Billing address updated successfully!");
    } catch (error) {
      toast.error("Failed to updated billing address");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveShippingAddress = async () => {
    try {
      setLoading(true);
      const payload = buildPayload();

      await updateProfile(payload);

      setIsEditingShipping(false);
      toast.success("Shipping address updated successfully!");
    } catch (error) {
      toast.error("Failed to update shipping address");
    } finally {
      setLoading(false);
    }
  };
  const handleChangePassword = () => {
    if (passwordData.new !== passwordData.confirm) {
      alert("New passwords do not match!");
      return;
    }
    if (passwordData.new.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }
    // Mock password change
    setPasswordDialogOpen(false);
    setPasswordData({ current: "", new: "", confirm: "" });
    alert("Password changed successfully!");
  };

  const handleLogout= async () =>{
    setIsLoggingOut(true);
    try {
      await API.post("/authuser/logout");

      localStorage.removeItem("user");
      setUser(null);


      toast.success("Logged Out Successfully!");

      if(onNavigateHome) onNavigateHome();
       navigate("/");

    } catch (error) {

      console.error("Logout failed", error);

      toast.error("Logout failed");
      if(onNavigateHome) onNavigateHome();
    } finally {
      setIsLoggingOut(false);
    }
  }

  const getOrderStatusIcon = (statusTitle: Order["statusTitle"]) => {
    switch (statusTitle) {
      case "processing":
        return <Clock className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "delivered":
        return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  const getOrderStatusColor = (statusTitle: Order["statusTitle"]) => {
    switch (statusTitle) {
      case "processing":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "shipped":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "delivered":
        return "bg-green-100 text-green-700 border-green-300";
    }
  };

  return (
    <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {onNavigateBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onNavigateBack}
                className="rounded-full hover:bg-primary/10"
              >
                <ArrowLeft className="w-5 h-5 text-primary" />
              </Button>
            )}
            <div>
              <h1 className="text-primary">My Profile</h1>
              <p className="text-muted-foreground">
                Manage your account settings and preferences
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Profile Overview & Security */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Overview */}
            <Card className="rounded-3xl shadow-md border border-gray-100">
              <CardContent className="p-6  space-y-6">
                <div className="flex flex-col items-center text-center space-y-6">
                  {/* Profile Image */}
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-muted ring-4 ring-secondary/20">
                      <ImageWithFallback
                        src={profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <label className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                      <Camera className="w-5 h-5" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageUpload}
                        className="hidden"
                        disabled={!isEditingProfile}
                      />
                    </label>
                  </div>

                  {/* User Info */}
                  <div className="space-y-2  w-full">
                    <h2 className="text-foreground">
                      {profileData.firstName} {profileData.lastName}
                    </h2>
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                      <Mail className="w-4 h-4" />
                      {profileData.email}
                    </p>
                  </div>

                  {/* Bio Preview */}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {profileData.bio}
                  </p>

                  {/* Edit Profile Button */}
                  <Button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="w-full rounded-full bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 shadow-lg"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditingProfile ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="rounded-3xl border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-foreground">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start rounded-xl hover:bg-primary/5 text-foreground"
                >
                  <Heart className="w-5 h-5 mr-3 text-secondary" />
                  My Wishlist
                  <Badge className="ml-auto bg-secondary/20 text-secondary border-0">
                    12
                  </Badge>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start rounded-xl hover:bg-primary/5 text-foreground"
                >
                  <Heart className="w-5 h-5 mr-3 text-primary" />
                  Saved Pets
                  <Badge className="ml-auto bg-primary/20 text-primary border-0">
                    5
                  </Badge>
                </Button>
                <Separator className="my-2" />
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full justify-start rounded-xl hover:bg-destructive/10 text-destructive"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </Button>
              </CardContent>
            </Card>

            {/* Security Section */}
            <Card className="rounded-3xl border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Dialog
                  open={passwordDialogOpen}
                  onOpenChange={setPasswordDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start rounded-xl border-primary/30 hover:border-primary hover:bg-primary/5"
                    >
                      <Lock className="w-5 h-5 mr-3 text-primary" />
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-3xl">
                    <DialogHeader>
                      <DialogTitle className="text-foreground flex items-center gap-2">
                        <Lock className="w-5 h-5 text-primary" />
                        Change Password
                      </DialogTitle>
                      <DialogDescription>
                        Enter your current password and choose a new one.
                        Password must be at least 8 characters long.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="currentPassword"
                          className="text-foreground"
                        >
                          Current Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            value={passwordData.current}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                current: e.target.value,
                              })
                            }
                            className="h-11 rounded-lg pr-10"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="newPassword"
                          className="text-foreground"
                        >
                          New Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={passwordData.new}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                new: e.target.value,
                              })
                            }
                            className="rounded-xl pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showNewPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="confirmPassword"
                          className="text-foreground"
                        >
                          Confirm New Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={passwordData.confirm}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                confirm: e.target.value,
                              })
                            }
                            className="rounded-xl pr-10"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setPasswordDialogOpen(false)}
                        className="rounded-xl"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleChangePassword}
                        className="rounded-xl bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90"
                      >
                        Update Password
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-foreground">
                        Two-Factor Authentication
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Add an extra layer of security to your account
                      </p>
                      <Button
                        variant="link"
                        className="h-auto p-0 mt-2 text-primary hover:text-primary/80"
                      >
                        Enable 2FA
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Order Management */}
            <Card className="rounded-3xl h-dvh border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    My Orders
                  </CardTitle>
                  <Button
                    variant="ghost"
                    className="text-primary hover:text-primary/80"
                  >
                    View All
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {orders.length === 0 ? (
                  <p className="text0center text-muted-foreground">
                    No Orders found!
                  </p>
                ) : (
                  orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-6 rounded-xl border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            <p className="text-foreground">{order.id}</p>
                            <Badge
                              className={`px-3 py-1 rounded-full text-xs capitalize ${getOrderStatusColor(
                                order.statusTitle,
                              )}`}
                            >
                              {getOrderStatusIcon(order.statusTitle)}
                              {order.statusTitle}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {order.date}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {order.items} {order.items === 1 ? "item" : "items"}
                          </p>
                        </div>
                        <div className="text-right space-y-2">
                          <p className="text-secondary">
                            ${order.total.toFixed(2)}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 text-primary hover:text-primary/80"
                          >
                            Track Order
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}

                <Button
                  variant="outline"
                  className="w-full rounded-xl border-primary/30 hover:border-primary hover:bg-primary/5"
                >
                  <Package className="w-4 h-4 mr-2" />
                  View All Orders
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details, Addresses & Orders */}
          <div className="lg:col-span-2 w-full space-y-6">
            {/* Personal Information */}
            <Card className="rounded-3xl border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-foreground">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            firstName: e.target.value,
                          })
                        }
                        disabled={!isEditingProfile}
                        className="rounded-xl border-primary/30 focus:border-primary disabled:opacity-70"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-foreground">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            lastName: e.target.value,
                          })
                        }
                        disabled={!isEditingProfile}
                        className="rounded-xl border-primary/30 focus:border-primary disabled:opacity-70"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-foreground">
                      Bio
                    </Label>
                    <textarea
                      id="bio"
                      rows={3}
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData({ ...profileData, bio: e.target.value })
                      }
                      disabled={!isEditingProfile}
                      className="w-full min-h-[100px] rounded-lg border px-3 py-2"
                      placeholder="Tell us about yourself and your pets..."
                    />
                    <p className="text-xs text-muted-foreground">
                      {profileData.bio.length}/200 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-foreground">
                      Phone Number
                    </Label>
                    <div className="relative">
                      {/* <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /> */}
                      <Input
                        id="phone"
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            phone: e.target.value,
                          })
                        }
                        disabled={!isEditingProfile}
                        className="pl-10 rounded-xl border-primary/30 focus:border-primary disabled:opacity-70"
                      />
                    </div>
                  </div>

                  {isEditingProfile && (
                    <div className="flex gap-3 pt-2">
                      <Button
                        onClick={handleSaveProfile}
                        disabled={loading}
                        className="flex-1 rounded-full bg-gradient-to-r from-primary to-secondary text-white"
                      >
                        {loading ? (
                          "Saving..."
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditingProfile(false)}
                        className="rounded-full border-primary/30"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Address Management */}
            <Card className="rounded-3xl border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Addresses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Billing Address */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-foreground flex items-center gap-2">
                      <Home className="w-5 h-5 text-secondary" />
                      Billing Address
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingBilling(!isEditingBilling)}
                      className="text-primary hover:text-primary/80"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      {isEditingBilling ? "Cancel" : "Edit"}
                    </Button>
                  </div>

                  <div className="p-4 rounded-2xl bg-muted/30 space-y-3">
                    <div className="space-y-2">
                      <Label
                        htmlFor="billingAddress"
                        className="text-foreground"
                      >
                        Address
                      </Label>
                      <textarea
                        id="billingAddress"
                        placeholder="Address Line 1"
                        rows={2}
                        value={billingAddress.address1}
                        onChange={(e) =>
                          setBillingAddress({
                            ...billingAddress,
                            address1: e.target.value,
                          })
                        }
                        disabled={!isEditingBilling}
                        className="w-full min-h-[100px] rounded-lg border px-3 py-2"
                      />
                      <Input
                        placeholder="Address Line 2"
                        value={billingAddress.address2}
                        onChange={(e) => {
                          setBillingAddress({
                            ...billingAddress,
                            address2: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="billingCountry"
                        className="text-foreground"
                      >
                        Country
                      </Label>
                      <select
                        className="w-full rounded-xl border px-3 py-2"
                        value={billingAddress.countryId || ""}
                        disabled={!isEditingBilling}
                        onChange={(e) => {
                          const selected = countries.find(
                            (c) => c.id == e.target.value,
                          );

                          setBillingAddress({
                            ...billingAddress,
                            countryId: Number(e.target.value), // ID for API
                            country: selected?.name || "", // Name for UI
                          });
                        }}
                      >
                        <option value="">Select Country</option>
                        {countries.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <Input
                        placeholder="Company"
                        value={billingAddress.company}
                        disabled={!isEditingBilling}
                        onChange={(e) =>
                          setBillingAddress({
                            ...billingAddress,
                            company: e.target.value,
                          })
                        }
                      />
                      <Input
                        placeholder="Email"
                        value={billingAddress.email}
                        disabled={!isEditingBilling}
                        onChange={(e) =>
                          setBillingAddress({
                            ...billingAddress,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-4"></div>

                    <div className="grid md:grid-cols-3 gap-6">
                      <Input
                        placeholder="City"
                        value={billingAddress.city}
                        disabled={!isEditingBilling}
                        onChange={(e) =>
                          setBillingAddress({
                            ...billingAddress,
                            city: e.target.value,
                          })
                        }
                      />
                      <Input
                        placeholder="State"
                        value={billingAddress.state}
                        disabled={!isEditingBilling}
                        onChange={(e) => {
                          setBillingAddress({
                            ...billingAddress,
                            state: e.target.value,
                          });
                        }}
                      />
                      <Input
                        placeholder="Postal Code"
                        value={billingAddress.postalCode}
                        disabled={!isEditingBilling}
                        onChange={(e) => {
                          setBillingAddress({
                            ...billingAddress,
                            postalCode: e.target.value,
                          });
                        }}
                      />
                    </div>

                    {isEditingBilling && (
                      <Button
                        onClick={handleSaveBillingAddress}
                        size="sm"
                        className="w-full rounded-full bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Billing Address
                      </Button>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Shipping Address */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-foreground flex items-center gap-2">
                      <Truck className="w-5 h-5 text-secondary" />
                      Shipping Address
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="sameAsShipping"
                          checked={sameAsShipping}
                          onCheckedChange={(checked) => {
                            const isChecked = !!checked;
                            setSameAsShipping(isChecked);

                            if (isChecked) {
                              const updatedShipping = {
                                firstName: "",
                                lastName: "",
                                company: billingAddress.company,
                                address1: billingAddress.address1,
                                address2: billingAddress.address2,
                                country: billingAddress.country,
                                state: billingAddress.state,
                                city: billingAddress.city,
                                postalCode: billingAddress.postalCode,
                                email: billingAddress.email,
                                phone: billingAddress.phone,
                              };

                              setShippingAddress(updatedShipping);

                              // ✅ build payload using billing directly (NOT state)
                              const payload = {
                                ...buildPayload(),
                                shipping_company: billingAddress.company,
                                shipping_address_1: billingAddress.address1,
                                shipping_address_2: billingAddress.address2,
                                shipping_country: billingAddress.country,
                                shipping_state: billingAddress.state,
                                shipping_city: billingAddress.city,
                                shipping_postal_code: billingAddress.postalCode,
                                shipping_email: billingAddress.email,
                                shipping_phone: billingAddress.phone,
                              };

                              updateProfile(payload)
                                .then(() =>
                                  toast.success("Shipping synced with billing"),
                                )
                                .catch(() =>
                                  toast.error("Failed to sync shipping"),
                                );
                            }
                          }}
                        />
                        <Label
                          htmlFor="sameAsShipping"
                          className="text-sm text-muted-foreground cursor-pointer"
                        >
                          Same as billing
                        </Label>
                      </div>

                      {!sameAsShipping && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setIsEditingShipping(!isEditingShipping)
                          }
                          className="text-primary hover:text-primary/80"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          {isEditingShipping ? "Cancel" : "Edit"}
                        </Button>
                      )}
                    </div>
                  </div>

                  {!sameAsShipping && (
                    <div className="p-4 rounded-2xl bg-muted/30 space-y-3">
                      <div className="space-y-2">
                        <Label
                          htmlFor="shippingAddress"
                          className="text-foreground"
                        >
                          Address
                        </Label>
                        <textarea
                          id="shippingAddress"
                          placeholder="Address Line 1"
                          rows={2}
                          value={shippingAddress.address1}
                          disabled={!isEditingShipping}
                          onChange={(e) =>
                            setShippingAddress({
                              ...shippingAddress,
                              address1: e.target.value,
                            })
                          }
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        <Input
                          placeholder="Address Line 2"
                          value={shippingAddress.address2}
                          disabled={!isEditingShipping}
                          onChange={(e) => {
                            setShippingAddress({
                              ...shippingAddress,
                              address2: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="shippingCountry"
                          className="text-foreground"
                        >
                          Country
                        </Label>
                        <select
                          className="w-full rounded-xl border px-3 py-2"
                          disabled={!isEditingShipping}
                          value={shippingAddress.country || ""}
                          onChange={(e) => {
                            setShippingAddress({
                              ...shippingAddress,
                              country: e.target.value, // Name for UI
                            });
                          }}
                        >
                          <option value="">Select Country</option>
                          {countries.map((c) => (
                            <option key={c.id} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <Input
                          placeholder="Company"
                          value={shippingAddress.company}
                          disabled={!isEditingShipping}
                          onChange={(e) => {
                            setShippingAddress({
                              ...shippingAddress,
                              company: e.target.value,
                            });
                          }}
                        />
                        <Input
                          placeholder="Email"
                          value={shippingAddress.email}
                          disabled={!isEditingShipping}
                          onChange={(e) => {
                            setShippingAddress({
                              ...shippingAddress,
                              email: e.target.value,
                            });
                          }}
                        />
                      </div>

                      <div className="space-y-4"></div>

                      <div className="grid md:grid-cols-3 gap-6">
                        <Input
                          placeholder="City"
                          value={shippingAddress.city}
                          disabled={!isEditingShipping}
                          onChange={(e) =>
                            setShippingAddress({
                              ...shippingAddress,
                              city: e.target.value,
                            })
                          }
                        />
                        <Input
                          placeholder="State"
                          value={shippingAddress.state}
                          disabled={!isEditingShipping}
                          onChange={(e) => {
                            setShippingAddress({
                              ...shippingAddress,
                              state: e.target.value,
                            });
                          }}
                        />
                        <Input
                          placeholder="Postal Code"
                          value={shippingAddress.postalCode}
                          disabled={!isEditingShipping}
                          onChange={(e) => {
                            setShippingAddress({
                              ...shippingAddress,
                              postalCode: e.target.value,
                            });
                          }}
                        />
                      </div>

                      {isEditingShipping && (
                        <Button
                          onClick={handleSaveShippingAddress}
                          size="sm"
                          className="w-full rounded-full bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Shipping Address
                        </Button>
                      )}
                    </div>
                  )}

                  {sameAsShipping && (
                    <div className="p-4 rounded-2xl bg-green-50 border border-green-200 flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <p className="text-sm text-green-700">
                        Shipping address is the same as billing address
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
