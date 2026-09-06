import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface ChildTabsProps {
  childList: Array<{ id: string; name: string; grade: string }>;
  selectedChildId: string;
}

export function ChildTabs({ childList, selectedChildId }: ChildTabsProps) {
  return (
    <div className="flex gap-1 rounded-xl bg-muted p-1">
      {childList.map((child) => (
        <Link
          key={child.id}
          href={{ pathname: "/planner", query: { child: child.id } }}
          className={cn(
            "rounded-lg px-4 py-2 font-semibold text-sm transition",
            child.id === selectedChildId
              ? "bg-background text-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {child.name} ({child.grade})
        </Link>
      ))}
    </div>
  );
}
