"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// for card component
import {
  Card,
  CardContent,
  //CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { login } from "./actions";

// Define the form schema with new fields for email and password
const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .transform((value) => value.trim()), // Trim whitespace,
  password: z.string(),
  // .min(8, { message: "Password must be at least 8 characters long." }),
});

export default function LoginForm() {
  // Initialize the form with react-hook-form and zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Define the submit handler function
  // const onSubmit = async (values: z.infer<typeof formSchema>) => {
  //   console.log("Form submitted with values:", values);
  // };

  // Return the form JSX
  return (
    // <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <Card className="w-full max-w-md shadow-md">
      <CardHeader>
        <CardTitle className="text-center">HallEase FCT</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            // onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full mt-10 bg-black text-white hover:bg-gray-800 
            hover:shadow-lg hover:scale-105 transition-all duration-300 flex 
            items-center justify-center space-x-2"
              formAction={login}
            >
              Login
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex justify-between text-sm text-gray-500">
        <a href="#" className="hover:underline">
          Public reservations
        </a>

        <div className="flex items-center space-x-2">
          <BsFillQuestionCircleFill />

          <a href="#" className="hover:underline">
            Lost Password?
          </a>
        </div>
      </CardFooter>
    </Card>
  );
}
