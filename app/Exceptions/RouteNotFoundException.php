<?php

namespace App\Exceptions;

use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class RouteNotFoundException extends HttpException
{
    public static function fromNotFoundHttpException(
        string $method,
        string $path,
        ?NotFoundHttpException $previous = null,
    ): self {
        return new self(
            404,
            sprintf('Route not found: %s %s', $method, $path),
            $previous,
        );
    }
}