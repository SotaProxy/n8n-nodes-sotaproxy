# n8n-nodes-sotaproxy

An n8n community node for [SotaProxy](https://sotaproxy.com) — buy and manage residential, ISP, IPv4/IPv6 and mobile proxies directly from your workflows.

Your balance is prepaid, so a workflow can never spend more than you have topped up, and purchase operations accept an idempotency key so a retry can't double-charge.

[Installation](#installation) · [Credentials](#credentials) · [Operations](#operations) · [Resources](#resources)

## Installation

Follow the [community node installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) and use the package name:

```
n8n-nodes-sotaproxy
```

## Credentials

You need a SotaProxy API key.

1. Sign up at [app.sotaproxy.com](https://app.sotaproxy.com/signup) and top up your balance.
2. Open the API section of the dashboard and create a key. The secret is shown only once.
3. In n8n, create new **SotaProxy API** credentials and paste the key.

Keys can be scoped. A `read` key can browse the catalog, balance and existing proxies but cannot buy anything. A `trade` key can also create and renew orders. If you only need reporting workflows, use a `read` key.

The credential includes a connection test that calls `GET /ping`, so you get immediate feedback on whether the key works.

## Operations

**Account**
- Get Balance — prepaid balance available to spend
- Get Account Info — details of the authenticated account

**Catalog**
- List Products — sellable products with their countries and rental periods
- List Mobile Tariffs — mobile tariffs by country and carrier

**Order**
- Quote — exact price for a prospective order, no charge
- Create — buy and provision proxies (requires a `trade` key and an idempotency key)
- List — order history
- Get Proxies — credentials issued for an order

**Proxy**
- List — every active proxy on the account
- Quote Renewal — price to renew, no charge
- Renew — renew after confirming the price

### Typical flow

Quote first, then buy. A common pattern is Catalog → List Products to find the `countryId` and `periodId`, then Order → Quote to check the price against your balance, then Order → Create.

Note that proxies for a new order can take a few minutes to appear, especially IPv6. Poll Order → Get Proxies until credentials are returned rather than assuming they are ready immediately.

## Compatibility

Tested against n8n API version 1. Requires Node.js 20.15 or newer.

## Resources

- [SotaProxy REST API documentation](https://sotaproxy.com/en/api-docs)
- [SotaProxy MCP server](https://sotaproxy.com/mcp) — the same operations for AI agents
- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)

## License

[MIT](LICENSE.md)
