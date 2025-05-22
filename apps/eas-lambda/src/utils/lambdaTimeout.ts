import { Context } from 'aws-lambda';

const lambdaTimeout = (context: Context) =>
  new Promise((_res, rej) => {
    setTimeout(() => {
      rej(new Error('timeout'));
    }, context.getRemainingTimeInMillis() - 1000);
  });
export default lambdaTimeout;
