# 🚀 ARANCIA BACKEND - DEPLOY A SERVIDOR

## ⚡ COPY-PASTE ÚNICO COMANDO

En tu servidor, copia y pega esto:

```bash
bash docker-env-setup-auto.sh
```

**Eso es todo!** El script automáticamente:
- ✅ Crea `.env` con valores por defecto
- ✅ Descarga imágenes Docker
- ✅ Construye la aplicación
- ✅ Inicia MongoDB y Backend
- ✅ Verifica que todo funcione

---

## 📊 VER ESTADO

```bash
# Ver si está corriendo
docker-compose ps

# Probar API
curl http://localhost:3003/api
```

---

## 📝 CAMBIAR VARIABLES (Si es necesario)

```bash
# Editar archivo de configuración
nano .env

# Reiniciar con nuevas variables
docker-compose up -d --build
```

---

## 📋 COMANDOS ÚTILES

```bash
# Ver logs
docker-compose logs -f backend

# Detener
docker-compose down

# Borrar todo y empezar de cero
docker-compose down -v && bash docker-env-setup-auto.sh

# Ejecutar seeds
docker-compose exec backend pnpm run seed:all
```

---

## ✅ VERIFICAR SETUP

```bash
# Ejecutar verificación completa
bash docker-verify.sh

# O verificación manual:
docker-compose ps
curl http://localhost:3003/api
```

---

## 🌐 ACCESO

- **API**: http://localhost:3003
- **Docs**: http://localhost:3003/api-docs
- **Health**: http://localhost:3003/api

---

## ❌ PROBLEMAS

```bash
# Error: "Port already in use"?
# Editar .env y cambiar BACKEND_PORT o MONGODB_PORT

# Error: "Cannot connect to MongoDB"?
docker-compose restart mongodb

# Algo no va?
docker-compose logs backend
```

---

**Listo! Tu backend está corriendo 🎉**
