import {
  UserCircleIcon,
  HomeIcon,
  BookmarkIcon,
  ArrowLeftOnRectangleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";

export const menuItems = [
  {
    label: "Home",
    icon: HomeIcon,
    href: "/",
  },
  // {
  //   label: "Profile",
  //   icon: UserCircleIcon,
  //   href: "/profile",
  // },
  {
    label: "Setting",
    icon: Cog6ToothIcon,
    href: "/plans",
  },
  {
    label: "Dashboard",
    icon: BookmarkIcon,
    href: "/dashboard/welcome",
  },
  {
    label: "Logout",
    icon: ArrowLeftOnRectangleIcon,
    onClick: signOut,
  },
];
export const navigation = [
  { name: "For Businesses", href: "/forbusinesses" },
  { name: "For Lawyers", href: "/forlawyers" },
  // { name: "Pricing", href: "/pricing" },
  // { name: "Resources", href: "/resources" },
];
const solutions = [
  {
    name: "GitHub Copilot",
    description: "",
    href: "##",
    // icon: Hexa,
  },
  {
    name: "Open AI Dall E",
    description: "",
    href: "##",
    // icon: Hexa,
  },
  {
    name: "Open AI GPT-3",
    description: "",
    href: "##",
    // icon: Hexa,
  },
  {
    name: "Midjourny",
    description: "",
    href: "##",
    // icon: Hexa,
  },
  {
    name: "Stable-diffusion",
    description: "",
    href: "##",
    // icon: Hexa,
  },
  //   {
  //     name: "Imagen",
  //     description: "",
  //     href: "##",
  //     // icon: Hexa,
  //   },
  //   {
  //     name: "Craiyon",
  //     description: "",
  //     href: "##",
  //     icon: Hexa,
  //   },
  //   {
  //     name: "Musenet",
  //     description: "",
  //     href: "##",
  //     icon: Hexa,
  //   },
  //   {
  //     name: "Jukebox",
  //     description: "",
  //     href: "##",
  //     icon: Hexa,
  //   },
  //   {
  //     name: "Cogvideo",
  //     description: "",
  //     href: "##",
  //     icon: Hexa,
  //   },
  //   {
  //     name: "Bloom",
  //     description: "",
  //     href: "##",
  //     icon: Hexa,
  //   },
];
