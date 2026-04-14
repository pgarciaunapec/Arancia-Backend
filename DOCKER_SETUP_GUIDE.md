# ========================================
# ARANCIA BACKEND - DOCKER SETUP GUIDE
# ========================================

## 📋 Descripción

Este proyecto incluye:
- **Dockerfile**: Construye la imagen del backend de Node.js/Express
- **docker-compose.yml**: Orquesta MongoDB y el Backend
- **.dockerignore**: Optimiza el tamaño de la imagen

## 🚀 Comenzar Rápidamente

### Prerequisitos
- Docker (v20.10+)
- Docker Compose (v2.0+)

### Opción 1: Ejecutar Todo (Recomendado para Desarrollo)

```bash
# Construir e iniciar los contenedores
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f backend

# Detener los contenedores
docker-compose down
```

### Opción 2: Construir la Imagen Manualmente

```bash
# Construir imagen
docker build -t arancia-backend:latest .

# Ejecutar con Docker Compose
docker-compose up -d mongodb
docker-compose up -d backend
```

## 📦 Servicios

### MongoDB
- **Puerto**: 27017
- **Usuario**: mongo
- **Contraseña**: Pantonio2404
- **Base de datos**: arancia
- **Health Check**: Habilitado

### Backend API
- **Puerto**: 3003
- **Variables de entorno**: Configuradas en docker-compose.yml
- **Health Check**: Verificar disponibilidad cada 30s
- **Build Type**: Multi-stage (optimizado)

## 🔧 Variables de Entorno

Todas las variables están parametrizadas y soportan **valores por defecto**:

```bash
# Copiar el template
cp .env.example .env

# Editar tus valores
nano .env
```

### Formato de Variables

La sintaxis en `docker-compose.yml`:
```yaml
VARIABLE_NAME: ${VARIABLE_VALUE:-default_value}
```

Si la variable no se define en `.env`, se usará el valor por defecto.

### Variables Disponibles

#### Server Configuration
| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `PORT` | Puerto del servidor Node.js | `3003` |
| `NODE_ENV` | Ambiente (production/development) | `production` |

#### MongoDB
| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `MONGODB_URI` | URI de conexión MongoDB | `mongodb://mongo:Pantonio2404@mongodb:27017/arancia` |
| `MONGO_INITDB_ROOT_USERNAME` | Usuario root de MongoDB | `mongo` |
| `MONGO_INITDB_ROOT_PASSWORD` | Contraseña root de MongoDB | `Pantonio2404` |
| `MONGO_INITDB_DATABASE` | Base de datos inicial | `arancia` |
| `MONGODB_PORT` | Puerto de MongoDB (host:container) | `27017` |
| `MONGODB_CONTAINER_NAME` | Nombre del contenedor | `arancia-mongodb` |

#### JWT
| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `JWT_SECRET` | Secret para firmar tokens JWT | `arancia_prod_Xy7n8R!kQwq2Z7v` |
| `JWT_EXPIRES_IN` | Expiración del token | `7d` |

#### URLs
| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `FRONTEND_URL` | URL del frontend (CORS) | `http://localhost:5173` |
| `DOMAIN` | Dominio principal | `localhost` |

#### Traefik / Dokploy
| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `TRAEFIK_ROUTER_NAME` | Nombre del router Traefik | `arancia-backend-dev` |
| `TRAEFIK_SERVICE_NAME` | Nombre del servicio Traefik | `arancia-backend-dev` |

#### Docker
| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `BACKEND_CONTAINER_NAME` | Nombre del contenedor backend | `arancia-backend` |
| `BACKEND_PORT` | Puerto host:container del backend | `3003` |
| `NETWORK_NAME` | Nombre de la red Docker | `arancia-network` |

### Modificar Variables para Otros Ambientes

#### Desarrollo Local
```bash
# .env para desarrollo
PORT=3003
NODE_ENV=development
MONGODB_URI=mongodb://mongo:Pantonio2404@mongodb:27017/arancia
FRONTEND_URL=http://localhost:5173
```

#### Producción (Dokploy)
```bash
# .env para producción
PORT=3003
NODE_ENV=production
MONGODB_URI=mongodb://mongo:Pantonio2404@mongodb-dbmongo-v6xllb:27017
FRONTEND_URL=https://arancia-dev.nauvolan.abrdns.com
DOMAIN=arancia-api-dev.nauvolan.abrdns.com
TRAEFIK_ROUTER_NAME=arancia-backend-prod
TRAEFIK_SERVICE_NAME=arancia-backend-prod
```

Luego ejecutar:
```bash
docker-compose up -d --build
```

## 📝 Comandos Útiles

### Contenedores
```bash
# Ver estado de los contenedores
docker-compose ps

# Ver logs del backend
docker-compose logs backend

# Ver logs de MongoDB
docker-compose logs mongodb

# Ver logs con filtro
docker-compose logs backend | grep ERROR

# Seguir logs en tiempo real
docker-compose logs -f backend
```

### Base de Datos
```bash
# Acceder a MongoDB
docker exec -it ${MONGODB_CONTAINER_NAME:-arancia-mongodb} mongosh \
  -u ${MONGO_INITDB_ROOT_USERNAME:-mongo} \
  -p ${MONGO_INITDB_ROOT_PASSWORD:-Pantonio2404}

# Ejecutar seed en el contenedor
docker-compose exec backend pnpm run seed:all

# Hacer backu`http://localhost:${PORT:-3003}`
- **Health Check**: `http://localhost:${PORT:-3003}/api`
- **Swagger/Docs**: `http://localhost:${PORT:-3003}/api-docs`
- **Production**: `https://${DOMAIN}`

