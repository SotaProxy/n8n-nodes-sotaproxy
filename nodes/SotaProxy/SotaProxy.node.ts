import type { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class SotaProxy implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'SotaProxy',
		name: 'sotaProxy',
		icon: 'file:sotaproxy.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Buy and manage residential, ISP, IPv4/IPv6 and mobile proxies',
		defaults: {
			name: 'SotaProxy',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'sotaProxyApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.sotaproxy.com/api/v1',
			headers: {
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Account', value: 'account' },
					{ name: 'Catalog', value: 'catalog' },
					{ name: 'Order', value: 'order' },
					{ name: 'Proxy', value: 'proxy' },
				],
				default: 'account',
			},

			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['account'] } },
				options: [
					{
						name: 'Get Balance',
						value: 'getBalance',
						description: 'Get the prepaid balance available to spend',
						action: 'Get the prepaid balance',
						routing: { request: { method: 'GET', url: '/balance' } },
					},
					{
						name: 'Get Account Info',
						value: 'getMe',
						description: 'Get information about the authenticated account',
						action: 'Get account info',
						routing: { request: { method: 'GET', url: '/me' } },
					},
				],
				default: 'getBalance',
			},

			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['catalog'] } },
				options: [
					{
						name: 'List Products',
						value: 'listProducts',
						description: 'List sellable products with their countries and rental periods',
						action: 'List products',
						routing: { request: { method: 'GET', url: '/products' } },
					},
					{
						name: 'List Mobile Tariffs',
						value: 'listMobileTariffs',
						description: 'List mobile tariffs by country and carrier',
						action: 'List mobile tariffs',
						routing: { request: { method: 'GET', url: '/mobile/tariffs' } },
					},
				],
				default: 'listProducts',
			},

			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['order'] } },
				options: [
					{
						name: 'Quote',
						value: 'quote',
						description: 'Get the exact price for a prospective order without charging',
						action: 'Quote an order',
						routing: {
							request: {
								method: 'POST',
								url: '/quote',
								body: {
									product: '={{$parameter["product"]}}',
									countryId: '={{$parameter["countryId"]}}',
									periodId: '={{$parameter["periodId"]}}',
									quantity: '={{$parameter["quantity"]}}',
								},
							},
						},
					},
					{
						name: 'Create',
						value: 'create',
						description:
							'Buy and provision proxies, charging your prepaid balance. Requires a key with the "trade" scope',
						action: 'Create an order',
						routing: {
							request: {
								method: 'POST',
								url: '/orders',
								headers: {
									'Idempotency-Key': '={{$parameter["idempotencyKey"]}}',
								},
								body: {
									product: '={{$parameter["product"]}}',
									countryId: '={{$parameter["countryId"]}}',
									periodId: '={{$parameter["periodId"]}}',
									quantity: '={{$parameter["quantity"]}}',
								},
							},
						},
					},
					{
						name: 'List',
						value: 'list',
						description: 'List order history',
						action: 'List orders',
						routing: { request: { method: 'GET', url: '/orders' } },
					},
					{
						name: 'Get Proxies',
						value: 'getProxies',
						description: 'Get the credentials issued for an order',
						action: 'Get order proxies',
						routing: {
							request: {
								method: 'GET',
								url: '=/orders/{{$parameter["orderId"]}}/proxies',
							},
						},
					},
				],
				default: 'quote',
			},

			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['proxy'] } },
				options: [
					{
						name: 'List',
						value: 'list',
						description: 'List every active proxy on the account',
						action: 'List proxies',
						routing: { request: { method: 'GET', url: '/proxies' } },
					},
					{
						name: 'Quote Renewal',
						value: 'quoteRenewal',
						description: 'Get the price to renew a proxy without charging',
						action: 'Quote a renewal',
						routing: {
							request: {
								method: 'GET',
								url: '=/proxies/{{$parameter["proxyId"]}}/renew-quote',
							},
						},
					},
					{
						name: 'Renew',
						value: 'renew',
						description: 'Renew a proxy after confirming the price',
						action: 'Renew a proxy',
						routing: {
							request: {
								method: 'POST',
								url: '=/proxies/{{$parameter["proxyId"]}}/renew',
								headers: {
									'Idempotency-Key': '={{$parameter["idempotencyKey"]}}',
								},
							},
						},
					},
				],
				default: 'list',
			},

			{
				displayName: 'Product',
				name: 'product',
				type: 'options',
				options: [
					{ name: 'IPv4', value: 'ipv4' },
					{ name: 'IPv6', value: 'ipv6' },
					{ name: 'ISP (Static Residential)', value: 'isp' },
				],
				default: 'ipv4',
				required: true,
				displayOptions: {
					show: { resource: ['order'], operation: ['quote', 'create'] },
				},
				description: 'Which product to price or buy',
			},
			{
				displayName: 'Country ID',
				name: 'countryId',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: {
					show: { resource: ['order'], operation: ['quote', 'create'] },
				},
				description:
					'Numeric country ID from the Catalog to List Products response (for example 565 for US)',
			},
			{
				displayName: 'Period ID',
				name: 'periodId',
				type: 'string',
				default: '1m',
				required: true,
				displayOptions: {
					show: { resource: ['order'], operation: ['quote', 'create'] },
				},
				description: 'Rental period ID from List Products, such as 1w or 1m',
			},
			{
				displayName: 'Quantity',
				name: 'quantity',
				type: 'number',
				typeOptions: { minValue: 1 },
				default: 1,
				required: true,
				displayOptions: {
					show: { resource: ['order'], operation: ['quote', 'create'] },
				},
				description: 'How many proxies to price or buy',
			},
			{
				displayName: 'Idempotency Key',
				name: 'idempotencyKey',
				type: 'string',
				default: '={{$execution.id}}',
				required: true,
				displayOptions: {
					show: { resource: ['order'], operation: ['create'] },
				},
				description:
					'Unique key so a network retry can never double-charge. Defaults to the n8n execution ID.',
			},
			{
				displayName: 'Order ID',
				name: 'orderId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: { resource: ['order'], operation: ['getProxies'] },
				},
				description: 'ID of the order to read credentials for',
			},
			{
				displayName: 'Proxy ID',
				name: 'proxyId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: { resource: ['proxy'], operation: ['quoteRenewal', 'renew'] },
				},
				description: 'ID of the proxy to price or renew',
			},
			{
				displayName: 'Idempotency Key',
				name: 'idempotencyKey',
				type: 'string',
				default: '={{$execution.id}}',
				required: true,
				displayOptions: {
					show: { resource: ['proxy'], operation: ['renew'] },
				},
				description:
					'Unique key so a network retry can never double-charge. Defaults to the n8n execution ID.',
			},
		],
	};
}
