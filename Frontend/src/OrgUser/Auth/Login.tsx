import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import logo from "@/assets/logo.png";
import { orgUserApiService } from "@/utils/orgUserApi";

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
import { 
  orgLoginStart, 
  orgLoginSuccess, 
  orgLoginFailure 
} from "@/redux/features/orgAuth/orgAuthSlice";

// Interface for form state
interface LoginForm {
  email: string;
  password: string;
}

export default function OrgUserLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [msg, setMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value.trim() });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(orgLoginStart());
    setMsg("");
    setLoading(true);

    try {
      const res = await orgUserApiService.login(form);
      
      // Extract data from new API response structure
      const { 
        org_user_id, 
        name,
        email, 
        org_id,
        branch_id,
        designation,
        access_token, 
        refresh_token 
      } = res.data.data;
      
      // Map the API response to our Redux state structure
      const user = {
        org_user_id,
        name,
        email,
        org_id,
        branch_id,
        designation,
      };
      
      // Store refresh token in localStorage
      localStorage.setItem('token', refresh_token);
      
      // Dispatch success with user data and access token
      dispatch(orgLoginSuccess({
        user: user,
        token: access_token
      }));
      
      setLoading(false);
      navigate("/org/dashboard");
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Login failed. Please check your credentials.";
      dispatch(orgLoginFailure(errorMsg));
      setMsg(errorMsg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 px-4 dark:from-zinc-950 dark:to-zinc-900 transition-colors duration-300">
      <Card className="w-full max-w-md shadow-xl border-blue-200 dark:border-zinc-800 dark:bg-zinc-900">
        <CardHeader className="space-y-2 flex flex-col items-center">
          <div className="mb-4">
            <img 
              src={logo} 
              alt="Organization Logo" 
              className="h-16 sm:h-20 md:h-24 object-contain" 
            />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-zinc-50">
            Organization Login
          </CardTitle>
          <CardDescription className="text-center text-gray-500 dark:text-zinc-400">
            Please enter your organization credentials
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {msg && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">{msg}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-zinc-300">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@company.com"
                value={form.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 dark:text-zinc-300">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="pr-10 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2 text-center text-sm text-gray-500 dark:text-zinc-400">
          <p>
            Having trouble? Contact your organization administrator.
          </p>
        </CardFooter>
      </Card>

      <div className="mt-6 text-center text-sm text-gray-600 dark:text-zinc-400">
        <p>© 2026 Organization CRM. All rights reserved.</p>
      </div>
    </div>
  );
}
