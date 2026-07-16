import { NextRequest, NextResponse } from 'next/server';

interface IntegrationStatus {
  name: string;
  status: 'connected' | 'disconnected' | 'configuring';
  lastSync?: Date;
  dataPoints?: number;
}

let integrationStatuses: Map<string, IntegrationStatus> = new Map([
  ['notion', { name: 'Notion', status: 'disconnected' }],
  ['agentmail', { name: 'Agent Mail', status: 'disconnected' }],
  ['linear', { name: 'Linear', status: 'disconnected' }],
  ['shopify', { name: 'Shopify', status: 'disconnected' }],
]);

let integrationConfigs: Record<string, any> = {};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, integration, config } = body;

    if (action === 'connect') {
      const status = integrationStatuses.get(integration);
      if (status) {
        status.status = 'configuring';

        // Test connection based on integration type
        let connected = false;

        switch (integration) {
          case 'notion':
            connected = config.token?.length > 0;
            break;
          case 'agentmail':
            connected = config.apiKey?.length > 0;
            break;
          case 'linear':
            connected = config.apiKey?.length > 0;
            break;
          case 'shopify':
            connected = config.accessToken?.length > 0;
            break;
        }

        if (connected) {
          status.status = 'connected';
          status.lastSync = new Date();
          integrationConfigs[integration] = config;

          return NextResponse.json({
            success: true,
            message: `${integration} connected successfully`,
            status,
          });
        }

        status.status = 'disconnected';
        return NextResponse.json({
          success: false,
          error: 'Invalid credentials or missing configuration',
        }, { status: 400 });
      }

      return NextResponse.json({
        success: false,
        error: 'Integration not found',
      }, { status: 404 });
    }

    if (action === 'sync') {
      const status = integrationStatuses.get(integration);
      if (!status || status.status !== 'connected') {
        return NextResponse.json({
          success: false,
          error: 'Integration not connected',
        }, { status: 400 });
      }

      // Simulate sync based on integration type
      let itemsProcessed = 0;

      switch (integration) {
        case 'notion':
          itemsProcessed = Math.floor(Math.random() * 50) + 10;
          break;
        case 'agentmail':
          itemsProcessed = Math.floor(Math.random() * 20) + 5;
          break;
        case 'linear':
          itemsProcessed = Math.floor(Math.random() * 30) + 5;
          break;
        case 'shopify':
          itemsProcessed = Math.floor(Math.random() * 10) + 1;
          break;
      }

      status.lastSync = new Date();
      status.dataPoints = (status.dataPoints || 0) + itemsProcessed;

      return NextResponse.json({
        success: true,
        integration,
        itemsProcessed,
        timestamp: new Date().toISOString(),
      });
    }

    if (action === 'disconnect') {
      const status = integrationStatuses.get(integration);
      if (status) {
        status.status = 'disconnected';
        delete integrationConfigs[integration];

        return NextResponse.json({
          success: true,
          message: `${integration} disconnected`,
        });
      }

      return NextResponse.json({
        success: false,
        error: 'Integration not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      error: 'Invalid action',
    }, { status: 400 });
  } catch (error) {
    return NextResponse.json({
      error: String(error),
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');

  if (action === 'status') {
    const integrations = Array.from(integrationStatuses.values());
    return NextResponse.json({ integrations });
  }

  if (action === 'config') {
    const integration = searchParams.get('integration');
    if (integration && integrationConfigs[integration]) {
      return NextResponse.json({
        success: true,
        config: integrationConfigs[integration],
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Integration config not found',
    }, { status: 404 });
  }

  return NextResponse.json({
    error: 'Invalid action',
  }, { status: 400 });
}
