import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();


  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md border rounded-xl shadow-sm">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl text-primary">
            Create Account
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Join us and start shopping for your pet
          </p>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Full Name</label>
            <Input placeholder="John Doe" className="h-11" />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              className="h-11"
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="h-11 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Sign Up Button */}
          <Button className="w-full h-11 rounded-full">
            Create Account
          </Button>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button className="text-primary font-medium cursor-pointer" onClick={()=>{navigate("/login")}}>
              Login
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}