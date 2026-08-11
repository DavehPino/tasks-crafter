# Products API

API REST simple para consultar productos. Construida con **Express** y **TypeScript**, desplegada en **Railway** con **Docker**.

## Descripción

Esta es una API de lectura de productos con datos en memoria. Proporciona endpoints para listar productos, filtrar por categoría y obtener detalles individuales.

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/products` | Listar todos los productos |
| `GET` | `/products/:id` | Obtener un producto por ID |
| `GET` | `/products/categories` | Listar categorías disponibles |
| `GET` | `/health` | Health check |

### Parámetros de Query

- **`category`** (opcional): Filtrar productos por categoría
- **`limit`** (opcional): Limitar el número de resultados

### Ejemplos

```bash
# Obtener todos los productos
GET /products

# Filtrar por categoría
GET /products?category=men's clothing

# Limitar resultados
GET /products?limit=5

# Combinar filtros
GET /products?category=electronics&limit=10

# Obtener un producto específico
GET /products/1

# Listar categorías
GET /products/categories
```

## Estructura del Proyecto

```
products-api/
├── src/
│   ├── index.ts         # Punto de entrada
│   ├── app.ts           # Configuración de Express
│   ├── schemas/         # Validación con Zod
│   └── data/            # Datos de productos
├── Dockerfile           # Imagen Docker multistage
├── railway.toml         # Configuración de Railway
└── package.json
```

## Desarrollo Local

### Requisitos
- Node.js 18+
- npm

### Instalación y Ejecución

```bash
cd products-api

# Instalar dependencias
npm install

# Modo desarrollo (con hot reload)
npm run dev

# Build para producción
npm build

# Iniciar en producción
npm start

# Ejecutar tests
npm test
```

La API se ejecutará en `http://localhost:3002`

## Despliegue en Railway

### Configuración

El archivo `railway.toml` contiene la configuración para Railway:

```toml
[build]
builder = "dockerfile"

[deploy]
startCommand = "node dist/index.js"
healthcheckPath = "/health"
restartPolicyType = "on_failure"
```

### Proceso de Despliegue

1. **Build**: Railway construye la imagen Docker usando el `Dockerfile`
2. **Health Check**: Verifica `/health` para confirmar que el servicio está listo
3. **Reinicio**: Reinicia automáticamente si falla

### Dockerfile (Multistage)

```
Etapa 1 (Builder):
  - Instala dependencias
  - Compila TypeScript a JavaScript

Etapa 2 (Runtime):
  - Solo incluye dependencias de producción
  - Copia binarios compilados
  - Expone puerto 3002
```

## Validación de Datos

Todos los productos se validan con **Zod** antes de ser retornados:

```typescript
{
  id: number,
  title: string,
  price: number,
  description: string,
  category: string,
  image: string,
  rating: {
    rate: number,
    count: number
  }
}
```

## Variables de Entorno

- **`PORT`**: Puerto de escucha (por defecto: `3002`)

## Tecnologías

- **Express.js** - Framework HTTP
- **TypeScript** - Tipado estático
- **Zod** - Validación de esquemas
- **Docker** - Containerización
- **Jest** - Testing
- **Railway** - Hosting

## Notas

- Los datos residen en memoria; se pierden al reiniciar
- CORS está habilitado
- Sin autenticación (API pública)
- Sin base de datos persistente
