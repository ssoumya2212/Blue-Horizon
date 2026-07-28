import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface DownloadWindowsButtonProps {
  className?: string;
}

export function DownloadWindowsButton({
  className,
}: DownloadWindowsButtonProps) {
  return (
    <Button asChild size="lg" className={cn("w-full", className)}>
      <a href="/Blue-Horizon-Setup.exe" download>
        <Download className="mr-2 h-5 w-5" /> Download for Windows
      </a>
    </Button>
  );
}
