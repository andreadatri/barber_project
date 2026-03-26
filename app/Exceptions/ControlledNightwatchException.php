<?php

namespace App\Exceptions;

use Symfony\Component\HttpKernel\Exception\HttpException;

class ControlledNightwatchException extends HttpException
{
    public function __construct(string $message = 'Controlled Nightwatch test exception')
    {
        parent::__construct(500, $message);
    }
}