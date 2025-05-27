import { APIGatewayProxyEvent, Context, Handler } from 'aws-lambda';
import routes, { RoutePath } from './routes';
import lambdaTimeout from './utils/lambdaTimeout';

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
) => {
  const { path } = event;

  try {
    return await Promise.race([
      routes(path as RoutePath, event.body, event.queryStringParameters),
      lambdaTimeout(context),
    ]).then(value => value);
  } catch (e) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: e,
    };
  }
};
