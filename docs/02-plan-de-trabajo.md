# 02 — Plan de trabajo (3 personas)

## Idea general

No arrancamos programando todo. Primero **mostramos un prototipo** a los dos departamentos (Administración de Luis, y call center/stock) para que lo vean cómodo, opinen y se convenzan. Con esa devolución cerramos las decisiones y recién ahí construimos módulo por módulo.

```
Fase 0  Organización             (semana 1)
Fase 1  Prototipo visual + demo  (semanas 2-3)   <- lo que mostramos
Fase 2  Decisiones + spec Cursor (semana 4)
Fase 3  Base de la aplicación    (semanas 5-6)
Fase 4  Presentismo + Documentación (semanas 7-9)  -> piloto con Luis
Fase 5  Inventario y pedidos     (semanas 10-12)   -> piloto con stock
Fase 6  Pacientes y call center  (semanas 13-16)   -> piloto con call center
Fase 7  Mejoras, backups, evaluar modo sin conexión (continuo)
```

> Las semanas son orientativas. Si después de la demo el stock resulta lo más urgente, se intercambian las fases 4 y 5.

---

## Roles

### Vos — Coordinación + Base técnica
- Lleva el tablero de tareas y la agenda de reuniones.
- Diseña la base de datos (centros, usuarios, roles, módulos, auditoría).
- Login, permisos y estructura común de la app.
- Revisa e integra lo que hacen los otros dos.
- Arma la especificación final para Cursor.

### Compa 1 — Interfaz + Prototipo
- Diseña las pantallas (prototipo visual navegable con datos de mentira).
- Define el estilo: colores de estado (verde completo / amarillo pendiente / rojo a revisar), tipografía, layout adaptable a celular.
- Después, construye el frontend de cada módulo.
- Prioriza que el buscador del call center sea rápido y la ficha entre en una sola pantalla.

### Compa 2 — Relevamiento + Datos + Pruebas
- Contacto con Luis y con la empleada de call center/stock.
- Consigue ejemplos de planillas (anonimizadas) y arma **datos ficticios** realistas (23 CAC, empleados, pacientes con teléfonos compartidos, formularios, stock).
- Confirma dónde están los datos de SUMAR y de pacientes.
- Prueba cada módulo, anota errores y devoluciones de los empleados.
- Escribe un mini manual de uso por módulo.

> Todos participan de las demos y de las decisiones. Cada uno es "dueño" de su área, pero no trabaja aislado.

---

## Tareas por fase

### Fase 0 — Organización (semana 1)

| Tarea | Responsable |
|---|---|
| Leer los docs 01 y 04 y marcar dudas | Todos |
| Crear tablero de tareas (Trello / GitHub Projects / Notion) | Vos |
| Subir el repo a un remoto compartido (GitHub o Cursor) | Vos |
| Pedir a Luis y a la empleada fotos/ejemplos de planillas y del cuaderno (sin datos reales) | Compa 2 |
| Juntar referencias visuales de paneles simples | Compa 1 |
| Reunión de arranque: repartir tareas y fijar fecha de demo | Todos |

**Entregable:** tablero armado, fecha de demo confirmada.

### Fase 1 — Prototipo visual + demo (semanas 2-3)

Objetivo: que los departamentos **vean** cómo sería y digan "esto me sirve".

| Tarea | Responsable |
|---|---|
| Pantalla de login y menú según rol | Compa 1 |
| Panel de presentismo con los 23 centros y colores | Compa 1 |
| Pantalla de documentación pendiente por programa | Compa 1 |
| Panel de pedidos del centro + panel del encargado de stock | Compa 1 |
| Buscador de pacientes + ficha con familia que comparte teléfono | Compa 1 |
| Datos ficticios para que todo se vea real | Compa 2 |
| Guion de demo y preguntas para los empleados ([doc 05](05-guion-demo.md)) | Compa 2 |
| Revisar que el prototipo respete lo que dijeron en las entrevistas | Vos |
| Hacer la demo y anotar devoluciones | Todos |

**Entregable:** prototipo navegable + lista de devoluciones de Luis y de la empleada.

> El prototipo puede ser HTML estático o una app mínima con datos en memoria. **No hace falta base de datos real todavía.**

