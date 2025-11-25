import { useParams } from 'react-router';
import { EventExecutionDashboard } from '~/features/event-execution/components/event-dashboard/EventExecutionDashboard';

export default function EventExecutionPage() {
  const { eventId } = useParams();

  if (!eventId) {
    return <div>Event not found</div>;
  }

  return <EventExecutionDashboard eventId={eventId} />;
}
