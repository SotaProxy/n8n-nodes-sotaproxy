import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class SotaProxyApi implements ICredentialType {
	name = 'sotaProxyApi';

	displayName = 'SotaProxy API';

	documentationUrl = 'https://sotaproxy.com/en/api-docs';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'Create a key in the API section of your SotaProxy dashboard. The secret is shown only once. Keys can be scoped: "read" browses only, "trade" can create and renew orders.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.sotaproxy.com/api/v1',
			url: '/ping',
			method: 'GET',
		},
	};
}
