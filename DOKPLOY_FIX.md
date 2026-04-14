# 🔧 Dokploy Deployment - Fixed

## ✅ Lo que se arregló

### Error Original
```
service "backend" refers to undefined network arancia-network: invalid compose project
```

### Causa
En Docker Compose **NO se pueden usar variables en los nombres de claves** (keys), solo en los valores.

El problema estaba aquí:
```yaml
networks:
  ${NETWORK_NAME:-arancia-network}:  # ❌ Variables aquí no funcionan
    driver: bridge
```

### Solución
Se cambió a un **nombre de red fijo**:
```yaml
networks:
  arancia-network:  # ✅ Nombre fijo
    driver: bridge
```

---

## 📝 Cambios Realizados

1. **docker-compose.yml**
   - ✅ Nombre de red fijo: `arancia-network`
   - ✅ Referencias a la red actualizadas en MongoDB y Backend
   - ✅ Todas las otras variables siguen funcionando

2. **.env files**
   - ✅ Removida variable `NETWORK_NAME` (ya no se necesita)
   - ✅ Variables que sí funcionan: `BACKEND_PORT`, `MONGODB_PORT`, `BACKEND_CONTAINER_NAME`, etc.

---

## 🚀 Deploy en Dokploy

Ahora debería funcionar correctamente:

```bash
bash docker-env-setup-auto.sh
# O en Dokploy
docker-compose up -d --build
```

---

## 📋 Variables que FUNCIONAN en docker-compose.yml

| Variable | Tipo | Ejemplo |
|----------|------|---------|
| `PORT` | Valor ✅ | `3003` |
| `NODE_ENV` | Valor ✅ | `production` |
| `MONGODB_URI` | Valor ✅ | `mongodb://...` |
| `MONGODB_CONTAINER_NAME` | Valor ✅ | `arancia-mongodb` |
| `BACKEND_CONTAINER_NAME` | Valor ✅ | `arancia-backend` |
| `MONGODB_PORT` | Valor ✅ | `27017` |
| `BACKEND_PORT` | Valor ✅ | `3003` |
| `NETWORK_NAME` | Clave ❌ | No soportado |

---

## 🎯 Red de Docker

- **Nombre**: `arancia-network` (fijo)
- **Driver**: `bridge`
- **Servicios conectados**: `mongodb`, `backend`
- **Interno**: Solo accesible desde dentro de Docker

---

## ✅ Verificar Deployment

```bash
# Ver contenedores
docker ps

# Ver red
docker network ls | grep arancia

# Verificar conexión entre servicios
docker exec arancia-backend ping mongodb
```

---

**Status**: ✅ Listo para producción en Dokploy
