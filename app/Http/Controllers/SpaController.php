<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\Filesystem\FileNotFoundException;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\File;

class SpaController extends Controller
{
    /**
     * @throws FileNotFoundException
     */
    public function __invoke(): Response
    {
        $path = public_path('spa/index.html');

        if (! File::exists($path)) {
            abort(503, 'Frontend build non trovato. Esegui npm run build nella cartella frontend.');
        }

        $html = str_replace('__CSRF_TOKEN__', csrf_token(), File::get($path));

        return response($html, 200, ['Content-Type' => 'text/html']);
    }
}
