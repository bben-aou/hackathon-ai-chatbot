"use client";

import { useRouter } from "next/navigation";
import { useWindowSize } from "usehooks-ts";

import { SidebarToggle } from "@/components/sidebar-toggle";
import { Button } from "@/components/ui/button";
import { useSidebar } from "./ui/sidebar";
import { memo } from "react";
import { VisibilityType } from "./visibility-selector";
import { Plus } from "lucide-react";
import Image from "next/image";

function PureChatHeader({}: Readonly<{
  chatId: string;
  selectedModelId: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
}>) {
  const router = useRouter();
  const { open } = useSidebar();
  const { width: windowWidth } = useWindowSize();

  return (
    <header className="flex sticky  gap-[10px] top-0 bg-background py-1.5 items-center px-2 md:px-2">
     {!open && <Image src={"/minLogo.svg"} height={70} width={70} alt="logo" />}
      <SidebarToggle />

      {(!open || windowWidth < 768) && (
        <Button
          variant="outline"
          className="order-2 md:order-1 md:px-2 px-2 md:h-fit ml-auto md:ml-0 border border-[#218075] rounded-[8px]"
          onClick={() => {
            router.push("/");
            router.refresh();
          }}
        >
          <Plus className="text-[#218075]" />
          <span className="md:sr-only">New Chat</span>
        </Button>
      )}
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  return prevProps.selectedModelId === nextProps.selectedModelId;
});
