import { Link } from "react-router";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { Button } from "./ui/button";
import { cn } from "~/lib/utils";

export default function Navigation() {
  return (
    <header className="py-1 px-5 flex justify-between items-center bg-primary">
      <h1 className="text-primary-foreground text-xl font-bold tracking-widest">
        <Link to="/">ULLI</Link>
      </h1>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/images/upload"
              className={cn(
                navigationMenuTriggerStyle(),
                "bg-primary text-primary-foreground"
              )}
            >
              이미지 만들기
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/images"
              className={cn(
                navigationMenuTriggerStyle(),
                "bg-primary text-primary-foreground"
              )}
            >
              내 이미지
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/products"
              className={cn(
                navigationMenuTriggerStyle(),
                "bg-primary text-primary-foreground"
              )}
            >
              상품
            </NavigationMenuLink>
          </NavigationMenuItem>
          {/* <NavigationMenuItem>
            <NavigationMenuLink
              href="/advertisements"
              className={cn(
                navigationMenuTriggerStyle(),
                "bg-primary text-primary-foreground"
              )}
            >
              광고
            </NavigationMenuLink>
          </NavigationMenuItem> */}
        </NavigationMenuList>
      </NavigationMenu>
      <div>
        <Button asChild variant="link" className="text-primary-foreground">
          <Link to="/auth/login">로그인</Link>
        </Button>
      </div>
    </header>
  );
}
