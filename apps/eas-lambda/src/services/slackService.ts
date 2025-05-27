import axios from 'axios';
import AWSXRay from 'aws-xray-sdk';
import http from 'http';
import https from 'https';

// Capture all outgoing HTTP calls
AWSXRay.captureHTTPsGlobal(http);
AWSXRay.captureHTTPsGlobal(https);

export const slackService = {
  sendBlockMessage: async (payload: string) => {
    const segment = AWSXRay.getSegment();
    const subsegment = segment?.addNewSubsegment('sendBlockMessage');

    try {
      const result = await axios.post(process.env.SLACK_WEBHOOK_URL as string, {
        payload,
      });

      // eslint-disable-next-line no-console
      console.log(result.data);

      subsegment?.addMetadata('response', result.data);
      return result;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      if (error instanceof Error) {
        subsegment?.addError(error);
      }
      throw error;
    } finally {
      subsegment?.close();
    }
  },
} as const;
