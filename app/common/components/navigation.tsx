import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";
import { MenuIcon, X } from "lucide-react";
import { cn } from "~/lib/utils";
import { Link } from "react-router";
import { Separator } from "./ui/separator";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <>
      <NavigationMenu className="py-2 px-4 w-full max-w-none bg-primary justify-end sm:justify-start text-primary-foreground">
        {/* Mobile Navigation */}
        <NavigationMenuList className="sm:hidden">
          <NavigationMenuItem
            className="cursor-pointer"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}>
            {isMobileMenuOpen ? <X /> : <MenuIcon />}
          </NavigationMenuItem>
        </NavigationMenuList>

        {/* Desktop Navigation */}
        <NavigationMenuList className="gap-10 hidden sm:flex">
          <NavigationMenuItem>
            <Link to="/">홈</Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/upload">업로드</Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div
        className={cn(
          "absolute top-10 left-0 right-0 z-50 bg-primary text-primary-foreground sm:hidden transition-all duration-300 ease-in-out transform flex flex-col gap-2 px-4 overflow-hidden shadow-md",
          isMobileMenuOpen
            ? "max-h-40 py-2 pointer-events-auto"
            : "max-h-0 pointer-events-none"
        )}>
        <Link to="/">홈</Link>
        <Separator />
        <Link to="/upload">업로드</Link>
      </div>
    </>
  );
}
