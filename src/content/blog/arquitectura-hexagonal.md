---
title: "Arquitectura Hexagonal en PHP"
description: "Una introducción a la arquitectura hexagonal y cómo implementarla en proyectos PHP con Laravel."
pubDate: 2025-02-20
tags: ["PHP", "Laravel", "Arquitectura", "Backend"]
draft: false
---

# Arquitectura Hexagonal en PHP

La **arquitectura hexagonal**, también conocida como *Ports and Adapters*, es un patrón de diseño que nos permite crear aplicaciones altamente desacopladas y fáciles de testear.

## ¿Por qué usar Arquitectura Hexagonal?

- **Independencia del framework**: Tu lógica de negocio no depende de Laravel, Symfony u otro framework.
- **Testabilidad**: Puedes testear tu dominio sin necesidad de bases de datos o APIs externas.
- **Flexibilidad**: Cambiar la base de datos o el framework es mucho más sencillo.

## Estructura básica

```
src/
├── Domain/
│   ├── Entities/
│   ├── Repositories/
│   └── Services/
├── Application/
│   ├── UseCases/
│   └── DTOs/
└── Infrastructure/
    ├── Persistence/
    └── Http/
```

## Ejemplo práctico

Imagina que tienes un caso de uso para crear un usuario:

```php
class CreateUserUseCase
{
    public function __construct(
        private UserRepository $repository
    ) {}

    public function execute(CreateUserDTO $dto): User
    {
        $user = new User(
            name: $dto->name,
            email: $dto->email
        );

        return $this->repository->save($user);
    }
}
```

El repositorio es una **interfaz** en el dominio, y la implementación concreta está en infraestructura.

## Conclusión

La arquitectura hexagonal requiere más código inicial, pero a largo plazo hace que tu aplicación sea más mantenible y testeable. Es especialmente útil en proyectos que van a escalar.
