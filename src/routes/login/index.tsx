import React, { useState, useEffect } from "react";
import { createFileRoute } from '@tanstack/react-router'
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
import { loginFn, getSession } from "@/server/actions/session"
import { redirect } from '@tanstack/react-router'
import { useRouter } from '@tanstack/react-router'






export const Route = createFileRoute('/login/')({
  beforeLoad: async () => {
    const result = await getSession()
    console.log("/login: ", result)
    if (result) throw redirect({ to: "/customer_care" })
  },
  component: LoginForm,
})



function LoginForm() {
  const val = Route.useRouteContext()
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()
  const [formData, setFormData] = useState({ email: "", password: "" });
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await loginFn({ data: formData });
      router.navigate({ to: "/customer_care", replace: true })
      /*  if (result === true) {
         redirect({ to: '/about' })
        }
        console.log(result)*/
    })
  };
  useEffect(() => {
    // alert( JSON.stringify(val))
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
                placeholder="••••••••"
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
    </div>
  );
}