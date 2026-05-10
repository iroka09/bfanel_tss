import React, { useState, useEffect } from "react";
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
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
import { getSession } from "@/server/actions/session"
import { useSession } from '@/context/session';
import { z } from "zod";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';




const searchSchema = z.object({
  redirect: z.string().optional()
});


export const Route = createFileRoute('/login/')({
  beforeLoad: async ({ location }) => {
    const result = await getSession()
    console.log("/login: ", location)
    if (result) throw redirect({ to: "/" })
  },
  validateSearch: searchSchema,
  component: LoginForm,
})



function LoginForm() {
  const val = Route.useRouteContext()
  const { redirect } = Route.useSearch();
  const router = useRouter()
  const { signIn } = useSession()
  const [isPending, startTransition] = React.useTransition()
  const [formData, setFormData] = useState({ email: "", password: "", picture: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=30&q=20" });
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await signIn({ data: { credentials: formData }, redirect: true });
      //router.navigate({ to: redirect || "/", replace: true })
    })
  };
  useEffect(() => {
    // alert( JSON.stringify(val))
    alert(router.history.previous?.pathname)
  }, [])
  return (
    <div className="container pb-20">
      <form onSubmit={handleSubmit}>
        <Card className="w-full max-w-sm mx-auto mt-20">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="•••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Submitting..." : "Sign In"}
            </Button>
          </CardFooter>
        </Card>
      </form>
      <div className="flex justify-center py-3">
        <GoogleLogin
          onSuccess={async (profile) => {
            const decoded = jwtDecode(profile.credential);
            console.log(decoded);
            const result = await signIn({
              oneTapLogin: {
                name: decoded.name,
                email: decoded.email,
                picture: decoded.picture,
              }
            })
            if (result.success) router.navigate({ to: redirect || "/", replace: true })
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
      </div>
    </div>
  );
}