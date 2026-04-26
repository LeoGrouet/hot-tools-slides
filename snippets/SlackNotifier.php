<?php

final readonly class SlackNotifier implements SlackNotifierInterface
{
    public function send(Notification $notification): void
    {
        $payload = match ($notification->state) {
            State::PLANNED => $this->renderPlannedMessage($notification),
            State::ISSUE_CREATED => $this->renderIssueCreatedMessage($notification),
            default => null,
        };

        if (null === $payload) {
            return;
        }

        $response = $this->client->request('POST', 'https://slack.com/api/chat.postMessage', [
            'headers' => [
                'Content-Type' => 'application/json; charset=utf-8',
                'Authorization' => 'Bearer ' . $this->slackToken,
            ],
            'json' => $payload,
        ]);

        if (Response::HTTP_OK !== $response->getStatusCode()) {
            throw new \RuntimeException('Slack notification failed: ' . $response->getContent(false));
        }
    }

    /**
     * @return array<string>
     */
    private function renderPlannedMessage(Notification $notification): array
    {
        $parameters = $notification->parameters;

        if (!isset($parameters['knpeer'], $parameters['repositoryUrl'], $parameters['projectTitle'])) {
            throw new \InvalidArgumentException('Missing required parameters for PLANNED notification.');
        }

        return [
            'channel' => $parameters['knpeer'],
            'text' => $this->twig->render('@slack/planned.md.twig', $parameters),
        ];
    }

    /**
     * @return array<null|string>
     */
    private function renderIssueCreatedMessage(Notification $notification): array
    {
        $parameters = $notification->parameters;

        if (!isset($parameters['issueUrl'], $parameters['channelId'], $parameters['repositoryUrl'], $parameters['projectTitle'])) {
            throw new \InvalidArgumentException('Missing required parameters for ISSUE CREATED notification.');
        }

        return [
            'channel' => $parameters['channelId'],
            'text' => $this->twig->render('@slack/issue_created.md.twig', $parameters),
        ];
    }
}
