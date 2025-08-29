import { Link, useLocation, useNavigate } from "react-router";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { Button } from "./ui/button";
import { cn } from "~/lib/utils";
import { ArrowLeftIcon } from "lucide-react";

export default function Navigation() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const onClickBack = () => {
    navigate(-1);
  };
  return (
    <header className="py-1 px-5 flex justify-between items-center bg-primary">
      {pathname === "/images/upload" ? (
        <Button size="icon" onClick={onClickBack}>
          <ArrowLeftIcon />
        </Button>
      ) : (
        <>
          <h1 className="text-primary-foreground text-xl font-bold tracking-widest">
            ULLI
          </h1>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/images/upload"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-primary text-primary-foreground",
                    pathname === "/images/upload"
                      ? "bg-accent text-accent-foreground"
                      : ""
                  )}
                >
                  AI 피팅
                </NavigationMenuLink>
              </NavigationMenuItem>
              {/* <NavigationMenuItem>
                <NavigationMenuLink
                  href="/products"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-primary text-primary-foreground",
                    pathname === "/products"
                      ? "bg-accent text-accent-foreground"
                      : ""
                  )}
                >
                  상품
                </NavigationMenuLink>
              </NavigationMenuItem> */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/fitting"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-primary text-primary-foreground",
                    pathname === "/fitting"
                      ? "bg-accent text-accent-foreground"
                      : ""
                  )}
                >
                  가상 피팅
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/coordi"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-primary text-primary-foreground",
                    pathname === "/coordi"
                      ? "bg-accent text-accent-foreground"
                      : ""
                  )}
                >
                  코디
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </>
      )}
    </header>
  );
}
