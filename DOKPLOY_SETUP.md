# GUÍA RÁPIDA - DESPLIEGUE EN DOKPLOY CON TRAEFIK

## Variables Requeridas en Dokploy

Asegúrate de que estas variables estén configuradas en la sección "Environment Variables" de tu aplicación en Dokploy:

### Grupo 1: Configuración del Servidor
```
PORT=3003
NODE_ENV=production
```

### Grupo 2: Base de Datos MongoDB
```
MONGODB_URI=mongodb://user:password@host:27017/arancia?authSource=admin&tls=true
```

### Grupo 3: JWT (Seguridad)
```
JWT_SECRET=tu-secret-muy-seguro-minimo-32-caracteres
JWT_EXPIRES_IN=7d
```

### Grupo 4: CORS y Frontend
```
FRONTEND_URL=https://arancia-dev.nauvolan.abrdns.com
```

### Grupo 5: Traefik & Dominio (CRÍTICO)
```
DOMAIN=arancia-api-dev.nauvolan.abrdns.com
TRAEFIK_ROUTER_NAME=arancia-backend-dev
TRAEFIK_SERVICE_NAME=arancia-backend-dev
```

## Puntos Clave

✅ **El docker-compose.yml ahora tiene todo variablizado**
- Todo se toma del archivo `.env` o las variables de Dokploy

✅ **Traefik está configurado correctamente**
- Usa `websecure` (HTTPS)
- Let's Encrypt automático
- Nombres únicos de router/service

✅ **CORS Headers configurados**
- Comunica con tu frontend sin problemas
- Métodos: GET, POST, PUT, DELETE, OPTIONS, PATCH

## Pasos en Dokploy

1. **Ir a Settings de la aplicación**
2. **Agregar todas las variables de arriba**
3. **NO usar comillas alrededor de los valores**
4. **Redeploy la aplicación**
5. **Esperar 2-3 minutos mientras Traefik actualiza**
6. **Acceder a** `https://arancia-api-dev.nauvolan.abrdns.com`

## Si Siguen Habiendo Problemas

### Acceso Denegado (403/Access Denied)
- Verifica que el DOMAIN sea exactamente igual al DNS que usas
- Revisa que el certificado SSL esté activo (puede tardar 24-48h en nuevo dominio)

### 404 o Rutas No Encontradas
- Los nombres `TRAEFIK_ROUTER_NAME` y `TRAEFIK_SERVICE_NAME` DEBEN ser únicos
- No deben conflictuar con otros servicios en Dokploy

### Ver Logs de Traefik
```bash
# Conectate por SSH a tu servidor de Dokploy
docker logs NOMBRE_CONTENEDOR_TRAEFIK
```

## Docker Compose Generado

El archivo final que usará Dokploy tiene:
- ✅ Etiquetas Traefik funcionales
- ✅ Todas las variables del `.env` incluidas
- ✅ Puerto 3003 configurado correctamente
- ✅ Volumen para uploads persistente
- ✅ Red dokploy-network externa (Dokploy la crea automáticamente)
