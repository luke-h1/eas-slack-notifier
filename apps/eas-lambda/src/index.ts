import { APIGatewayProxyEvent, Context, Handler } from 'aws-lambda';
import routes, { RoutePath } from './routes';
import isErrorLike from './utils/isErrorLike';
import lambdaTimeout from './utils/lambdaTimeout';

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
) => {
  const { path } = event;

  try {
    return await Promise.race([
      routes(path as RoutePath),
      lambdaTimeout(context),
    ]).then(value => value);
  } catch (e) {
    const errorBody = isErrorLike(e) ? new Error('internal server error') : e;

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: errorBody,
    };
  }
};
