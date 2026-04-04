# Seeding Guide

Este proyecto incluye scripts de seed por coleccion para MongoDB y un seed completo.

## Seed completo

```bash
pnpm seed
```

Tambien disponible como:

```bash
pnpm seed:all
```

## Seed por coleccion

```bash
pnpm seed:users
pnpm seed:images
pnpm seed:menu-items
pnpm seed:tables
pnpm seed:inventory-items
pnpm seed:contacts
pnpm seed:event-requests
pnpm seed:reservations
pnpm seed:orders
pnpm seed:payments
pnpm seed:transactions
pnpm seed:delivery-orders
pnpm seed:table-bills
pnpm seed:cash-registers
```

## Fuente de menu antiguo

El seed de menu (`seed:menu-items`) extrae los platos directamente desde:

- `docs/AntinguoMenu.md`

De esa forma se conservan nombres, categorias, ingredientes e imagenes historicas del menu.

## Orden recomendado

Si se ejecutan colecciones de forma individual, el orden recomendado es:

1. `seed:users`
2. `seed:menu-items`
3. `seed:tables`
4. `seed:inventory-items`
5. `seed:reservations`
6. `seed:orders`
7. `seed:payments`
8. `seed:transactions`
9. `seed:delivery-orders`
10. `seed:table-bills`
11. `seed:cash-registers`
12. `seed:contacts`
13. `seed:event-requests`
14. `seed:images`
