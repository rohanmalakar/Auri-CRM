import { useState } from "react";
import { data, useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import logo from "@/assets/logo.png";
import api from "@/utils/api";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAppDispatch } from "@/redux/hooks";
import { loginFailure, loginStart, loginSuccess } from "@/redux/features/auth/authSlice";


// Interface for form state
interface LoginForm {
  email: string;
  password: string;
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [msg, setMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Keeping your logic: trimming immediately. 
    // Note: This prevents typing spaces entirely.
    setForm({ ...form, [e.target.name]: e.target.value.trim() });
  };

  const onSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  dispatch(loginStart()); // Set loading true in global state

  try {
    // const res = await api.post("/auth/admin/login", form);
    
    const res={
       data:{
        user:{
          id:"1",
          name:"Admin User",
          email:form.email,
          role:"super_admin" as const
        },
        token:"dummy-jwt-token"
        }
    }
    
    // Dispatch success with user data and token
    dispatch(loginSuccess({
      user: res.data.user, // Ensure API returns user object with role
      token: res.data.token
    }));
    
    navigate("/admin/dashboard");
  } catch (err: any) {
    const errorMsg = err.response?.data?.message || "Login failed";
    dispatch(loginFailure(errorMsg));
    setMsg(errorMsg);
  }
};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50 px-4 dark:bg-zinc-950 transition-colors duration-300">
      <Card className="w-full max-w-md shadow-lg border-pink-200 dark:border-zinc-800 dark:bg-zinc-900">
        <CardHeader className="space-y-2 flex flex-col items-center">
          <div className="mb-4">
            <img 
              src={logo} 
              alt="CUL Logo" 
              className="h-16 sm:h-20 md:h-24 object-contain" 
            />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-zinc-50">
            Admin Login
          </CardTitle>
          <CardDescription className="text-center text-gray-500 dark:text-zinc-400">
            Please enter your admin credentials to continue
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-zinc-300">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="admin@example.com"
                className="focus-visible:ring-pink-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="dark:text-zinc-300">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="pr-10 focus-visible:ring-pink-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {msg && (
              <Alert variant="destructive" className="mt-4 py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{msg}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white dark:bg-pink-600 dark:hover:bg-pink-700 transition-all mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="justify-center pb-6">
          <p className="text-xs text-gray-400 dark:text-zinc-500">
            Protected Admin Area
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}