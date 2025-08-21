Guía rápida para desplegar

Objetivo
- Subir frontend a Vercel (carpeta `web`).
- Subir backend a Render (carpeta `server`).

Frontend (Vercel)
1. Iniciá sesión en Vercel y "Import Project" desde GitHub/GitLab/Bitbucket.
2. Seleccioná el repositorio y como "Root Directory" pon `web`.
3. Settings de build:
   - Framework Preset: Other
   - Build Command: npm run build
   - Output Directory: dist
4. Variables de entorno:
   - VITE_API_BASE: https://<tu-backend>.onrender.com (o la URL de Render)
5. Deploy.

Backend (Render)
1. En Render, "New Web Service" -> Connect repo.
2. Seleccioná la carpeta raíz del proyecto. En Build Command pon: `cd server && npm install`.
3. Start Command: `cd server && npm start`.
4. Asegurate que el archivo `server/package.json` tenga un `start` script que use `process.env.PORT` (ya incluido).
5. Añadí variables de entorno si necesitás.

Notas técnicas
- El backend usa `process.env.PORT || 3001` y sirve endpoint `/convert`.
- El frontend lee `VITE_API_BASE` en tiempo de compilación: asegurate de setearla antes del build en Vercel.

Siguientes pasos recomendados
- Añadir un README en el repo con enlaces.
- Añadir un `Procfile` si preferís Heroku.
- Para producción, fijar la versión de Node en `package.json` o en Render settings.
