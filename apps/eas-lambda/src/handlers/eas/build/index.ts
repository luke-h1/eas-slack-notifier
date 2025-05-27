import { ExpoBuildPayload, parseEasBuild } from '@lambda/utils/eas-parsers';

export function easBuildHandler(body: string | null): string {
  return parseEasBuild(body as unknown as ExpoBuildPayload);
}
