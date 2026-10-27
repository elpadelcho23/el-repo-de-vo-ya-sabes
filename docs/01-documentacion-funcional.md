# 01 — Documentación funcional

> Documento base para entender qué necesita cada empleado **antes** de programar. No es todavía el prompt para Cursor.
>
> Convención: **[Dijeron]** = lo que contaron los empleados en las entrevistas. **[Proponemos]** = funcionalidad que sugerimos nosotros y hay que validar con ellos.

---

## 1. ¿Qué aplicación queremos desarrollar?

Una **plataforma web de gestión administrativa** que centralice la información y facilite el trabajo de los distintos departamentos.

Hoy el trabajo se hace con Excel, Google Sheets, papeles, fotocopias, llamadas y mensajes. La información queda dispersa, muchas tareas son manuales y cuesta consultar datos rápido.

La plataforma tiene que adaptarse a cada departamento: no todos trabajan con la misma información ni necesitan las mismas herramientas.

### Objetivos principales

- Centralizar y organizar la información administrativa.
- Reducir tareas manuales y repetitivas.
- Facilitar la búsqueda y consulta de datos.
- Registrar las operaciones (qué se hizo, quién y cuándo).
- Mostrar avisos de tareas pendientes, datos faltantes y materiales sin stock.
- Dar acceso según usuario y permisos.
- Proteger datos personales e información sensible.
- Facilitar que un empleado reemplace a otro.

---

## 2. Módulo 1 — Presentismo y control administrativo de los centros

**Usuario principal:** Luis (Administración).

### Situación actual [Dijeron]

- Cada mañana recibe **fotos de planillas** de los centros para verificar quién está presente y quién tiene ausencia, demora o licencia.
- Usa **Google Sheets** para registrar centros, filtrar y comparar a qué hora llegan las fotos.
- Usa **colores y estados** para ver rápido qué centros están completos y cuáles pendientes.

### Problemas a resolver

- Revisa manualmente las fotos que mandan los centros.
- Tiene que comprobar cuáles enviaron y cuáles no.
- Si falta una planilla o alguien no está, tiene que detectarlo y avisar.
- En la misma jornada organiza otros formularios y registros.
- Cuando le piden info de un centro, la tiene que encontrar rápido.

### Qué debería permitir la aplicación [Proponemos]

| Función | Descripción |
|---|---|
| Panel general de presentismo | Centros y su estado del día con colores: completo / pendiente / a revisar. |
| Registro de asistencia | Personal administrativo, asistencia y novedades (ausencia, demora, licencia). |
| Avisos y pendientes | Qué centros no mandaron la foto o qué falta completar; Luis revisa y avisa. |
| Búsqueda y filtros | Por centro, fecha, estado o empleado; consulta de días anteriores. |
| Recepción de formularios (adicional) | Registrar la recepción de formularios de otros programas (ej. SUMAR). |

> **Importante:** presentismo y recepción de formularios están relacionados pero **no son el mismo proceso**. La app los tiene que diferenciar (ver Módulo 4).

---

## 3. Módulo 2 — Gestión de pacientes y call center

**Usuaria principal:** empleada del call center (segunda entrevista).

### Situación actual [Dijeron]

- Trabaja con pacientes atendidos en los **23 CAC**.
- Recibe **hojas de ingreso mensuales** y con eso organiza las llamadas.
- Se cargaron los pacientes y se filtró por **DNI** para que cada persona aparezca una sola vez.

### Problema

- El filtro no contempla bien los **teléfonos compartidos** entre familiares.
- Con el listado reducido, cuesta ver el **historial completo** de atenciones durante una llamada.
- Ejemplo: una madre comparte el teléfono con sus tres hijos. Si se ordena por apellido, quedan separados; al llamar no se encuentra rápido qué prestaciones recibió cada uno.

### Qué debería permitir la aplicación [Proponemos]

| Función | Descripción |
|---|---|
| Buscador de pacientes | Por DNI, nombre o teléfono. Diferencia a cada persona aunque compartan número. |
| Ficha individual | Datos identificatorios, teléfonos asociados y relación opcional entre familiares que comparten contacto. |
| Historial de atenciones | Atenciones, centros y prestaciones recibidas (si los datos están disponibles). |
| Registro de llamadas | Resultado de la llamada, respuestas y si hay que volver a contactar. |

### Relación con el programa SUMAR

- Luis trabaja principalmente con pacientes **sin obra social**.
- El call center necesita pacientes **con y sin obra social**.
- Los filtros/permisos de SUMAR **no deben excluir** pacientes que el call center necesita.
- La integración con SUMAR es una posibilidad, pero **primero hay que confirmar dónde están los registros y si se pueden conectar**. No asumimos acceso automático.

### Requisito clave: velocidad de uso

- Puede haber **varios operadores en simultáneo**, cada uno con su computadora.
- Prioridad: **búsqueda rápida y ficha clara**, sin abrir muchas pantallas durante la llamada.

---

## 4. Módulo 3 — Control de stock y entrega de fotocopias

**Usuaria principal:** empleada que administra las copias de formularios.

### Situación actual [Dijeron]

- Los centros piden materiales por teléfono o mensaje.
- Ella anota en un **cuaderno**, prepara las cantidades y registra la entrega.
- No hay forma centralizada de saber cuánto stock queda ni cuánto recibió cada centro.

### Problemas a resolver

- Los centros piden sin conocer las existencias.
- Hay que comprobar a mano qué queda.
- Cuesta reconstruir cuánto se entregó a cada centro.
- Algunos centros piden más de lo que necesitan.
- La falta de stock genera discusiones y demoras.
- Hay recursos de impresión limitados para reponer.

### Cómo debería funcionar [Proponemos]

