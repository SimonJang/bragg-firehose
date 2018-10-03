import test from 'ava';
import firehoseMiddleware from '.';

const defaultReq = {
	invocationId: 'e49c593f-d8fd-42ea-9ec9-c51974cbcb4a',
	deliveryStreamArn: 'arn:aws:firehose:eu-west-1:005279744545:deliverystream/datastream-test',
	region: 'eu-west-1'
};

const records = [
	{
		recordId: '49588843307896965743218796649441056449016048854870523906000000',
		approximateArrivalTimestamp: 1538586550503,
		data: 'eyJ0aWNrZXJfc3ltYm9sIjoiV0FTIiwic2VjdG9yIjoiUkVUQUlMIiwiY2hhbmdlIjotMC41OSwicHJpY2UiOjExLjkyfQ=='
	},
	{
		recordId: '49588843307896965743218796649442265374835663484045230082000000',
		approximateArrivalTimestamp: 1538586550505,
		data: 'eyJ0aWNrZXJfc3ltYm9sIjoiQVNEIiwic2VjdG9yIjoiRklOQU5DSUFMIiwiY2hhbmdlIjowLjA1LCJwcmljZSI6NjUuODV9'
	},
	{
		recordId: '49588843307896965743218796649443474300655278113219936258000000',
		approximateArrivalTimestamp: 1538586550505,
		data: 'eyJ0aWNrZXJfc3ltYm9sIjoiSEpWIiwic2VjdG9yIjoiRU5FUkdZIiwiY2hhbmdlIjotMC43MywicHJpY2UiOjIwNC4yN30='
	}
];

test('middleware should process a Firehose event', t => {
	const ctx = {
		req: Object.assign({}, defaultReq, {records}),
		request: {}
	};

	firehoseMiddleware()(ctx);

	t.deepEqual(ctx, {
		req: {
			invocationId: 'e49c593f-d8fd-42ea-9ec9-c51974cbcb4a',
			deliveryStreamArn: 'arn:aws:firehose:eu-west-1:005279744545:deliverystream/datastream-test',
			region: 'eu-west-1',
			records: [
				{
					recordId: '49588843307896965743218796649441056449016048854870523906000000',
					approximateArrivalTimestamp: 1538586550503,
					data: 'eyJ0aWNrZXJfc3ltYm9sIjoiV0FTIiwic2VjdG9yIjoiUkVUQUlMIiwiY2hhbmdlIjotMC41OSwicHJpY2UiOjExLjkyfQ=='
				},
				{
					recordId: '49588843307896965743218796649442265374835663484045230082000000',
					approximateArrivalTimestamp: 1538586550505,
					data: 'eyJ0aWNrZXJfc3ltYm9sIjoiQVNEIiwic2VjdG9yIjoiRklOQU5DSUFMIiwiY2hhbmdlIjowLjA1LCJwcmljZSI6NjUuODV9'
				},
				{
					recordId: '49588843307896965743218796649443474300655278113219936258000000',
					approximateArrivalTimestamp: 1538586550505,
					data: 'eyJ0aWNrZXJfc3ltYm9sIjoiSEpWIiwic2VjdG9yIjoiRU5FUkdZIiwiY2hhbmdlIjotMC43MywicHJpY2UiOjIwNC4yN30='
				}
			]
		},
		request: {
			body: [
				{
					recordId: '49588843307896965743218796649441056449016048854870523906000000',
					approximateArrivalTimestamp: 1538586550503,
					data: '{"ticker_symbol":"WAS","sector":"RETAIL","change":-0.59,"price":11.92}'
				},
				{
					recordId: '49588843307896965743218796649442265374835663484045230082000000',
					approximateArrivalTimestamp: 1538586550505,
					data: '{"ticker_symbol":"ASD","sector":"FINANCIAL","change":0.05,"price":65.85}'
				},
				{
					recordId: '49588843307896965743218796649443474300655278113219936258000000',
					approximateArrivalTimestamp: 1538586550505,
					data: '{"ticker_symbol":"HJV","sector":"ENERGY","change":-0.73,"price":204.27}'
				}
			]
		},
		path: 'firehose:datastream-test',
		method: 'post'
	});
});

test('middleware should ingore non-Firehose events', t => {
	const context = {
		request: {
			params: {
				user: 'Foo'
			}
		},
		path: 'login',
		method: 'post'
	};

	firehoseMiddleware()(context);

	t.deepEqual(context, {
		request: {
			params: {
				user: 'Foo'
			}
		},
		path: 'login',
		method: 'post'
	});
});
