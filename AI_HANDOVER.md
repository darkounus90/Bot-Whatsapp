# AI Handoff - WhatsApp Ecommerce Bot

## Context
This project is a WhatsApp bot for an ecommerce store, designed to handle customer interactions, provide product information, and facilitate sales.

## Current Status
- **Architecture**: Migrating from scraping-based (Legacy) to the official WhatsApp Cloud API.
- **AI Persona**: Configured as "Andrés", a friendly, professional Colombian seller.
- **Persistence**: Using SQLite for session and interaction storage.
- **Integration**: OpenAI API for natural language processing.

## Recent Changes
- Updated system prompts for persona consistency.
- Configured WhatsApp Cloud API integration (Work in progress).
- Set up database schema for stores, products, and sessions.

## Pending Tasks
- Complete WhatsApp Cloud API webhooks setup.
- Implement PCI-DSS compliant payment link generation.
- Test concurrency handling with SQLite.

## Technical Details
- **Backend**: Node.js + TypeScript.
- **Database**: better-sqlite3.
- **AI**: OpenAI GPT-4o.
- **Frameworks**: Express.js for webhooks.

## Next Steps for the Next AI
1. Verify the `.env` configuration for WhatsApp and OpenAI.
2. Ensure the database schema is correctly initialized.
3. Complete the `WhatsAppChannel` implementation in `src/channels/whatsapp.ts`.
4. Test the bot flow with a live WhatsApp number.
