import { ExpoSubmitPayload, parseEasSubmit } from '@lambda/utils/eas-parsers';

export function easSubmitHandler(body: string | null): string {
  return parseEasSubmit(body as unknown as ExpoSubmitPayload);
}
