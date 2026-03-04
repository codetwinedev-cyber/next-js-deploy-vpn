import { Loader2 } from "lucide-react";

export default function CountdownLoading() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-24">
      <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      <p className="mt-4 text-muted-foreground">Loading countdown...</p>
    </div>
  );
}
