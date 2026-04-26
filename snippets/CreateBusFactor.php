<?php

#[Provider(targetMutationTypes: 'Mutation')]
final readonly class CreateBusFactor implements MutationInterface
{
    public function __construct(
        private MessageBus $messageBus
    ) {}

    #[Mutation(name: 'createBusFactor', type: 'BusFactor!')]
    #[Arg('projectId', type: 'Int!')]
    #[Arg('state', type: 'StateType!')]
    #[Arg('comment', type: 'String')]
    #[Arg('issueUrl', type: 'String')]
    #[Arg('knpeer', type: 'String')]
    public function __invoke(
        int $projectId,
        State $state,
        ?string $issueUrl,
        ?string $comment,
        ?string $knpeer,
    ): BusFactorType {
        try {
            /** @var Output $output */
            $output = $this->messageBus->handle(
                new Input($projectId, $state, $issueUrl, $comment, $knpeer)
            );
        } catch (ProjectNotFound $exception) {
            throw new \RuntimeException($exception->getMessage(), previous: $exception);
        }

        return new BusFactorType($output->busFactor);
    }
}
