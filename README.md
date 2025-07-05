# Enveil - The Privacy-First, AI-Powered Email Client

Enveil is an open-source, performant email client built with **Next.js** and **Fastify**. It's designed to be a real competitor to other clients by focusing on three core pillars: privacy, AI-powered productivity, and a beautiful user experience.

This is a monorepo managed with `pnpm` workspaces.

- `packages/web`: The Next.js frontend application.
- `packages/api`: The Fastify backend service.

---

## Features

### Ⅰ. Core & Foundational Features

These are the absolute essentials for any modern email client. Our initial focus is on perfecting the Google account experience before expanding to other providers.

- **Google Account Integration**:

  - Start with first-class support for Gmail, Google Calendar, and Google Contacts.
  - Future support for any IMAP/SMTP provider.

- **Core Email Client**:

  - View emails, with support for threaded conversations.
  - Compose, reply, and forward with ease.
  - Mark as read/unread, star, snooze, archive, and delete.
  - Full label management (create, edit, color-code).
  - Unified Inbox to see all your mail in one place.
  - Preview, download, and add attachments.
  - Powerful and fast email search.

- **Platform & Performance**:

  - **Cross-Platform Sync**: Seamless experience across desktop (Windows, macOS, Linux) and mobile (iOS, Android).
  - **Offline Mode**: Read, queue replies, and search your email even without an internet connection.
  - **Rock-Solid Performance**: A fast, responsive, and reliable user experience is non-negotiable.

- **Productivity Suite**:
  - **Full-Fledged Calendar**: An integrated calendar that initially supports Google Calendar, with plans to support other providers.
  - **Contact Management**: A built-in address book that initially syncs with Google Contacts, with plans to expand.

### Ⅱ. Privacy & Security Features (Our Key Differentiator)

This is where we will shine as a privacy-first application.

- **End-to-End Encryption (E2EE)**: Implement OpenPGP for secure, encrypted communication between users.
- **Zero-Access Encryption**: All emails and data are encrypted on the server, making them inaccessible even to us.
- **Spy Pixel & Tracker Blocking**: Automatically block tracking pixels and images that monitor your email activity. We will show users who was trying to track them.
- **Phishing & Malware Protection**: Proactively warn users about suspicious links and attachments.
- **"Hide-my-email" Aliases**: Generate anonymous email aliases to protect users' real email addresses from spam and data breaches.
- **Password-Protected Emails**: Allow users to send encrypted emails to people who don't use our client.
- **No Data Mining or Ads**: A clear commitment to never selling user data or showing ads. Our business model will be based on premium features.
- **Open Source Transparency**: As planned, the entire codebase will be open-source for community auditing and trust.
- **Swiss-based (or similar strong privacy jurisdiction)**: If possible, legally incorporating in a country with strong data privacy laws.

### Ⅲ. AI-Powered Productivity Features

This is where we compete with the likes of Superhuman and Gmail's latest offerings.

- **AI-Powered Writing Assistant ("Help me write")**:
  - Draft emails from simple prompts (e.g., "email my team about the new deadline").
  - Rewrite text to change tone (formal, casual), shorten, or elaborate.
  - Learn the user's writing style for personalized suggestions.
  - Fix spelling and grammar mistakes as you type.
- **Smart Reply & Instant Reply**: Suggest context-aware replies, and even draft full replies for common emails.
- **Email Summarization**: Provide a one-line summary at the top of long emails and threads.
- **Intelligent Triage & Filtering ("Split Inbox")**:
  - Automatically categorize emails into logical groups (e.g., Newsletters, Notifications, Personal).
  - Allow users to create custom, AI-powered filters with natural language (e.g., "all emails about project X").
- **Natural Language Search**: "Stop searching, start asking." Allow users to find emails by asking questions like "what's the latest from Jane Doe?" or "when is my flight to London?".
- **Automated Follow-up Reminders**: Nudge users to follow up on sent emails that haven't received a reply.
- **Smart Scheduling**:
  - Quickly create calendar events from email content.
  - Suggest meeting times based on participants' availability.
- **AI-powered To-Do Lists**: Automatically detect action items in emails and suggest adding them to a to-do list.

### IV. User Experience & Customization

These features are about making the client a joy to use.

- **Command Palette**: A keyboard-driven interface for power users to navigate and perform actions quickly (like in VS Code or Slack).
- **Extensive Keyboard Shortcuts**: Fully navigable and usable without a mouse.
- **Theming**: Light, dark, and custom themes to personalize the look and feel.
- **Snooze Emails**: Temporarily remove an email from your inbox and have it reappear later.
- **Send Later**: Schedule emails to be sent at a specific time.
- **One-Click Unsubscribe**: Easily unsubscribe from mailing lists.
- **Rich Social Insights**: Display social media profiles and job titles of contacts.
