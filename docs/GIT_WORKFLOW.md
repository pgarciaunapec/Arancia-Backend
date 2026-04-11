Protocolo de Saneamiento Git y Flujo de Trabajo
=============================================

Objetivo: mantener `dev` como base limpia y estable. Todo desarrollo nuevo debe hacerse en ramas independientes que nazcan de `dev`.

1) Saneamiento inmediato (ejecútalo antes de seguir desarrollando)
- Si tienes cambios locales en `dev` que no quieras perder, crea una rama descriptiva y guarda un snapshot:

  ```bash
  git checkout -b snapshot/dev/<descripción-corta>
  git add -A
  git commit -m "snapshot(dev): guardar WIP - <breve descripción>"
  ```

- Después asegura que `dev` esté exactamente como `origin/dev`:

  ```bash
  git fetch origin
  git checkout dev
  git reset --hard origin/dev
  ```

2) Flujo de trabajo (rigurosamente atómico)
- Arrancar siempre desde `dev` y mantenerla actualizada:

  ```bash
  git checkout dev
  git pull --ff-only origin dev
  ```

- Crear una rama por tarea (siempre desde `dev`):

  ```bash
  git checkout -b feature/<nombre-tarea> dev
  ```

- Reglas de nombrado: usar nombres descriptivos y específicos, por ejemplo `feature/cart-add-quantity` o `feature/admin-user-audit`. No usar nombres genéricos (`wip`, `temp`) ni fechas.

- Commits: atómicos y con mensajes claros. Ejemplo:

  ```bash
  git add -A
  git commit -m "feat(cart): añadir cantidad por ítem"
  ```

- Integración: abrir Pull Request hacia `dev`, revisar, aprobar y mergear. Si se mergea en remoto, eliminar la rama remota y local inmediatamente:

  ```bash
  git push origin --delete feature/<nombre-tarea>
  git branch -d feature/<nombre-tarea>
  ```

3) Normas de aislamiento
- Nunca incluir cambios de otra tarea en una rama. Cada rama contiene únicamente la funcionalidad o corrección correspondiente.
- Si necesitas guardar trabajo intermedio, usa una rama snapshot con un nombre descriptivo.

4) Comandos de emergencia y recuperación
- Para restaurar `dev` al estado remoto (peligroso si hay WIP no guardado):

  ```bash
  git fetch origin
  git checkout dev
  git reset --hard origin/dev
  ```

- Antes de cualquier `reset --hard`, confirma que tus cambios están guardados en una rama snapshot o branch feature.

5) Buenas prácticas complementarias
- Hacer PRs pequeños y revisables.
- Mantener los commits enfocados (una sola responsabilidad cada uno).
- Incluir en el nombre de la rama un ticket/ID cuando exista (mejora trazabilidad).

Si quieres, puedo añadir hooks (pre-push/pre-commit) o scripts para automatizar estas comprobaciones.
