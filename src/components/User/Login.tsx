import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { userContext } from "../../Context/UserContext";
import ServerApi from "../../serverApi/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const loginUrl = "api/v1/auth/login";

const Login = () => {
  const { dispatch } = userContext();
  const navigate = useNavigate();
  const [user, setUser] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await ServerApi.post<{ user: any }>(loginUrl, user, {
        withCredentials: true,
      });
      dispatch({ type: "LOGIN", payload: data.user });
      navigate("/venues");
      setUser({ email: "", password: "" });
    } catch (error: any) {
      console.error(error);
      setError(
        error.response?.data?.msg || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 w-full">
      <Card className="max-w-[600px] min-w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            RotaPal
          </CardTitle>
          <CardDescription>Login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={user.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={user.password}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">Don't have an account?</p>
            <Button variant="link" asChild className="p-0">
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-800"
              >
                Register here
              </Link>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/forgot-password">Forgot password</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/help">Help</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
