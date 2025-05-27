import { emotes } from '@lambda/config';
import {
  Message,
  Header,
  Section,
  Actions,
  Image,
  Button,
} from 'slack-block-builder';

export interface ExpoBuildPayload {
  id: string;
  accountName: string;
  projectName: string;
  buildDetailsPageUrl: string;
  parentBuildId?: string;
  appId: string;
  initiatingUserId: string;
  cancelingUserId: string | null;
  platform: 'android' | 'ios';
  status: 'errored' | 'finished' | 'canceled';
  artifacts: {
    buildUrl?: string;
    logsS3KeyPrefix: string;
  };
  metadata: {
    appName: string;
    username: string;
    workflow: string;
    appVersion: string;
    appBuildVersion: string;
    cliVersion: string;
    sdkVersion: string;
    buildProfile: string;
    distribution: string;
    appIdentifier: string;
    gitCommitHash: string;
    gitCommitMessage: string;
    runtimeVersion: string;
    channel?: string;
    /**
     * Legacy field
     */
    releaseChannel?: string;
    reactNativeVersion: string;
    trackingContext: {
      platform: 'android' | 'ios';
      account_id: string;
      dev_client: boolean;
      project_id: string;
      tracking_id: string;
      project_type: string;
      dev_client_version: string;
    };
    credentialsSource: string;
    isGitWorkingTreeDirty: boolean;
    message: string;
    runFromCI: boolean;
  };
  metrics: {
    memory: number;
    buildEndTimestamp: number;
    totalDiskReadBytes: number;
    buildStartTimestamp: number;
    totalDiskWriteBytes: number;
    cpuActiveMilliseconds: number;
    buildEnqueuedTimestamp: number;
    totalNetworkEgressBytes: number;
    totalNetworkIngressBytes: number;
  };
  /**
   *  available for failed builds
   */
  error?: {
    message: string;
    errorCode: string;
  };
  createdAt: string;
  enqueuedAt: string;
  provisioningStartedAt: string;
  workerStartedAt: string;
  completedAt: string;
  updatedAt: string;
  expirationDate: string;
  priority: 'high' | 'normal' | 'low';
  resourceClass: string;
  actualResourceClass: string;
  maxRetryTimeMinutes: number;
}

export function parseEasBuild(payload: ExpoBuildPayload) {
  if (payload.platform === 'ios' && payload.status === 'finished') {
    const url = `itms-services://?action=download-manifest;url=https://exp.host/--/api/v2/projects/${payload.appId}/builds/${payload.id}/manifest.plist`;

    const message = Message().blocks([
      Header().text(':apple: Build completed successfully for iOS :ios:'),
      Section().fields([
        `*Build Profile*: ${payload.metadata.buildProfile}\n*Version:* ${payload.metadata.appVersion}\n*Build*: ${payload.metadata.appBuildVersion}`,
      ]),
      Actions().elements([
        Button().text('Download IPA').url(payload.artifacts.buildUrl),
        Button()
          .text('Open Build Details Page')
          .url(payload.buildDetailsPageUrl),
      ]),
      Image()
        .imageUrl(
          `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(url)}&size=250x250&qzone=2`,
        )
        .altText('qr'),
    ]);

    return message.buildToJSON();
  }

  if (payload.platform === 'android' && payload.status === 'finished') {
    const message = Message().blocks([
      Header().text(
        ':candy: Build completed successfully for Android :android:',
      ),
      Section().fields([
        `*Build Profile*: ${payload.metadata.buildProfile}\n*Version:* ${payload.metadata.appVersion}\n*Build*: ${payload.metadata.appBuildVersion}`,
      ]),
      Actions().elements([
        Button().text('Download APK').url(payload.artifacts.buildUrl),
        Button()
          .text('Open Build Details Page')
          .url(payload.buildDetailsPageUrl),
      ]),
      Image()
        .imageUrl(
          `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(payload.artifacts.buildUrl ?? '')}&size=250x250&qzone=2`,
        )
        .altText('qr'),
    ]);

    return message.buildToJSON();
  }

  if (payload.platform === 'ios' && payload.status === 'errored') {
    const message = Message().blocks([
      Header().text(`:apple: Build failed for iOS ${emotes.kurva}`),
      Section().fields([
        `*Build Profile*: ${payload.metadata.buildProfile}\n*Version:* ${payload.metadata.appVersion}\n*Build*: ${payload.metadata.appBuildVersion}`,
      ]),
      Actions().elements([
        Button()
          .text('Open Build Details Page')
          .url(payload.buildDetailsPageUrl),
      ]),
    ]);

    return message.buildToJSON();
  }

  if (payload.platform === 'android' && payload.status === 'errored') {
    const message = Message().blocks([
      Header().text(`:candy: Build failed for Android ${emotes.kurva}`),
      Section().fields([
        `*Build Profile*: ${payload.metadata.buildProfile}\n*Version:* ${payload.metadata.appVersion}\n*Build*: N/A`,
      ]),
      Actions().elements([
        Button()
          .text('Open Build Details Page')
          .url(payload.buildDetailsPageUrl),
      ]),
    ]);

    return message.buildToJSON();
  }

  // Handle canceled builds
  if (payload.status === 'canceled') {
    const platformEmoji = payload.platform === 'ios' ? ':apple:' : ':candy:';
    const text = `${platformEmoji} Build was canceled for ${payload.platform.toUpperCase()} :trollcat:`;

    const message = Message().blocks([
      Header().text(text),
      Section().fields([
        `*Build Profile*: ${payload.metadata.buildProfile}\n*Version:* ${payload.metadata.appVersion}\n*Build*: ${payload.metadata.appBuildVersion}\n*Reason*: User cancellation or timeout`,
      ]),
      Actions().elements([
        Button()
          .text('Open Build Details Page')
          .url(payload.buildDetailsPageUrl),
      ]),
    ]);

    return message.buildToJSON();
  }
  return '';
}
