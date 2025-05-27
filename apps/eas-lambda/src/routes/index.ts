/* eslint-disable no-console */
import { easBuildHandler } from '@lambda/handlers/eas/build';
import { easSubmitHandler } from '@lambda/handlers/eas/submit';
import healthHandler from '@lambda/handlers/health';
import versionHandler from '@lambda/handlers/version';
import { slackService } from '@lambda/services';
import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda';

export type RoutePath =
  | '/api/health'
  | '/api/version'
  | '/api/eas-submit'
  | '/api/eas-build';

const routes = async (
  path: RoutePath,
  body: string | null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _queryStringParameters?: APIGatewayProxyEventQueryStringParameters | null,
) => {
  let response: unknown;

  switch (path) {
    /**
     * @see terraform/gateway.tf for a list of valid routes
     */
    case '/api/health':
      response = healthHandler();
      break;

    case '/api/version':
      response = versionHandler();
      break;

    case '/api/eas-submit':
      console.log('hit submit');
      response = easSubmitHandler(body);
      console.log('submit resp ->', response);
      await slackService.sendBlockMessage(response as string);
      break;

    case '/api/eas-build':
      console.log('hit build');
      response = easBuildHandler(body);
      console.log('build resp ->', response);
      await slackService.sendBlockMessage(response as string);
      break;

    default:
      response = JSON.stringify({ message: 'route not found' }, null, 2);
      break;
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS,POST,PUT,DELETE',
    },
    body: response,
  };
};
export default routes;
