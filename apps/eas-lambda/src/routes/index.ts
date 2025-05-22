import { easSubmitHandler } from '@lambda/handlers/eas/submit';
import healthHandler from '@lambda/handlers/health';
import versionHandler from '@lambda/handlers/version';

export type RoutePath = '/api/health' | '/api/version' | '/api/eas-submit';

const routes = (path: RoutePath) => {
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
      response = easSubmitHandler();
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
