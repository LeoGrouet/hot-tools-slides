<?php

class WebhookController
{
    public function __construct(
        private Projects $projects,
        private BusFactors $busFactors
    ) {}

    public function __invoke(Request $request): Response
    {
        $payload = $request->getContent();

        /**
         * @var array{
         *     action: string,
         *     repository: array<html_url, string>
         * } $data
         */
        $data = json_decode($payload, true);

        $action = $data['action'];

        $url = $data['repository']['html_url'];

        $project = $this->projects->findOneByUrl($url);
        if (null === $project) {
            return new Response('Project not found', Response::HTTP_NOT_FOUND);
        }

        if ('closed' === $action) {
            $busFactor = new BusFactor(
                $project,
                State::UP_TO_DATE
            );

            $this->busFactors->create($busFactor);
        }

        return new Response('OK', Response::HTTP_OK);
    }
}
