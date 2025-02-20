import type { ComponentProps } from "react";

import { type SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { SidebarLeftIcon } from "./icons";
import { Button } from "./ui/button";
import { Columns2, PanelLeftOpen } from "lucide-react";

export function SidebarToggle({
  className,
}: ComponentProps<typeof SidebarTrigger>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      onClick={toggleSidebar}
      variant="outline"
      className="md:px-2 md:h-fit border border-[#218075] rounded-[8px]"
    >
      <Columns2 className="text-[#218075]" />
    </Button>
  );
}
