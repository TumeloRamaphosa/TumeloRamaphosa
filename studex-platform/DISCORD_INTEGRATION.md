# 🎮 Discord Integration Guide

**Real-time communication hub connecting StudEx operations to Discord servers**

---

## Overview

Discord Integration provides unified access to your command centers and agent channels directly from the StudEx platform. Monitor, coordinate, and communicate with your team in real-time.

---

## Connected Servers

### 1. Gaming Server 🎮
**Server ID:** `903254959703851098`  
**Purpose:** Infrastructure & VM Status Updates  
**Members:** 15  
**Status:** Online

#### Channels:
- **#vm-status** — Real-time VM health reports and alerts
- **#agent-updates** — Agent activity and task completion notifications
- **#general** — General discussion and announcements
- **🔊 voice-chat** — Real-time coordination and meetings

---

### 2. Operations Center 🏭
**Server ID:** `1527423712595410974`  
**Purpose:** Primary Command & Control Server  
**Members:** 25  
**Status:** Online

#### Channels:
- **#war-room** — War Room mission control updates and decisions
- **#board-meetings** — Board meeting transcripts and decisions
- **#agent-channel** — Direct communication with agents
- **#standups** — Daily standup presentations (9 AM SAST)
- **#alerts** — Critical system alerts and incidents
- **🔊 voice-operations** — Live operations channel

---

## Discord Bot Commands

Once the Discord bot is connected, use these commands in any channel:

| Command | Purpose | Example |
|---------|---------|---------|
| `!status` | Get War Room VM and agent status | `!status war-room` |
| `!agents` | List all connected agents | `!agents` |
| `!tasks` | Show current executing tasks | `!tasks [agent-name]` |
| `!health` | System health check | `!health` |
| `!deploy` | Trigger deployment (admin only) | `!deploy dark-factory` |

---

## Features

### Real-Time Monitoring
- Live server status indicators
- Member count tracking
- Channel activity monitoring
- Message history viewing

### Integration Capabilities
- Post agent status updates to Discord
- Receive critical alerts in Discord channels
- Trigger tasks from Discord commands
- Stream live metrics to Discord

### Access Control
- Role-based channel access
- Admin-only commands
- Audit logging for all integrations
- Secure token management

---

## Setup Instructions

### 1. Configure Bot Token

Add your Discord bot token to `.env.local`:

```bash
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here
```

### 2. Create Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Name it "StudEx Operations Bot"
4. Go to "Bot" section and create a bot
5. Copy the bot token to your `.env.local`
6. Enable these **Intents:**
   - Server Members Intent
   - Message Content Intent
   - Presence Intent

### 3. Invite Bot to Servers

Use this URL (replace `YOUR_CLIENT_ID`):
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands
```

### 4. Test Connection

Navigate to `/discord` and verify:
- ✅ Both servers appear in the server list
- ✅ Channels load correctly
- ✅ Message history displays
- ✅ "Connected" status shows in the bot status bar

---

## Webhook Integration

### Outgoing Webhooks (Platform → Discord)

Your platform can send messages to Discord when:
- **Agent Standup:** Posted to `#standups` at 9 AM
- **Board Meeting:** Results posted to `#board-meetings` at 11:30 AM
- **Task Completion:** Posted to `#agent-updates` on task finish
- **System Alert:** Posted to `#alerts` on critical errors

### Incoming Webhooks (Discord → Platform)

React to Discord events by:
- `/task` — Create a new task from Discord
- `/notify` — Send a notification to War Room
- `/broadcast` — Message all agents

---

## Privacy & Security

### Data Handling
- Messages are not permanently stored by StudEx
- Read-only access to message history
- No message editing or deletion from platform
- Audit logs of all integrations

### Permissions
- Bot requires minimal permissions (read messages only)
- Uses Discord's built-in role and channel permissions
- API tokens stored securely in environment variables
- No user data collected beyond message IDs

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Bot offline | Check `DISCORD_BOT_TOKEN` in `.env.local` |
| Channels not showing | Verify bot has "Manage Channels" permission |
| Messages not loading | Clear browser cache, refresh `/discord` page |
| Commands not working | Ensure bot has "Send Messages" permission |
| Connection timeout | Check internet connection and Discord API status |

---

## Future Enhancements

- [ ] **Voice Integration:** Join voice channels for standup meetings
- [ ] **Rich Embeds:** Format messages with Discord embeds
- [ ] **Role-Based Access:** Control channel access by Discord roles
- [ ] **Scheduled Messages:** Auto-post standups to Discord
- [ ] **Analytics Dashboard:** Discord metrics and engagement tracking
- [ ] **Mobile App:** iOS/Android Discord companion app
- [ ] **Slash Commands:** Discord-native `/command` support
- [ ] **Message Reactions:** React to messages to trigger actions

---

## Contact & Support

**Bot Administrator:** OpenCode  
**Setup Issues:** @OpenCode on Discord  
**Feature Requests:** Discord channel #feature-requests  

---

**Last Updated:** 2026-07-24  
**Status:** Production Ready  
**Bot Version:** 1.0.0

