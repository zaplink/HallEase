import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  //CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BsFillQuestionCircleFill } from "react-icons/bs";

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-center">HallEase Login</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full gap-4">
            <div className="grid gap-2 items-start space-y-2">
              <Label htmlFor="Username">Username</Label>
              <Input id="Username" type="text" placeholder="Username" />
            </div>
            <div className="grid gap-2 items-start space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Password" />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full mt-4 bg-black text-white hover:bg-gray-800 hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            Login
          </Button>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-gray-500">
          <a href="#" className="hover:underline">
            Lost Password?
          </a>
          <div className="flex items-center space-x-2">
            <BsFillQuestionCircleFill />
            <a href="#" className="hover:underline">
              Cookies Notice
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
