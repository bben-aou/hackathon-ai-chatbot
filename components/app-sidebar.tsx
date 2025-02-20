"use client";

import type { User } from "next-auth";
import { useRouter } from "next/navigation";

import { PlusIcon } from "@/components/icons";
import { SidebarHistory } from "@/components/sidebar-history";
import { SidebarUserNav } from "@/components/sidebar-user-nav";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";

export function AppSidebar({ user }: { user: User | undefined }) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar className="group-data-[side=left]:border-r-0 ">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row justify-between items-center  ">
            <Link
              href="/"
              onClick={() => {
                setOpenMobile(false);
              }}
              className="flex flex-row gap-3 items-center"
            >
              <div className="text-lg font-semibold px-2 hover:bg-muted  rounded-md cursor-pointer">
                <Image src={"/minLogo.svg"} height={70} width={70} alt="logo" />
              </div>
            </Link>
            <Button
              variant="ghost"
              type="button"
              className="p-2 h-fit border border-[#218075] rounded-[8px]"
              onClick={() => {
                setOpenMobile(false);
                router.push("/");
                router.refresh();
              }}
            >
              <Plus className="text-[#218075]" />
            </Button>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarHistory user={user} />
      </SidebarContent>
      <SidebarFooter>{user && <SidebarUserNav user={user} />}</SidebarFooter>
    </Sidebar>
  );
}
