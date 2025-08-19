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
  const {pathname} = useLocation()
  const navigate = useNavigate()
  const onClickBack = () => {
    navigate(-1)
  }
  return (
    <header className="py-1 px-5 flex justify-between items-center bg-primary">
      <Button size='icon' onClick={onClickBack}><ArrowLeftIcon /></Button>
      {/* <h1 className="text-primary-foreground text-xl font-bold tracking-widest">
        {pathname !== "/hmall" ? <Link to="/">ULLI</Link> : "ULLI"}
        ULLI
      </h1> */}
      {//pathname !== "/hmall" && (
        // <>
        //   <NavigationMenu>
        //     <NavigationMenuList>
        //       <NavigationMenuItem>
        //         <NavigationMenuLink
        //           href="/images/upload"
        //           className={cn(
        //             navigationMenuTriggerStyle(),
        //             "bg-primary text-primary-foreground",
        //             pathname === "/images/upload"
        //               ? "bg-accent text-accent-foreground"
        //               : ""
        //           )}
        //         >
        //           AI 피팅
        //         </NavigationMenuLink>
        //       </NavigationMenuItem>
        //       {/* <NavigationMenuItem>
        //         <NavigationMenuLink
        //           href="/images"
        //           className={cn(
        //             navigationMenuTriggerStyle(),
        //             "bg-primary text-primary-foreground",
        //             pathname === "/images"
        //               ? "bg-accent text-accent-foreground"
        //               : ""
        //           )}
        //         >
        //           내 이미지
        //         </NavigationMenuLink>
        //       </NavigationMenuItem> */}
        //       <NavigationMenuItem>
        //         <NavigationMenuLink
        //           href="/products"
        //           className={cn(
        //             navigationMenuTriggerStyle(),
        //             "bg-primary text-primary-foreground",
        //             pathname === "/products"
        //               ? "bg-accent text-accent-foreground"
        //               : ""
        //           )}
        //         >
        //           상품
        //         </NavigationMenuLink>
        //       </NavigationMenuItem>
        //       {/* <NavigationMenuItem>
        //     <NavigationMenuLink
        //       href="/advertisements"
        //       className={cn(
        //         navigationMenuTriggerStyle(),
        //         "bg-primary text-primary-foreground"
        //       )}
        //     >
        //       광고
        //     </NavigationMenuLink>
        //   </NavigationMenuItem> */}
        //     </NavigationMenuList>
        //   </NavigationMenu>
        //   <div>
        //     {/* <Button asChild variant="link" className="text-primary-foreground">
        //       <Link to="/auth/login">로그인</Link>
        //     </Button> */}
        //   </div>
        // </>
      //)
      }
    </header>
  );
}
