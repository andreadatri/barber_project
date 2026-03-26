<?php

use App\Exceptions\RouteNotFoundException;
use Tests\TestCase;

uses(TestCase::class);

test('missing routes are converted to the custom route not found exception', function () {
    $this->withoutExceptionHandling();

    expect(fn () => $this->get('/nightwatch-missing-route'))
        ->toThrow(RouteNotFoundException::class, 'Route not found: GET /nightwatch-missing-route');
});

test('missing routes still return a 404 response', function () {
    $response = $this->get('/nightwatch-missing-route');

    $response->assertNotFound();
});