**A. Panel de solicitudes (centros):** ver formularios disponibles, elegir materiales y cantidades, enviar pedido. Si no hay stock suficiente, aviso **antes** de confirmar.

**B. Panel del encargado de stock:** cargar existencias iniciales, revisar solicitudes, preparar pedidos, registrar cantidades entregadas y actualizar inventario.

**C. Historial de movimientos:** pedidos, entregas, devoluciones y ajustes, con fecha, material, cantidad y usuario responsable.

### Ejemplo

1. Se registran **5.000** copias de historias clínicas.
2. Un centro pide **200**. Se prepara y se confirma la entrega de 200.
3. El stock queda en **4.800**.
4. Si otro centro pide más de lo disponible, la app avisa y el encargado revisa el pedido.

- El historial por centro sirve para ver patrones de consumo y detectar pedidos que parecen excesivos. **Es información para revisar, no prueba automática de desperdicio.**
- **Las firmas de recepción en papel se mantienen** como comprobante. La app registra, no reemplaza la firma.

---

## 5. Módulo 4 — Programas y documentación administrativa

**Usuario principal:** Luis (Administración).

### Situación actual [Dijeron]

- Organiza formularios y documentación de distintos programas.
- Usa planillas para registrar qué centros enviaron los papeles y cuáles están pendientes.
- Las tareas se repiten (por ejemplo semanalmente) y requieren comparar varios centros.

### Funcionalidades propuestas [Proponemos]

- Crear un registro por cada programa administrativo.
- Definir qué documentación presenta cada centro y con qué frecuencia.
- Registrar recepción de formularios y fecha.
- Identificar centros con documentación pendiente.
- Consultar historial de presentaciones.
- Filtrar por centro, programa, período y estado.
- Avisos para el seguimiento.

> No asumir que todos los programas tienen los mismos formularios o plazos: **los requisitos se configuran por programa**.

---

## 6. Módulo 5 — Usuarios, permisos y acceso a la información

Los empleados pueden trabajar en distintos departamentos y a veces uno reemplaza a otro. **No todos deben ver todo.**

### Funcionamiento propuesto

- Cada empleado tiene **cuenta personal** (usuario y contraseña) y ve solo las herramientas habilitadas.
- Permisos por departamento y responsabilidad:

| Rol | Acceso |
|---|---|
| Administración | Presentismo y recepción de documentación |
| Call center | Búsqueda de pacientes, atenciones y registro de llamadas |
| Responsable de stock | Inventario, solicitudes y entregas |
| Centro (solicitante) | Ver materiales disponibles y hacer pedidos |
| Supervisor / Admin del sistema | Usuarios, permisos y catálogos |

- Una persona puede tener **más de un módulo** si cubre otro puesto, pero ese acceso lo **autoriza un supervisor**; no alcanza con elegir el departamento en una pantalla.
- **Datos clínicos con control de acceso estricto:** cada usuario ve solo lo necesario para su tarea.
- Registrar operaciones relevantes (auditoría), proteger sesiones y definir copias de seguridad.

---

## 7. Relación entre módulos

```
Plataforma web administrativa
└── Inicio de sesión, permisos y navegación
    ├── Presentismo ........ asistencia y novedades
    ├── Documentación ...... programas y pendientes
    ├── Inventario ......... stock y entregas
    └── Call center ........ pacientes y llamadas
        └── Base de datos centralizada: registros, historial, permisos y auditoría
```

- La base es **compartida cuando corresponde**, pero la información **no se mezcla**.
- Un **centro** se relaciona con sus empleados administrativos, sus presentaciones de documentación y sus pedidos de materiales.
- El **historial clínico** de un paciente queda **separado** de inventario y presentismo.

---

## 8. Requisitos técnicos generales

| Requisito | Qué significa |
|---|---|
| Plataforma web | Acceso por navegador, sin instalar nada en cada PC. |
| Diseño adaptable | Usable en computadora y celular. |
| Base de datos centralizada | Todos los autorizados trabajan sobre información compartida y actualizada. |
| Autenticación | Cada usuario con su propia cuenta. |
| Permisos por función | Cada persona ve solo lo autorizado. |
| Validaciones | Evitar formularios incompletos, cantidades inválidas y duplicados. |
| Historial de cambios | Quién modificó datos relevantes y cuándo. |
| Copias de seguridad | Recuperar información ante fallas. |
| Avisos y estados | Pendientes, errores y falta de stock. |
| Protección de datos | Medidas especiales para información personal y clínica. |

**Riesgo de conexión:** si se cae internet, la app web deja de estar disponible. Los cortes se describieron como poco frecuentes, pero no está garantizado. Para la **v1**: app web + copias de seguridad automáticas. Un **modo sin conexión** se evalúa más adelante (requiere diseño extra para no perder datos ni generar conflictos).

---

## 9. Orden de desarrollo sugerido

1. **Base de la aplicación:** login, usuarios, permisos, centros y estructura de la base.
2. **Presentismo y documentación:** procesos de Luis bastante definidos y apoyados en planillas existentes.
3. **Inventario y pedidos:** materiales, solicitudes de centros y control de entregas.
4. **Pacientes y call center:** búsqueda, fichas y llamadas. Antes de usar datos reales: definir fuentes, permisos y protección de datos clínicos.

> Es una propuesta, no una decisión final. Si el inventario es lo más urgente, se puede priorizar.

---

## 10. Próximo documento

Con las [decisiones](04-decisiones.md) tomadas, se arma la **especificación funcional y técnica para Cursor**: pantallas, tablas, relaciones, validaciones, permisos y pasos de implementación. Así evitamos que la IA programe algo ambiguo o invente funciones que nadie pidió.
