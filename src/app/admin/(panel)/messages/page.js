import { getMessages } from '@/lib/content';
import MessageList from '@/components/admin/MessageList';

export const metadata = { title: 'Messages · Admin' };

export default async function MessagesPage() {
  const messages = await getMessages();
  return <MessageList initial={messages} />;
}
