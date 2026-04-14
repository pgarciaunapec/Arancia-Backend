# ========================================
# ARANCIA BACKEND - SETUP RÁPIDO
# ========================================

## ⚡ OPCIÓN 1: AUTOMÁTICO (Recomendado)

Simplemente ejecuta:

```bash
bash docker-env-setup-auto.sh
```

Esto hace todo automáticamente:
- Genera archivo `.env` con valores por defecto
- Descarga las imágenes de Docker
- Construye los contenedores
- Inicia MongoDB y Backend
- Verifica que todo esté funcionando

## ⚡ OPCIÓN 2: MANUAL

```bash
# 1. Copiar configuración de ambiente
cp .env.example .env

# 2. Iniciar contenedores
docker-compose up -d --build

# 3. Verificar estado
docker-compose ps
```

## ✅ VERIFICAR QUE FUNCIONA

```bash
# Ver estado
docker-compose ps

# Probar API
curl http://localhost:3003/api

# Ver logs
docker-compose logs backend

# Abrir Swagger en navegador
http://localhost:3003/api-docs
```

## 📚 COMANDOS RÁPIDOS

```bash
# Ver logs en tiempo real
docker-compose logs -f backend

# Reiniciar backend
docker-compose restart backend

# Parar todo
docker-compose down

# Borrar todo (datos incluido)
docker-compose down -v

# Ejecutar seeds
docker-compose exec backend pnpm run seed:all

# Acceder a MongoDB
docker exec -it arancia-mongodb mongosh -u mongo -p Pantonio2404
```

## 🔧 CAMBIAR VARIABLES

```bash
# 1. Editar archivo
nano .env

# 2. Reiniciar
docker-compose up -d --build
```

## ❌ SI ALGO FALLA

```bash
# Ver error detallado
docker-compose logs backend

# Limpiar todo y empezar de nuevo
docker-compose down -v
docker system prune -a
bash docker-env-setup-auto.sh
```

## 📖 DOCUMENTACIÓN COMPLETA

- [DEPLOY_COMMANDS.md](DEPLOY_COMMANDS.md) - Comandos de deploy
- [DOCKER_SETUP_GUIDE.md](DOCKER_SETUP_GUIDE.md) - Guía detallada
- [.env.example](.env.example) - Todas las variables disponibles
- [.env.dokploy](.env.dokploy) - Variables para Dokploy
