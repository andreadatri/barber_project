<?php

namespace App\Exceptions;

use RuntimeException;

class ControlledNightwatchException extends RuntimeException
{
    public function __construct(string $message = 'NIGHTWATCH CONTROLLED ERROR')
    {
        parent::__construct($message);
    }
}