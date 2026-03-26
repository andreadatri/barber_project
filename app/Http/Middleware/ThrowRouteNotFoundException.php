<?php

namespace App\Http\Middleware;

use App\Exceptions\RouteNotFoundException;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ThrowRouteNotFoundException
{
    public function handle(Request $request, Closure $next): Response
    {
        try {
            return $next($request);
        } catch (NotFoundHttpException $exception) {
            $routeNotFoundException = RouteNotFoundException::fromNotFoundHttpException(
                $request->method(),
                '/'.$request->path(),
                $exception,
            );

            Log::warning('Route not found exception captured', [
                'message' => $routeNotFoundException->getMessage(),
                'status' => $routeNotFoundException->getStatusCode(),
                'previous' => $routeNotFoundException->getPrevious()?->getMessage(),
            ]);

            report($routeNotFoundException);

            throw $routeNotFoundException;
        }
    }
}