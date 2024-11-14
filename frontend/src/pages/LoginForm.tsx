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

// Define the form schema with new fields for email and password
const formSchema = z.object({
  // username: z
  //   .string()
  //   .min(2, { message: "Username must be at least 2 characters." })
  //   .max(20, { message: "Username must be at most 20 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string(),
  // .min(8, { message: "Password must be at least 8 characters long." }),
});

export default function LoginForm() {
  // Initialize the form with react-hook-form and zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // username: "",
      email: "",
      password: "",
    },
  });

  // Define the submit handler function
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Form submitted with values:", values);
    // Add any further submission logic here
    try {
      // waiting for incomming & outgoing responses
      const response = await fetch("http://localhost:3000/usr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (data.success) {
        if (data.userType === "admin") {
          // redirect to admin dashbord
          window.location.href = "/admin-dashborad";
        } else if (data.userType === "user") {
          // redirect to user dashboard
          window.location.href = "/user-dashborad";
        } else {
          // invalid client
          alert(data.message);
        }
      } else {
        // invalid client
        alert(data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
      console.error("Error logging in:", error);
      alert("An error occurred while logging in. Please try again.");
    }
  };

  // Return the form JSX
  return (
    <div className="form-container">
      <h1>LOGIN </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

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

          <Button type="submit">Login</Button>
        </form>
      </Form>
    </div>
  );
}