### Construcción y Deployment
```bash
# Reconstruir la imagen (después de cambios en package.json o Dockerfile)
docker-compose up -d --build

# Reconstruir sin cache
docker-compose build --no-cache
docker-compose up -d

# Ver tamaño de las imágenes
docker images | grep arancia

# Limpiar volúmenes (⚠️ BORRA DATOS DE MONGODB)
docker-compose down -v

# Limpiar todo (contenedores, imágenes, volúmenes)
docker-compose down -v
docker system prune -a
```

### Monitoreo
```bash
# Ver uso de recursos
docker stats ${BACKEND_CONTAINER_NAME:-arancia-backend} ${MONGODB_CONTAINER_NAME:-arancia-mongodb}

# Inspeccionar contenedor
docker inspect ${BACKEND_CONTAINER_NAME:-arancia-backend}

# Ver variables de entorno de un contenedor
docker exec ${BACKEND_CONTAINER_NAME:-arancia-backend} env | sort
```

## 🌐 Acceso a la API

- **Local**: http://localhost:3003
- **Swagger/Docs**: http://localhost:3003/api-docs
- **Health Check**: http://localhost:3003/api
🏗️ Dockerfile: Build Arguments

El Dockerfile soporta `ARG` para customizar el build:

```bash
# Build con argumentos personalizados
docker build \
  --build-arg NODE_ENV=development \
  --build-arg PORT=3003 \
  --build-arg JWT_EXPIRES_IN=1d \
  -t arancia-backend:custom .
```

## ⚠️ Troubleshooting

### Error: "Connection refused"
```bash
# MongoDB aún no está listo, espera un poco
docker-compose logs mongodb | grep "ready to accept"

# O reinicia MongoDB
docker-compose restart mongodb
```

### Error: "Port already in use"
```bash
# Opción 1: Cambiar puerto en .env
# BACKEND_PORT=3004
# MONGODB_PORT=27018

# Opción 2: Matar el proceso que usa el puerto
lsof -i :3003
kill -9 <PID>

# Opción 3: Usar docker para ver qué está usando el puerto
docker ps --all
docker port <container_id>
```

### Error: "Cannot connect to MongoDB"
```bash
# Verifica que MongoDB esté saludable
docker-compose ps | grep mongodb

# Verifica la URI en tu .env
cat .env | grep MONGODB_URI

# Reinicia MongoDB
docker-compose restart mongodb

# Ver logs detallados de MongoDB
docker-compose logs mongodb --tail=50
```

### Limpiar y empezar de cero
``**Cambiar secretos en producción**: Editar `JWT_SECRET`, passwords de MongoDB en `.env`
- **No committear `.env`**: Ya está en `.gitignore`
- **Variables sensibles**: Usar `.env` local, no `.env.example`
- **Health checks**: Integrados para todos los servicios
- **Node environment**: Usar `NODE_ENV=production` en producción

## 📚 Documentación Relacionada

- [.env.dokploy](.env.dokploy) - Variables para Dokploy
- [.env.example](.env.example) - Template completo de variables
- [SWAGGER_GUIDE.md](./SWAGGER_GUIDE.md) - Documentación de la API
- [package.json](./package.json) - Scripts disponibles

## ✅ Checklist de Verificación

Después de ejecutar `docker-compose up -d`:

- [ ] Ambos contenedores estén corriendo: `docker-compose ps`
- [ ] Backend con estado `Up (healthy)`
- [ ] MongoDB con estado `Up (healthy)`
- [ ] API responde: `curl http://localhost:3003/api`
- [ ] Swagger accesible: `http://localhost:3003/api-docs`
- [ ] Logs sin errores: `docker-compose logs | grep -i error`
- [ ] Variables cargadas: `docker exec arancia-backend env | grep PORT`

## 🎯 Próximos Pasos

1. Personalizar `.env` según tu ambiente
2. Ejecutar seeds si es necesario: `docker-compose exec backend pnpm run seed:all`
3. Integrar con frontend (ajustar `FRONTEND_URL`)
4. Para Dokploy: usar variables de `.env.dokploy`

---

**Última actualización**: 2026-04-14  
**Versión de Docker**: 20.10+  
**Versión de Docker Compose**: 2.0+

## 🔐 Seguridad

- Variables sensibles en `docker-compose.yml` (cambiar en producción)
- Health checks integrados
- MongoDB requiere autenticación
- Usa `NODE_ENV=production`

## 📚 Documentación Relacionada

- [.env.dokploy](.env.dokploy) - Variables para Dokploy
- [SWAGGER_GUIDE.md](./SWAGGER_GUIDE.md) - Documentación API
- [package.json](./package.json) - Scripts disponibles

## ✅ Verificación

Después de ejecutar `docker-compose up -d`:

```bash
# 1. Verificar que ambos contenedores estén corriendo
docker-compose ps

# 2. Verificar logs del backend
docker-compose logs backend | tail -20

# 3. Probar conexión a la API
curl http://localhost:3003/api

# 4. Probar Swagger
open http://localhost:3003/api-docs
```

---

**Última actualización**: 2026-04-14
