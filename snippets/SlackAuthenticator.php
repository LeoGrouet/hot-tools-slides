<?php

declare(strict_types=1);

final class SlackAuthenticator extends AbstractAuthenticator
{
    public function __construct(
        private readonly SlackProvider $slackProvider,
        private readonly TokenManagerInterface $tokenManager
    ) {}

    public function supports(Request $request): bool
    {
        return 'slack_callback' === $request->attributes->get('_route');
    }

    public function authenticate(Request $request): SelfValidatingPassport
    {
        $session = $request->getSession();
        $code = $request->query->get('code');
        $state = $request->query->get('state');

        if (null === $code || null === $state || $state !== $session->get('oauth2state')) {
            throw new AuthenticationException('Invalid OAuth state');
        }

        $accessToken = $this->slackProvider->getProvider()->getAccessToken('authorization_code', ['code' => $code]);

        $values = $accessToken->getValues();
        $authedUser = $values['authed_user'] ?? null;
        if (!is_array($authedUser) || !isset($authedUser['id']) || !is_string($authedUser['id'])) {
            throw new AuthenticationException('Missing or invalid authed_user in token');
        }
        $slackId = $authedUser['id'];

        $httpClient = HttpClient::create();
        $response = $httpClient->request('GET', 'https://slack.com/api/users.info', [
            'headers' => ['Authorization' => 'Bearer ' . $accessToken->getToken()],
            'query' => ['user' => $slackId],
        ]);

        $userData = $response->toArray()['user'] ?? null;
        if (!is_array($userData)) {
            throw new AuthenticationException('Invalid user data');
        }

        $profile = $userData['profile'] ?? null;
        if (!is_array($profile)) {
            throw new AuthenticationException('Missing user profile');
        }

        $email = $profile['email'] ?? null;
        $name = $profile['display_name'] ?? '';

        Assert::stringNotEmpty($name, 'User name should be a non-empty string');
        Assert::stringNotEmpty($email, 'User email should be a non-empty string');
        Assert::stringNotEmpty($slackId, 'User id should be a non-empty string');

        return new SelfValidatingPassport(
            new UserBadge($slackId, fn() => new SlackUser($slackId, $name))
        );
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): Response
    {
        $user = $token->getUser();
        if (!$user instanceof SlackUser) {
            throw new \RuntimeException('Unexpected user type');
        }

        $jwt = $this->tokenManager->generate($user);
        $cookie = Cookie::create('slack_jwt')
            ->withValue($jwt)
            ->withSecure(true)
            ->withHttpOnly(true)
            ->withExpires(new \DateTime('+1 hour'))
            ->withSameSite(Cookie::SAMESITE_LAX)
            ->withPath('/');

        $session = $request->getSession();
        $redirectUrl = $session->get('original_url');

        if (!is_string($redirectUrl) || '' === $redirectUrl) {
            $redirectUrl = '/';
        }
        $session->remove('original_url');

        $response = new RedirectResponse($redirectUrl);
        $response->headers->setCookie($cookie);

        return $response;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): Response
    {
        return new Response('Authentication failed: ' . $exception->getMessage(), 403);
    }
}
