# API de Monedas (Currencies) - Documentación

## Información General
- **Base URL**: `http://localhost:3000`
- **Prefijo**: `/currencies`
- **Autenticación**: JWT Bearer Token requerido
- **Swagger**: `http://localhost:3000/api`

## Estructura de la Entidad Currency

```typescript
{
  id: number;           // ID único autogenerado
  description: string;  // Descripción de la moneda (ej: "DOLARES")
  prefijo: string;      // Código de la moneda (ej: "USD")
  signo: string;        // Símbolo de la moneda (ej: "$")
  status: boolean;      // Estado activo/inactivo (default: true)
  created_at: Date;     // Fecha de creación
  updated_at: Date;     // Fecha de última actualización
}
```

## Endpoints Disponibles

### 1. Listar todas las monedas
**GET** `/currencies`
- **Query Parameters**:
  - `status` (opcional): `true` | `false` - Filtrar por estado
- **Response**: Array de objetos Currency
```json
[
  {
    "id": 1,
    "description": "DOLARES",
    "prefijo": "USD",
    "signo": "$",
    "status": true,
    "created_at": "2024-08-24T18:30:00.000Z",
    "updated_at": "2024-08-24T18:30:00.000Z"
  },
  {
    "id": 2,
    "description": "EUROS",
    "prefijo": "EUR",
    "signo": "€",
    "status": true,
    "created_at": "2024-08-24T18:31:00.000Z",
    "updated_at": "2024-08-24T18:31:00.000Z"
  }
]
```

### 2. Obtener moneda por ID
**GET** `/currencies/:id`
- **Parameters**: `id` (number) - ID de la moneda
- **Response**: Objeto Currency
```json
{
  "id": 1,
  "description": "DOLARES",
  "prefijo": "USD",
  "signo": "$",
  "status": true,
  "created_at": "2024-08-24T18:30:00.000Z",
  "updated_at": "2024-08-24T18:30:00.000Z"
}
```
- **Errores**: 404 si no existe

### 3. Crear nueva moneda
**POST** `/currencies`
- **Body**:
```json
{
  "description": "DOLARES",
  "prefijo": "USD",
  "signo": "$",
  "status": true  // opcional, default: true
}
```
- **Response**: Objeto Currency creado
```json
{
  "id": 3,
  "description": "DOLARES",
  "prefijo": "USD",
  "signo": "$",
  "status": true,
  "created_at": "2024-08-24T18:32:00.000Z",
  "updated_at": "2024-08-24T18:32:00.000Z"
}
```
- **Validaciones**:
  - `description`: requerido, máximo 255 caracteres
  - `prefijo`: requerido, máximo 10 caracteres
  - `signo`: requerido, máximo 5 caracteres
  - `status`: opcional, boolean

### 4. Actualizar moneda
**PATCH** `/currencies/:id`
- **Parameters**: `id` (number) - ID de la moneda
- **Body**: Campos opcionales a actualizar
```json
{
  "description": "EUROS",
  "prefijo": "EUR",
  "signo": "€",
  "status": false
}
```
- **Response**: Objeto Currency actualizado
```json
{
  "id": 1,
  "description": "EUROS",
  "prefijo": "EUR",
  "signo": "€",
  "status": false,
  "created_at": "2024-08-24T18:30:00.000Z",
  "updated_at": "2024-08-24T18:35:00.000Z"
}
```
- **Errores**: 404 si no existe

### 5. Cambiar estado de moneda
**PATCH** `/currencies/:id/toggle-status`
- **Parameters**: `id` (number) - ID de la moneda
- **Response**: Objeto Currency con estado cambiado
```json
{
  "id": 1,
  "description": "DOLARES",
  "prefijo": "USD",
  "signo": "$",
  "status": false,
  "created_at": "2024-08-24T18:30:00.000Z",
  "updated_at": "2024-08-24T18:36:00.000Z"
}
```
- **Función**: Alterna entre activo/inactivo

### 6. Eliminar moneda
**DELETE** `/currencies/:id`
- **Parameters**: `id` (number) - ID de la moneda
- **Response**: Sin contenido (204)
```json
// No devuelve contenido, solo código de estado 200
```
- **Errores**: 404 si no existe

## Ejemplos de Uso

### Crear moneda
```bash
curl -X POST http://localhost:3000/currencies \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "DOLARES",
    "prefijo": "USD",
    "signo": "$"
  }'
```

### Listar monedas activas
```bash
curl -X GET "http://localhost:3000/currencies?status=true" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Actualizar moneda
```bash
curl -X PATCH http://localhost:3000/currencies/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "DOLARES AMERICANOS"
  }'
```

## Códigos de Respuesta HTTP

- **200**: Operación exitosa
- **201**: Recurso creado exitosamente
- **400**: Datos de entrada inválidos
- **401**: Token JWT inválido o faltante
- **404**: Recurso no encontrado
- **500**: Error interno del servidor

## Estructura de Archivos Implementados

```
src/currencies/
├── currencies.controller.ts    # Controlador con endpoints REST
├── currencies.service.ts       # Lógica de negocio
├── currencies.module.ts        # Configuración del módulo
├── dto/
│   ├── create-currency.dto.ts  # DTO para crear monedas
│   └── update-currency.dto.ts  # DTO para actualizar monedas
└── entities/
    └── currency.entity.ts      # Entidad TypeORM
```

## Características Técnicas

- **Framework**: NestJS con TypeScript
- **ORM**: TypeORM
- **Base de datos**: PostgreSQL (tabla: `currency_system`)
- **Validación**: class-validator
- **Documentación**: Swagger/OpenAPI
- **Autenticación**: JWT Guards
- **Arquitectura**: Modular con inyección de dependencias

## Notas Importantes

1. **Autenticación obligatoria**: Todos los endpoints requieren JWT válido
2. **Validación automática**: Los DTOs validan automáticamente los datos de entrada
3. **Soft delete**: Usar `toggle-status` en lugar de eliminar físicamente
4. **Filtros**: El endpoint GET soporta filtrado por estado
5. **Timestamps**: Se manejan automáticamente con TypeORM
6. **Documentación**: Disponible en Swagger UI para pruebas interactivas

Esta API está completamente integrada y lista para usar en el sistema de e-commerce.