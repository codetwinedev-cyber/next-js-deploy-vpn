import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <h2 className="text-3xl font-bold">Countdown Not Found</h2>
      <p className="text-muted-foreground">
        The countdown you&apos;re looking for doesn&apos;t exist or has been
        removed.
      </p>
      <Button render={<Link href="/" />}>Create a new countdown</Button>
    </div>
  );
}
