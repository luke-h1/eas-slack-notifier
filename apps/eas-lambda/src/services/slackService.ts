import axios from 'axios';

export const slackService = {
  sendBlockMessage: async (payload: string) => {
    try {
      const result = await axios.post(process.env.SLACK_WEBHOOK_URL as string, {
        payload,
      });

      // eslint-disable-next-line no-console
      console.log(result.data);

      return result;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
    return '';
  },
} as const;
