import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type CellValue = boolean | string;

interface ComparisonRow {
  feature: string;
  free: CellValue;
  premium: CellValue;
}

const ROWS: ComparisonRow[] = [
  { feature: "CV generations", free: "3 / month", premium: "Unlimited" },
  { feature: "Cover letter generations", free: "3 / month", premium: "Unlimited" },
  { feature: "ATS score checks", free: "3 / month", premium: "Unlimited" },
  { feature: "AI Humanizer runs", free: "3 / month", premium: "Unlimited" },
  { feature: "Free prompt library", free: true, premium: true },
  { feature: "Premium-only prompts", free: false, premium: true },
  { feature: "Faster AI generation", free: false, premium: true },
  { feature: "Priority support", free: false, premium: true },
  { feature: "Early access to new features", free: false, premium: true },
];

function ValueCell({ value }: { value: CellValue }) {
  if (value === true) {
    return (
      <div className="flex justify-center">
        <Check className="h-5 w-5 text-primary" aria-label="Included" />
      </div>
    );
  }
  if (value === false) {
    return (
      <div className="flex justify-center">
        <X className="h-5 w-5 text-muted-foreground/40" aria-label="Not included" />
      </div>
    );
  }
  return <span className="block text-center text-sm font-medium">{value}</span>;
}

export function PricingComparison() {
  return (
    <div className="mx-auto mt-16 max-w-3xl">
      <div className="mb-6 text-center">
        <h2 className="font-display text-2xl tracking-tight sm:text-3xl">Compare plans</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Everything you get on Free, and what Premium unlocks.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b-border/70 hover:bg-transparent">
              <TableHead className="w-1/2 py-4 text-left text-sm font-semibold text-foreground">
                Feature
              </TableHead>
              <TableHead className="py-4 text-center text-sm font-semibold text-foreground">
                Free
              </TableHead>
              <TableHead className="relative py-4 text-center text-sm font-semibold text-foreground">
                <span className="inline-flex items-center gap-2">
                  Premium
                  <Badge variant="secondary" className="rounded-full text-xs font-normal">
                    Best value
                  </Badge>
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ROWS.map((row, index) => (
              <TableRow
                key={row.feature}
                className={
                  index % 2 === 1 ? "bg-muted/30 hover:bg-muted/50" : "hover:bg-muted/50"
                }
              >
                <TableCell className="py-3.5 text-sm font-medium">{row.feature}</TableCell>
                <TableCell className="py-3.5">{<ValueCell value={row.free} />}</TableCell>
                <TableCell className="py-3.5 bg-primary/[0.03] dark:bg-primary/[0.06]">
                  {<ValueCell value={row.premium} />}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
