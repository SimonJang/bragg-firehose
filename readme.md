# bragg-firehose [![Build Status](https://travis-ci.org/SimonJang/bragg-firehose.svg?branch=master)](https://travis-ci.org/SimonJang/bragg-firehose)

> bragg middleware for Firehose transformation Lambda trigger

## About

This [bragg](https://github.com/SamVerschueren/bragg) middleware converts the AWS Kinesis [Firehose](https://aws.amazon.com/kinesis/data-firehose/) data stream to a typical `bragg` request data structure. The implementation of a `bragg` Lambda for Firehose data transformation follows a strict structure and failure to implement the Lambda according to those rules will result in an error. See the documentation [here]((https://docs.aws.amazon.com/firehose/latest/dev/data-transformation.html)) and [here](https://docs.aws.amazon.com/firehose/latest/dev/record-format-conversion.html)

> All transformed records from Lambda must contain the following parameters, or Kinesis Data Firehose rejects them and treats that as a data transformation failure.

**recordId**:
The record ID is passed from Kinesis Data Firehose to Lambda during the invocation. The transformed record must contain the same record ID. Any mismatch between the ID of the original record and the ID of the transformed record is treated as a data transformation failure.

**result**:
The status of the data transformation of the record. The possible values are: Ok (the record was transformed successfully), Dropped (the record was dropped intentionally by your processing logic), and ProcessingFailed (the record could not be transformed). If a record has a status of Ok or Dropped, Kinesis Data Firehose considers it successfully processed. Otherwise, Kinesis Data Firehose considers it unsuccessfully processed.

**data**:
The transformed data payload, after base64-encoding.



## Install

```
$ npm install bragg-firehose
```


## Usage

```js
const app = require('bragg');
const router = require('bragg-router');
const firehose = require('bragg-firehose');

const app = bragg();
// Install the Firehose bragg middleware
app.use(firehose());
app.use(routes());

const routes = () => {
	const router = router();

	router.post('forehose:myStreamName', ctx => {
		ctx.body = [
			{
				recordId: 'myReceivedRecordId',
				result: 'Ok',
				data: 'eyJmb28iOiJiYXIifQ=='
			}
		];
	});

	return router.routes();
};

export const handler = app.listen();
```


## API

### `firehose()`

Install the [bragg](https://github.com/SamVerschueren/bragg) Firehose middleware

## License

MIT © [Simon Jang](https://github.com/SimonJang)
