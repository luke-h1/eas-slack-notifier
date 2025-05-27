import {
  Message,
  Header,
  Section,
  Actions,
  Button,
  BlockBuilder,
} from 'slack-block-builder';

export interface ExpoSubmitPayload {
  id: string;
  accountName: string;
  projectName: string;
  submissionDetailsPageUrl: string;
  parentSubmissionId?: string;
  appId: string;
  archiveUrl?: string;
  initiatingUserId: string;
  cancelingUserId?: string | null;
  turtleBuildId?: string;
  platform: 'ios' | 'android';
  status: 'finished' | 'errored' | 'canceled';
  submissionInfo?: {
    error?: {
      message: string;
      errorCode: string;
    };
    logsUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
  completedAt: string;
  maxRetryTimeMinutes: number;
}

export function parseEasSubmit(payload: ExpoSubmitPayload): string {
  const platformEmoji = payload.platform === 'ios' ? ':apple:' : ':candy:';
  const statusEmoji =
    payload.status === 'finished'
      ? ':slow-parrot:'
      : payload.status === 'errored'
        ? ':okurwa:'
        : ':trollparrot:';

  const blocks: BlockBuilder[] = [
    Header().text(
      `${platformEmoji} Submission ${payload.status} for ${payload.platform.toUpperCase()} ${statusEmoji}`,
    ),
    Section().fields([
      `*Project:*\n${payload.projectName}`,
      `*Account:*\n${payload.accountName}`,
      `*Submission ID:*\n${payload.id}`,
    ]),
  ];

  // Add buttons in a separate actions block
  const actionButtons = [];
  actionButtons.push(
    Button()
      .text('Open Submission Details')
      .url(payload.submissionDetailsPageUrl),
  );

  if (payload.status === 'errored' && payload.submissionInfo?.error) {
    blocks.push(
      Section().text(
        `*Error Details:*\n• Message: ${payload.submissionInfo.error.message}\n• Code: ${payload.submissionInfo.error.errorCode}`,
      ),
    );

    if (payload.submissionInfo.logsUrl) {
      actionButtons.push(
        Button().text('View Error Logs').url(payload.submissionInfo.logsUrl),
      );
    }
  }

  if (payload.status === 'finished' && payload.archiveUrl) {
    actionButtons.push(
      Button().text('Download Archive').url(payload.archiveUrl),
    );
  }

  if (payload.status === 'canceled') {
    blocks.push(
      Section().text(
        `*Canceled by:* ${payload.cancelingUserId || 'System'}\n*Max retry time:* ${payload.maxRetryTimeMinutes} minutes`,
      ),
    );
  }

  // Add all action buttons in a single actions block
  if (actionButtons.length > 0) {
    blocks.push(Actions().elements(actionButtons));
  }

  return Message().blocks(blocks).buildToJSON();
}
