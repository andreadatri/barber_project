<?php

use App\Exceptions\ControlledNightwatchException;
use Tests\TestCase;

uses(TestCase::class);

test('controlled nightwatch route throws the custom exception', function () {
    $this->withoutExceptionHandling();

    expect(fn () => $this->get('/nightwatch/controlled-error'))
        ->toThrow(ControlledNightwatchException::class, 'Controlled Nightwatch test exception');
});

test('controlled nightwatch route returns a server error response', function () {
    $response = $this->get('/nightwatch/controlled-error');

    $response->assertStatus(500);
});