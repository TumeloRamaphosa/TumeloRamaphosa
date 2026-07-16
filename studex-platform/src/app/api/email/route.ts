import { NextRequest, NextResponse } from 'next/server';

interface EmailConfig {
  agentEmail: string;
  claudeEmail: string;
  gmailApiKey: string;
  agentMailApiKey: string;
  notionToken: string;
  autoSyncInterval: number;
  autoCreateTasks: boolean;
}

interface EmailAccount {
  id: string;
  email: string;
  type: 'agent' | 'claude' | 'personal';
  service: 'gmail' | 'agent-mail' | 'notion';
  status: 'connected' | 'disconnected' | 'pending';
}

let emailConfig: EmailConfig = {
  agentEmail: 'agents@studex.cloud',
  claudeEmail: 'claude.assistant@studex.cloud',
  gmailApiKey: '',
  agentMailApiKey: '',
  notionToken: '',
  autoSyncInterval: 5,
  autoCreateTasks: true,
};

let connectedAccounts: Map<string, EmailAccount> = new Map();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, accountId, config } = body;

    if (action === 'connect-account') {
      const account: EmailAccount = {
        id: accountId,
        email: accountId === 'agent' ? 'agents@studex.cloud' : 'claude.assistant@studex.cloud',
        type: accountId === 'agent' ? 'agent' : 'claude',
        service: accountId === 'agent' ? 'agent-mail' : 'gmail',
        status: 'pending',
      };

      if (config.gmailApiKey && accountId === 'claude') {
        try {
          const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${config.gmailApiKey}` },
          });

          if (response.ok) {
            account.status = 'connected';
            connectedAccounts.set(accountId, account);
            emailConfig = config;
            return NextResponse.json({ success: true, account });
          }
        } catch (error) {
          return NextResponse.json({ success: false, error: 'Gmail API validation failed' }, { status: 400 });
        }
      } else if (config.agentMailApiKey && accountId === 'agent') {
        account.status = 'connected';
        connectedAccounts.set(accountId, account);
        emailConfig = config;
        return NextResponse.json({ success: true, account });
      }

      return NextResponse.json({ success: false, error: 'Missing API credentials' }, { status: 400 });
    }

    if (action === 'save-config') {
      emailConfig = config;
      return NextResponse.json({ success: true, config: emailConfig });
    }

    if (action === 'get-config') {
      return NextResponse.json(emailConfig);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');
  const accountId = searchParams.get('accountId');

  if (action === 'test-sync' && accountId) {
    try {
      const account = connectedAccounts.get(accountId);
      if (!account || account.status !== 'connected') {
        return NextResponse.json({ success: false, error: 'Account not connected' }, { status: 400 });
      }

      // Simulate email sync - in production, this would fetch from Gmail/Agent Mail
      const emailsProcessed = Math.floor(Math.random() * 20) + 5;

      return NextResponse.json({
        success: true,
        emailsProcessed,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return NextResponse.json({ error: String(error) }, { status: 500 });
    }
  }

  if (action === 'config') {
    return NextResponse.json(emailConfig);
  }

  if (action === 'accounts') {
    const accounts = Array.from(connectedAccounts.values());
    return NextResponse.json({ accounts });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
