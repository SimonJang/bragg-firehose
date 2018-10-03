'use strict';
module.exports = () => {
	return ctx => {
		if (!ctx.path && ctx.req.records && ctx.req.records.length > 0 && ctx.req.deliveryStreamArn.startsWith('arn:aws:firehose:')) {
			const streamName = ctx.req.deliveryStreamArn.split('/').pop();

			ctx.request.body = ctx.req.records.map(record => {
				return {
					recordId: record.recordId,
					approximateArrivalTimestamp: record.approximateArrivalTimestamp,
					data: Buffer.from(record.data, 'base64').toString()
				};
			});

			Object.defineProperty(ctx, 'path', {enumerable: true, value: `firehose:${streamName}`});
			Object.defineProperty(ctx, 'method', {enumerable: true, value: 'post'});
		}
	};
};