### Fase 2 — Decisiones + especificación para Cursor (semana 4)

| Tarea | Responsable |
|---|---|
| Completar el [doc 04 de decisiones](04-decisiones.md) con lo aprendido en la demo | Todos |
| Definir tecnologías (framework, base de datos, hosting) | Vos |
| Escribir especificación: pantallas, tablas, relaciones, validaciones, permisos | Vos + Compa 1 |
| Validar la especificación con los empleados (lo que les toca) | Compa 2 |

**Entregable:** especificación lista para pasársela a Cursor por partes.

### Fase 3 — Base de la aplicación (semanas 5-6)

| Tarea | Responsable |
|---|---|
| Proyecto inicial, base de datos, migraciones | Vos |
| Login, usuarios, roles y permisos por módulo | Vos |
| Registro de auditoría (quién hizo qué y cuándo) | Vos |
| ABM de centros | Compa 1 |
| Layout común, navegación y diseño adaptable | Compa 1 |
| Script de carga de datos ficticios | Compa 2 |
| Pruebas de permisos (un usuario no ve lo que no le corresponde) | Compa 2 |

### Fase 4 — Presentismo + Documentación (semanas 7-9) → piloto con Luis

| Tarea | Responsable |
|---|---|
| Modelo: personal administrativo, asistencia diaria, novedades | Vos |
| Modelo: programas, requisitos configurables, presentaciones | Vos |
| Panel del día con estados y colores | Compa 1 |
| Avisos de centros sin foto / documentación pendiente | Compa 1 |
| Filtros por centro, fecha, estado, empleado, programa | Compa 1 |
| Piloto con Luis en paralelo a su Google Sheets (1-2 semanas) | Compa 2 |

### Fase 5 — Inventario y pedidos (semanas 10-12) → piloto con stock

| Tarea | Responsable |
|---|---|
| Modelo: materiales, stock, pedidos, movimientos | Vos |
| Lógica de stock según la decisión tomada (confirmar entrega / reservar) | Vos |
| Panel de solicitudes para centros con aviso de falta de stock | Compa 1 |
| Panel del encargado y historial por centro | Compa 1 |
| Piloto en paralelo al cuaderno (sin dejar de usar las firmas en papel) | Compa 2 |

### Fase 6 — Pacientes y call center (semanas 13-16) → piloto con call center

| Tarea | Responsable |
|---|---|
| Confirmar fuente de datos y permisos de datos clínicos **antes** de cargar datos reales | Compa 2 + Vos |
| Modelo: pacientes, teléfonos (compartidos), atenciones, llamadas | Vos |
| Importación desde Excel/CSV (si así se decide) | Vos |
| Buscador rápido por DNI/nombre/teléfono + ficha en una pantalla | Compa 1 |
| Registro de llamadas y "volver a llamar" | Compa 1 |
| Prueba con varios operadores en simultáneo | Compa 2 |

### Fase 7 — Mejoras continuas

- Copias de seguridad automáticas y prueba de restauración.
- Reportes (consumo por centro, presentismo mensual).
- Evaluar integración con SUMAR.
- Evaluar modo sin conexión.

---

## Forma de trabajo

- **Reunión semanal corta (30 min):** qué hicimos, qué sigue, qué nos traba.
- **Una rama por tarea** en git y revisión de otro compa antes de unir a `main`.
- **Nada de datos reales de pacientes** en el repo ni en el prototipo.
- Cada fase termina con una **mini demo** al empleado que corresponde.
- Las devoluciones se anotan en el tablero como tareas nuevas.

## Riesgos y cómo los manejamos

| Riesgo | Qué hacemos |
|---|---|
| Los empleados no quieren dejar sus planillas | Piloto en paralelo, no reemplazo de golpe |
| No hay acceso a los datos de SUMAR | El módulo funciona igual con carga manual/importación |
| Datos clínicos expuestos | Permisos estrictos, auditoría, datos ficticios hasta tener autorización |
| Se cae internet | Backups automáticos; modo sin conexión se evalúa después |
| Querer hacer todo a la vez | Un módulo por fase, piloto, y recién después el siguiente |
