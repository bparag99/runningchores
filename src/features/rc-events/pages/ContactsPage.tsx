/**
 * ContactsPage - Wrapper component that imports and renders the ContactsPage from lib
 * This provides a page-level view of all event contacts
 */
import { ContactsPage as ContactsPageComponent } from '../app/lib/ContactsPage';

export function ContactsPage() {
  return <ContactsPageComponent />;
}
