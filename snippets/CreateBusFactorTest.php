<?php

TestHelper::it('should successfully create a new bus factor', function (ApplicationHelper $application) {
    $mockResponse = new MockResponse(
        json_encode([
            'ok' => true,
            'members' => [
                [
                    'id' => 'U123',
                    'real_name' => 'Alice Doe',
                    'is_restricted' => false,
                    'is_bot' => false,
                    'profile' => [
                        'email' => 'alice@example.com',
                    ],
                ],
            ],
        ]),
        ['http_code' => 200]
    );

    $httpClient = $application->mockService(HttpClientInterface::class);

    $httpClient
        ->shouldReceive('request')
        ->once()
        ->withArgs(fn($method) => 'POST' === $method)
        ->andReturn($mockResponse)
    ;
    // Graphql 
    $response = $application->graphql(
        <<<'GRAPHQL'
                mutation createBusFactor($projectId: Int!, $state: StateType!, $comment: String, $issueUrl: String, $knpeer: String) {
                    createBusFactor(projectId: $projectId, state: $state, comment: $comment, issueUrl: $issueUrl, knpeer: $knpeer) {
                      state
                      comment
                      issueUrl
                      knpeer
                    }
                }
            GRAPHQL,
        [
            'projectId' => 1,
            'state' => 'PLANNED',
            'knpeer' => 'U123',
        ]
    );

    // Assert the response 
    $content = json_decode($response->getContent(), true);
    expect($content['data']['createBusFactor']['state'])->toBe('PLANNED');
    expect($content['data']['createBusFactor']['knpeer'])->toBe('Alice Doe');
});
