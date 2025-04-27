"use client";
import { Home, Search, UserCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Chips } from "@/components/elements/Chips";
import { useToast } from "@/hooks/use-toast";

export default function DesignSytemModule() {
  const { toast } = useToast();

  return (
    <main className="h-fit grow w-full flex flex-col gap-4 justify-center py-40 items-center text-black dark:text-white">
      <div className="text-h1 font-outfit">Heading/H1</div>
      <div className="text-h2 font-outfit">Heading/H2</div>
      <div className="text-h3 font-outfit">Heading/H3</div>
      <div className="text-h4 font-outfit">Heading/H4</div>
      <div className="text-h5 font-outfit">Heading/H5</div>
      <div className="text-h6 font-outfit">Heading/H6</div>
      <div className="text-h7 font-outfit">Heading/H7</div>
      <div className="text-h8 font-outfit">Heading/H8</div>

      <div className="text-h1 font-hepta">Heading/H1</div>
      <div className="text-h2 font-hepta">Heading/H2</div>
      <div className="text-h3 font-hepta">Heading/H3</div>
      <div className="text-h4 font-hepta">Heading/H4</div>
      <div className="text-h5 font-hepta">Heading/H5</div>
      <div className="text-h6 font-hepta">Heading/H6</div>
      <div className="text-h7 font-hepta">Heading/H7</div>
      <div className="text-h8 font-hepta">Heading/H8</div>

      <div className="grid grid-cols-3 gap-4 py-5">
        <Button
          variant={"default"}
          onClick={() => {
            toast({
              title: "Loading",
              variant: "loading",
            });
          }}
        >
          Loading toast
        </Button>
        <Button
          variant={"default"}
          onClick={() => {
            toast({
              title: "Error message",
              variant: "error",
            });
          }}
        >
          Error toast
        </Button>
        <Button
          variant={"default"}
          onClick={() => {
            toast({
              title: "Success message",
              variant: "success",
            });
          }}
        >
          Success toast
        </Button>
      </div>

      <div className="w-1/5 space-y-3">
        <div className="space-y-1 w-full">
          <p className="text-sm font-medium">Basic Select</p>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="orange">Orange</SelectItem>
              <SelectItem value="carrot">Carrot</SelectItem>
              <SelectItem value="broccoli">Broccoli</SelectItem>
              <SelectItem value="spinach">Spinach</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1 w-full">
          <p className="text-sm font-medium">Small Size Select</p>
          <Select>
            <SelectTrigger size="sm">
              <SelectValue placeholder="Small size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
              <SelectItem value="option3">Option 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1 w-full">
          <p className="text-sm font-medium">Disabled Select</p>
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="Disabled" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="disabled1">Disabled 1</SelectItem>
              <SelectItem value="disabled2">Disabled 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="w-1/5 space-y-3">
        <Input placeholder="Search..." required />
        <Input
          icon={<Search />}
          placeholder="Search..."
          label="Full Name"
          error="This is an error"
        />
      </div>

      <Dialog>
        <DialogTrigger>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Chips textContent="Chip" type="p2" icon={<Home />} />
      <Chips textContent="Chip" type="p3" icon={<Home />} />

      <Chips textContent="Chip" type="p2" />
      <Chips textContent="Chip" type="p3" />

      <div className="flex flex-col gap-1 w-fit">
        <div className="flex flex-rpw gap-1 w-fit">
          <Button variant="default">
            <UserCircle2 />
            Register
            <UserCircle2 />
          </Button>
          <Button variant="secondary">
            <UserCircle2 />
            Register
            <UserCircle2 />
          </Button>
          <Button variant="outline">
            <UserCircle2 />
            Register
            <UserCircle2 />
          </Button>
          <Button variant="link">
            <UserCircle2 />
            Register
            <UserCircle2 />
          </Button>
        </div>
        <div className="flex flex-row gap-1">
          <Button variant="default" disabled>
            <UserCircle2 />
            Register
            <UserCircle2 />
          </Button>
          <Button variant="secondary" disabled>
            <UserCircle2 />
            Register
            <UserCircle2 />
          </Button>
          <Button variant="outline" disabled>
            <UserCircle2 />
            Register
            <UserCircle2 />
          </Button>
          <Button variant="link" disabled>
            <UserCircle2 />
            Register
            <UserCircle2 />
          </Button>
        </div>
      </div>
    </main>
  );
}
