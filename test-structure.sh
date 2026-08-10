#!/bin/bash

echo "🔍 Verificando estructura de /api/"
echo ""

# Check for required files
files=(
  "api/tasks/index.ts"
  "api/tasks/[id].ts"
  "api/health.ts"
  "api/store/tasks.ts"
  "api/models/task.ts"
  "api/schemas/task.ts"
  "api/helpers/parseBody.ts"
  "vercel.json"
  ".vercelignore"
  "app/dist/index.html"
)

echo "✅ Archivos necesarios:"
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  else
    echo "  ✗ $file (FALTA)"
  fi
done

echo ""
echo "✅ Estructura de directorios:"
echo "  api/"
ls -la api/ 2>/dev/null | grep "^d" | awk '{print "    ✓ " $NF}'
echo "  api/tasks:"
ls -la api/tasks/ 2>/dev/null | grep "^-" | awk '{print "    ✓ " $NF}'
echo "  api/store:"
ls -la api/store/ 2>/dev/null | grep "^-" | awk '{print "    ✓ " $NF}'

echo ""
echo "✅ Configuración Vercel:"
grep -q "buildCommand" vercel.json && echo "  ✓ vercel.json configurado" || echo "  ✗ vercel.json incompleto"
[ -f ".vercelignore" ] && echo "  ✓ .vercelignore existe" || echo "  ✗ .vercelignore falta"

echo ""
echo "✅ App:"
[ -d "app/dist" ] && echo "  ✓ App compilado (dist/)" || echo "  ✗ App no compilado"

echo ""
echo "🎉 Verificación completada!"
