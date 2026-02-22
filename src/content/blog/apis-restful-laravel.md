---
title: "Creando APIs RESTful con Laravel"
description: "Guía completa para crear APIs RESTful robustas y escalables con Laravel."
pubDate: 2025-02-15
tags: ["Laravel", "API", "REST", "PHP"]
draft: false
---

# Creando APIs RESTful con Laravel

Laravel es uno de los frameworks más populares para crear APIs RESTful en PHP. En este artículo veremos las mejores prácticas.

## Configuración inicial

Primero, instala Laravel y configura tu proyecto:

```bash
composer create-project laravel/laravel mi-api
cd mi-api
php artisan serve
```

## Rutas de API

Las rutas de API van en `routes/api.php`:

```php
Route::apiResource('users', UserController::class);
Route::apiResource('posts', PostController::class);
```

## Controladores de recursos

```php
class UserController extends Controller
{
    public function index()
    {
        return UserResource::collection(User::paginate());
    }

    public function store(StoreUserRequest $request)
    {
        $user = User::create($request->validated());
        return new UserResource($user);
    }

    public function show(User $user)
    {
        return new UserResource($user);
    }
}
```

## API Resources

Los recursos transforman tus modelos en JSON:

```php
class UserResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
```

## Autenticación con Sanctum

Para proteger tu API, usa Laravel Sanctum:

```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

## Conclusión

Laravel facilita la creación de APIs RESTful con herramientas como Resources, Form Requests y Sanctum para autenticación.
