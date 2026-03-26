<?php

use App\Exceptions\ControlledNightwatchException;
use Tests\TestCase;

uses(TestCase::class);

test('controlled nightwatch route throws the custom exception', function () {
    $this->withoutExceptionHandling();

    expect(fn () => $this->get('/nightwatch/controlled-error'))
        ->toThrow(ControlledNightwatchException::class, 'NIGHTWATCH CONTROLLED ERROR');
});

test('controlled nightwatch route returns a server error response', function () {
    $response = $this->get('/nightwatch/controlled-error');

    $response->assertStatus(500);
    $response->assertSee('NIGHTWATCH CONTROLLED ERROR');
    $response->assertHeader('X-Nightwatch-Controlled-Error', '1');
});