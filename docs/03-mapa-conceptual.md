# 03 — Mapa conceptual

> Los diagramas están en Mermaid: se ven en GitHub y en la vista previa de Markdown de Cursor/VS Code. Para presentarlo en pantalla, abrir [`../mapa-conceptual.html`](../mapa-conceptual.html).

## 1. Cómo avanzamos (de la idea al sistema funcionando)

```mermaid
flowchart LR
    A[Entrevistas<br/>Luis + call center/stock] --> B[Documentación funcional]
    B --> C[Prototipo visual<br/>datos ficticios]
    C --> D{Demo a los<br/>2 departamentos}
    D -- devoluciones --> C
    D -- les convence --> E[Decisiones +<br/>spec para Cursor]
    E --> F[Base: login, permisos,<br/>centros, auditoría]
    F --> G[Presentismo +<br/>Documentación]
    G --> H[Inventario y pedidos]
    H --> I[Pacientes y call center]
    G -. piloto .-> L1((Luis))
    H -. piloto .-> L2((Stock))
    I -. piloto .-> L3((Call center))
    I --> J[Mejoras: backups,<br/>reportes, SUMAR, offline]
```

## 2. Qué es el sistema (módulos y relaciones)

```mermaid
flowchart TB
    P[Plataforma web administrativa]
    P --> AUTH[Login, usuarios y permisos]
    AUTH --> M1[Presentismo<br/>asistencia y novedades]
    AUTH --> M4[Documentación<br/>programas y pendientes]
    AUTH --> M3[Inventario<br/>stock y entregas]
    AUTH --> M2[Call center<br/>pacientes y llamadas]

    CEN[(Centros CAC x23)]
    M1 --- CEN
    M4 --- CEN
    M3 --- CEN

    PAC[(Pacientes<br/>datos clínicos separados)]
    M2 --- PAC
    PAC -. atenciones en .- CEN

    DB[(Base de datos centralizada<br/>registros, historial, auditoría)]
    M1 --> DB
    M2 --> DB
    M3 --> DB
    M4 --> DB
```

## 3. Quién usa qué

```mermaid
flowchart LR
    LUIS((Luis<br/>Administración)) --> M1[Presentismo]
    LUIS --> M4[Documentación]
    EMP((Empleada<br/>call center/stock)) --> M2[Call center]
    EMP --> M3E[Stock: panel encargado]
    CENTROS((Centros)) --> M3C[Stock: panel de pedidos]
    SUP((Supervisor)) --> CFG[Usuarios, permisos, catálogos]
    CFG -. autoriza reemplazos .-> LUIS
    CFG -. autoriza reemplazos .-> EMP
```

## 4. Quién del equipo lleva cada parte

```mermaid
flowchart TB
    subgraph VOS[Vos: coordinación + base]
      V1[Base de datos]
      V2[Login y permisos]
      V3[Auditoría]
      V4[Spec para Cursor]
    end
    subgraph C1[Compa 1: interfaz]
      I1[Prototipo visual]
      I2[Pantallas de cada módulo]
      I3[Diseño adaptable]
    end
    subgraph C2[Compa 2: relevamiento + pruebas]
      R1[Contacto con empleados]
      R2[Datos ficticios]
      R3[Pruebas y pilotos]
      R4[Manual de uso]
    end
    R1 --> I1
    R2 --> I1
    I1 --> V4
    V4 --> V1
    V1 --> I2
    I2 --> R3
    R3 -- errores y mejoras --> I2
```
