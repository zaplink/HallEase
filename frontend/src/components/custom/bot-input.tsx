import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function BotInput() {
  return (
    <div className="flex items-center space-x-2">
      <Input className="bot-inp-txt w-full sm:w-64" />
      <Button variant="outline">Button</Button>
    </div>
  );
}
