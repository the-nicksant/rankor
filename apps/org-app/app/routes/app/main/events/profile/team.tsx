import type { Route } from "./+types/team";
import { Skeleton } from "@repo/ui/skeleton";
import { motion } from "motion/react";
import { EventTeamManagement } from "~/features/event-execution/components/team-access/EventTeamManagement";

export function Loading() {
  return (
    <div className="w-full py-4 flex flex-col gap-4">
      <Skeleton className="w-full h-[200px]" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-[300px]" />
        <Skeleton className="h-[300px]" />
      </div>
    </div>
  );
}

export default function TeamPage({ params }: Route.ComponentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full py-4"
    >
      <EventTeamManagement eventId={params.eventId} />
    </motion.div>
  );
}
