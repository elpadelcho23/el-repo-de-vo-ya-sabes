# 00 — Auditoría inicial

Revisión de arquitectura del 27 de octubre de 2026 (hora de Buenos Aires). Alcance: el estado del repositorio, la demo y la documentación ya escrita. Esta revisión no cierra decisiones de negocio ni autoriza a programar.

## Cómo leer este informe

| Marca | Significado |
|---|---|
| **Hecho** | Está en el repositorio o se desprende del código de la demo. |
| **Dijeron** | La documentación funcional lo atribuye a las entrevistas con los empleados. |
| **Proponemos** | El equipo ya lo escribió como idea y todavía no está validado. |
| **Propuesta de esta auditoría** | Recomendación de esta revisión. No es un pedido de los empleados. |
| **Pendiente** | Pregunta o decisión sin respuesta en el repositorio. |

No se modificó ningún archivo previo. No se escribió código de aplicación ni se instalaron dependencias.

Método: lectura de los 17 archivos versionados y del código de `demo/app.js`, `demo/data.js`, `demo/styles.css` y `mapa-conceptual.html`. No hay servidor que ejecutar. El comportamiento descrito es el que ese código implementa. Las capturas son imágenes de escritorio; esta revisión no recorrió la demo en un celular.

---

## 1. Estado actual del repositorio

**Hecho.** El proyecto está en definición y en prototipo visual. Al momento de la revisión, `main` tenía un único commit, del 27 de octubre de 2026 a las 17:42 (hora de Buenos Aires): «Publicar el prototipo navegable y la documentación para la demo». No había otras ramas en el remoto.

Archivos versionados:

| Pieza | Qué es |
|---|---|
| `README.md` | Presentación del proyecto, roles del equipo y cómo abrir la demo. |
| `docs/01-documentacion-funcional.md` | Necesidades atribuidas a las entrevistas y funciones propuestas. |
| `docs/02-plan-de-trabajo.md` | Fases 0 a 7, tareas y riesgos ya identificados por el equipo. |
| `docs/03-mapa-conceptual.md` | Diagramas de avance, módulos, usuarios y equipo. |
| `docs/04-decisiones.md` | Decisiones y preguntas abiertas. Ninguna casilla está marcada. |
| `docs/05-guion-demo.md` | Guion para mostrar el prototipo. La tabla de devoluciones está vacía. |
| `mapa-conceptual.html` | Misma historia del mapa, en una página para proyectar. No guarda datos. |
| `demo/` | Prototipo de un solo navegador, con datos ficticios. |
| `demo/capturas/` | Seis PNG de 1366×900: login, inicio, presentismo, stock, pedidos y call center. |

**Hecho.** No existe, y no hay que suponerlo:

- aplicación de servidor, API o framework;
- base de datos, esquema, migraciones o script de carga fuera de la demo;
- autenticación real, gestión de contraseñas o sesiones de servidor;
- pruebas automatizadas;
- configuración de despliegue, contenedores, CI o variables de entorno;
- `.gitignore`;
- tablero de tareas, ejemplos de planillas o devoluciones de la demo.

El README dice que todavía no hay código y, a continuación, documenta la demo. La lectura precisa es esta: no hay sistema en funcionamiento. Sí hay código de prototipo (`demo/app.js`, 1020 líneas, más `data.js` y `styles.css`).

El plan de trabajo pide una rama por tarea y revisión de otro integrante antes de unir a `main`. **Hecho:** el remoto tiene una sola rama y un solo commit. Los nombres del equipo siguen como «Vos», «Compa 1» y «Compa 2». El propio README pide reemplazarlos.

### En qué fase está el plan escrito

| Fase del doc 02 | Estado verificable |
|---|---|
| 0. Organización | Parcial. El repositorio compartido existe. No están en el repo el tablero, la fecha de demo ni los ejemplos de planillas o del cuaderno. |
| 1. Prototipo y demo | El prototipo y el guion existen. Falta el criterio de salida: la lista de devoluciones de Luis y de la empleada. |
| 2. Decisiones y especificación | `docs/04-decisiones.md` sigue en blanco, tecnologías incluidas. |
| 3 a 7. Construcción y pilotos | Sin iniciar. No hay base, login, módulos persistentes ni pilotos. |

**Propuesta de esta auditoría.** La siguiente actividad del equipo sigue siendo la demo y el cierre del doc 04. Programar antes de eso fija reglas que los empleados todavía no confirmaron.

---

## 2. La demo: qué hace el prototipo y qué solo simula

**Hecho.** `demo/index.html` se abre sin instalación y sin red. No llama a ningún servidor: no hay `fetch`, base remota ni cola de mensajes. El estado vive en `localStorage` (`demo-cac-v1`). El usuario elegido vive en `sessionStorage`. Los cambios de una computadora no aparecen en otra.

Si la fecha guardada no coincide con el día local del navegador, el prototipo tira todo el estado y vuelve a generar los datos. El botón «Reiniciar datos» también borra pedidos, llamadas y el registro de actividad. Dentro del mismo día y del mismo navegador, los cambios sí se conservan.

Eso alcanza para una reunión. No es una base compartida, no soporta varios operadores a la vez y no sirve como registro administrativo.

### Ingreso

**Hecho.** Los campos de usuario y contraseña están deshabilitados. Se entra tocando una persona de la lista, o con un parámetro en la dirección (`?usuario=luis&vista=presentismo` y los otros enlaces del README). Esos enlaces funcionan según el código. Si la vista no está en los módulos de esa persona, el prototipo muestra el inicio.

El texto de la pantalla dice que en la versión real cada empleado entra con usuario y contraseña. El prototipo no comprueba identidad, no vence la sesión y no impide que alguien abra las herramientas de desarrollador y cambie el usuario, los permisos o los datos.

Personas del prototipo:

| Id | Nombre en la demo | Módulos que el código habilita |
|---|---|---|
| `luis` | Luis Martínez, Administración | Presentismo y documentación |
| `carla` | Carla Ríos, Call center y stock | Stock y call center |
| `marcos` | Marcos Paz, Operador | Solo call center |
| `cac5` | CAC 5 — Santa Rosa | Solo pedidos. Es el único centro que puede entrar. |
| `super` | Supervisión | Presentismo, documentación, stock, call center, usuarios y actividad. No pide materiales. |

**Hecho.** Luis, la existencia de 23 centros y una empleada de call center y de stock salen de la documentación de entrevistas. Carla Ríos, Marcos Paz, la cuenta «CAC 5» y «Supervisión» son personas del prototipo. El mapa conceptual muestra una sola empleada de call center/stock y no muestra un operador aparte.

### Presentismo

**Hecho, dentro del prototipo y solo para «hoy».** Hay 23 centros con estados completo, a revisar y sin planilla. Se puede filtrar, buscar por centro, barrio o empleado, abrir el centro, cambiar el estado de cada empleado (presente, ausente, demora, licencia, sin dato), escribir una observación, marcar el centro como revisado y copiar un texto de aviso. Registrar la planilla recibida pone a todo el personal de ese centro como presente. Esas acciones quedan en el registro de actividad del navegador.

**Simulación.** La «foto» es un recuadro con la frase «Foto de la planilla» y una aclaración de que en la versión real se vería la foto. No hay carga, almacenamiento ni visualización de imágenes. El aviso no se envía: solo se copia. Los centros no tienen una pantalla para informar asistencia. Quien carga el dato es el usuario de administración, después de recibir la foto por fuera del sistema.

**Simulación del pasado.** Elegir un día anterior muestra tarjetas de solo lectura. Esos estados salen de un generador aleatorio con semilla (`historialDia` en `data.js`), no de lo que se haya cargado ese día. No se puede abrir el personal de ese día. El paso 4 del guion —encontrar la asistencia de un centro de un martes anterior— muestra el centro y un estado inventado, no la novedad de cada empleado.

Al cambiar el día del calendario, también se pierde lo cargado «hoy».

### Documentación de programas

**Hecho, dentro del prototipo.** Tres programas vienen cargados: SUMAR (semanal), Materno Infantil (mensual) e Inmunizaciones (mensual), cada uno con una lista fija de formularios. Se puede cambiar de período, filtrar pendientes y recibidos, registrar o deshacer una recepción y copiar la lista de pendientes. Presentismo y documentación son pantallas distintas.

**Simulación y hueco.** No se puede crear un programa, cambiar la frecuencia ni editar la lista de formularios. La documentación funcional pide eso como configuración por programa. En las entrevistas, el único programa nombrado como ejemplo es SUMAR. Materno Infantil e Inmunizaciones están en el prototipo y no aparecen como dato confirmado por Luis. **Pendiente:** la pregunta del doc 04 sobre qué otros programas maneja y con qué frecuencia.

No se adjunta el formulario. Se registra una fecha de recepción.

### Inventario y pedidos

**Hecho, dentro del prototipo.** Esta parte es la más completa del archivo local.

- El centro ve el stock, arma cantidades y recibe un aviso si pide más de lo disponible. Puede enviar igual.
- El encargado ve pedidos abiertos, los pasa a preparación, registra una entrega (también parcial) y el stock baja en ese momento, rechaza un pedido, da de alta un material y carga ingresos, devoluciones y ajustes.
- Hay historial filtrable y un consumo por centro de los últimos 90 días. Si un centro supera 1,6 veces el promedio, la pantalla dice «para revisar». El texto aclara que no es prueba de desperdicio.
- Al confirmar la entrega, la pantalla recuerda la firma del remito en papel.
- El ejemplo del guion se puede recorrer: Historia clínica arranca en 5.000 y el pedido pendiente del CAC 3 incluye 200. Confirmar esas 200 deja 4.800. El mismo pedido también incluye 50 planillas de asistencia; si se entregan, ese otro stock también baja. El guion menciona solo las 200 copias.

**Reglas que el prototipo ya ejecuta y el doc 04 todavía no eligió:**

- El stock no se reserva al pasar a preparación. Dos pedidos pueden prepararse por la misma existencia.
- Una entrega parcial cierra el pedido completo. No queda un resto para una segunda entrega.
- El rechazo no devuelve stock, porque nada se había descontado. El rechazo como acción no está escrito en la documentación funcional.
- El umbral de 1,6 veces el promedio no fue pedido en las entrevistas.
- Las devoluciones se pueden cargar, y el doc 04 sigue preguntando si existen.
- El aviso de falta de stock no impide el pedido. La documentación dice «aviso antes de confirmar» y no dice si el pedido debe bloquearse.

Los nombres y las cantidades de formularios son datos de la demo. La pregunta «qué formularios maneja y cuánto stock tiene hoy» sigue abierta. El ejemplo de las historias clínicas sí está en la documentación funcional, como ilustración del circuito propuesto.

**Hecho de nombres.** «Historia clínica» en inventario es un formulario en papel para fotocopiar. El «historial de atenciones» del call center es otra cosa. Conviene no usar el mismo nombre para las dos en el modelo futuro.

### Call center

**Hecho, dentro del prototipo.** Hay 15 pacientes ficticios. El buscador filtra por DNI, nombre o teléfono, y separa obra social en «con» y «sin». Buscar el teléfono de ejemplo del guion muestra a la madre y a sus tres hijos por separado, aunque el apellido no coincida. La ficha muestra identificación, teléfonos, vínculo escrito a mano, centro habitual, atenciones y llamadas. Se puede registrar el resultado y un «volver a llamar». Al guardar una llamada nueva, las anteriores de esa persona quedan marcadas como resueltas.

**Simulación.** No hay alta ni importación de pacientes. Los motivos y los resultados de la llamada son listas fijas del prototipo; el doc 04 todavía pregunta qué se pregunta en cada llamada. No hay dos operadores simultáneos: hay que salir de una persona para entrar como la otra, y otro navegador no ve los cambios. Abrir una ficha no se anota en el registro de actividad. Sí se anota el guardado de la llamada.

Los pacientes, DNI, teléfonos, direcciones y prestaciones son inventados. El archivo incluye menores de edad ficticios para el caso del teléfono compartido. No corresponden a personas reales. Igual están en el mismo `localStorage` que el stock, legibles para quien use ese navegador, y la cuenta de supervisión tiene el módulo de call center.

### Usuarios, permisos y actividad

**Hecho, dentro del prototipo.** Supervisión marca o desmarca módulos por persona. No puede quitarse a sí misma el módulo de usuarios. El registro muestra acciones de cambio, con hora, nombre y texto, y se puede filtrar por usuario.

**Huecos.** No se crean ni se dan de baja usuarios, centros, empleados administrativos ni programas. No hay contraseña, recupero ni cierre por inactividad. El permiso se evalúa en el navegador. Reiniciar los datos borra la auditoría. Entrar, salir, buscar un paciente o abrir una ficha no quedan registrados.

### Diseño adaptable

**Hecho.** La hoja de estilos tiene cortes en 1000 px y 760 px: el menú pasa a una fila horizontal y el call center apila las columnas. Las capturas del repo son solo de escritorio, 1366×900. Esta auditoría no abrió la demo en un celular, así que el ajuste fino de uso táctil queda sin verificar.

---

## 3. Funcionalidades documentadas, cubiertas y ausentes

La columna «Entrevistas» solo marca lo que el doc 01 etiqueta como dicho por los empleados. El resto de las filas de funciones del doc 01 está marcado ahí como propuesta.

| Necesidad | Origen | En la demo | Fuera de la demo |
|---|---|---|---|
| Luis recibe fotos de planillas y las sigue en una hoja de cálculo, con colores y estados | Dijeron | Panel del día con colores, en un solo navegador | Foto real, envío desde el centro, historial verdadero |
| Avisar centros que no mandaron la planilla | Proponemos | Texto copiable | Canal real. Sigue pendiente cómo avisa hoy |
| Buscar un día anterior por centro, fecha, estado o empleado | Proponemos | Día anterior generado al azar, sin abrir empleados | Historial persistente |
| Recepción de formularios distinta del presentismo | Proponemos, con SUMAR como ejemplo | Pantalla separada | Alta de programas. Otros programas sin confirmar |
| Pacientes de 23 CAC, hojas de ingreso mensuales, filtro por DNI que no resuelve teléfonos compartidos | Dijeron | Búsqueda ficticia que separa a quien comparte teléfono | Fuente real, varios operadores, autorización |
| Ficha, historial de atenciones y registro de llamadas | Proponemos | Ficha local y registro local | Datos reales y permiso para verlos |
| Pedidos por teléfono o mensaje, cuaderno, entrega y poca visibilidad del stock | Dijeron | Pedido, entrega, stock e historial locales | Stock real, 23 centros conectados, regla de descuento confirmada |
| Aviso antes de pedir de más, historial para revisar consumo, firma en papel que se mantiene | Proponemos | Aviso, consumo y recordatorio de firma | Confirmar la firma, las devoluciones y el bloqueo o no del pedido |
| Cuenta personal, permisos y reemplazo autorizado por un supervisor | Proponemos | Selector de personas y casillas de módulos | Identidad real. El centro de la demo es una cuenta compartida, no una persona |
| Registrar quién hizo qué y cuándo | Proponemos | Registro local de algunas acciones, borrable | Auditoría que no se pueda alterar y que incluya consultas sensibles |
| Web, usable en computadora y celular, datos centralizados, validaciones, copias de seguridad | Proponemos | HTML adaptable en un archivo local | Servidor, base, respaldos, concurrencia |
| Cortes de internet poco frecuentes; la v1 sería web más respaldos; el modo sin conexión se evalúa después | Dijeron el corte poco frecuente. Proponemos el alcance | El archivo abre sin internet porque no es el sistema | Respaldos. El modo sin conexión sigue diferido |
| Integración con SUMAR | Posibilidad nombrada, sin asumir acceso | Un programa y un formulario con ese nombre, sin conexión externa | Dónde están los registros y si se pueden conectar |

**Hecho.** Los cuatro módulos previstos en el encargo están representados en la demo. También está el transversal de usuarios, que el doc 01 numera como módulo 5. Ninguno persiste fuera del navegador.

Lo que no está en ningún archivo, ni como prototipo:

- alta y baja de centros, de personal administrativo y de cuentas;
- recepción de la foto o de un archivo;
- mensaje que salga del sistema;
- importación CSV o Excel;
- conexión con SUMAR u otro sistema;
- reserva de stock, reposiciones de impresión y cupo de impresiones;
- reportes mensuales de presentismo o de consumo, más allá del cuadro de 90 días de la demo;
- copias de seguridad y prueba de restauración;
- modo sin conexión con resolución de conflictos;
- manual de uso.

**Propuesta de esta auditoría.** No agregar esas piezas a la primera versión salvo que un empleado las pida en la demo y queden escritas en el doc 04.

---

## 4. Contradicciones y requisitos todavía abiertos

### Prioridad de construcción

**Hecho.** Conviven tres órdenes distintos:

1. El doc 01, el doc 02 y el mapa: base, después presentismo y documentación, después inventario, después pacientes. El doc 04 recomienda presentismo, con la casilla sin marcar. El plan permite intercambiar inventario y presentismo si, después de la demo, el stock es lo más urgente.
2. Este encargo de auditoría: orden incremental que empiece por inventario y pedidos, sin descartar el resto.
3. Los empleados: no eligieron. La casilla del doc 04 está vacía y no hay devoluciones de demo.

**Propuesta de esta auditoría.** El orden de la sección 8 toma el inventario como primer módulo usable. Sigue siendo una propuesta hasta que Luis y la empleada de stock lo confirmen. Presentismo, documentación y call center quedan en fases posteriores, no eliminados.

### Quién es cada usuario

**Hecho.** El doc 01 separa los roles de call center, stock, centro y supervisor. El plan y el mapa hablan de una empleada que cubre call center y stock. La demo le da a Carla los dos módulos y, además, inventa un operador (Marcos) que las entrevistas no describen. La cuenta del centro no es una persona: es «CAC 5», y los otros 22 centros no entran.

**Pendiente.** Si stock y call center son el mismo puesto, esa persona ve datos de salud y también el inventario. El doc 01 pide que cada uno vea solo lo de su tarea. Hay que preguntar el organigrama real antes de copiar la demo. Cuántos operadores trabajan al mismo tiempo también sigue preguntado en el doc 04 y sin respuesta.

### SUMAR aparece en tres lugares que no se tocan

**Hecho.** SUMAR es un programa de documentación semanal, un formulario del stock («Ficha de inscripción SUMAR») y una población de pacientes sin obra social que Luis seguiría, distinta de la población del call center. El prototipo no relaciona esas tres cosas. El doc 01 dice que no se asume conexión automática.

**Pendiente.** Dónde están hoy esos registros, quién autoriza verlos y si la primera versión necesita algo más que el nombre del programa.

### El mapa habla en presente de decisiones abiertas

**Hecho.** `mapa-conceptual.html` dice «Cuentas personales» y describe el circuito de stock como si ya estuviera definido. El doc 04 deja sin marcar el modelo de cuentas, la regla de stock, el origen de los pacientes, los datos de prueba y el alcance de la primera versión. Tecnologías, base, alojamiento y copias de seguridad están en blanco.

### Lo que el guion promete de más

**Hecho.** El guion pide mostrar la asistencia de un centro de un día anterior. El prototipo, en un día anterior, no muestra el personal ni novedades guardadas. Conviene decirlo en la reunión para no validar una función que el archivo no tiene.

El guion también recorre call center y stock en la misma sesión, con una sola empleada. Eso es coherente con tratarlos como un solo puesto y choca con separarlos si resultan ser dos personas.

### Requisitos que los empleados no confirmaron

Siguen abiertas, copiadas del doc 04, y esta revisión no les inventa respuesta:

- hora límite para dar una planilla por pendiente;
- programas además de SUMAR, y su frecuencia;
- cómo avisa Luis hoy a los centros;
- cantidad de operadores en simultáneo;
- qué se registra en cada llamada;
- dónde están los datos de atenciones y quién los autoriza;
- formularios reales y stock actual;
- si el centro tendría una computadora para pedir, o si seguirían llamando;
- si hay devoluciones y cómo se hacen.

Tampoco está confirmado, aunque el prototipo ya lo muestra: mantener la firma en papel, permitir el pedido que supera el stock, cerrar el pedido en una entrega parcial, el estado «en preparación», el rechazo, el umbral de consumo y las listas de motivos de llamada.

---

## 5. Riesgos técnicos, de seguridad y de privacidad

Los riesgos de «seguir en planilla» y de «hacer todo a la vez» ya están en el doc 02. Acá se agregan los que se ven al revisar el repo y el código.

### R1. Tomar el prototipo por el sistema

El ingreso es un selector de roles. La dirección elige la persona. Los permisos se pueden cambiar en el navegador. Los datos no se comparten y se regeneran al día siguiente o al reiniciar. Dos operadores del call center, requisito propuesto como prioridad de uso, no pueden trabajar sobre la misma información.

Si este archivo se publica en un sitio del municipio, cualquiera entra a todas las pantallas, pacientes ficticios incluidos. **Propuesta de esta auditoría:** la demo se abre en la reunión como archivo local y no se despliega como si fuera la aplicación.

### R2. Datos de salud, de identidad y de menores

**Dijeron:** el call center trabaja con pacientes de los 23 CAC, busca por DNI y necesita ver a varios familiares que comparten teléfono, incluidos hijos. **Proponemos:** ficha, prestaciones y registro de llamadas, con control estricto.

**Hecho:** no hay autorización registrada, ni fuente confirmada, ni responsable designado. El prototipo guarda identificación, teléfonos, domicilio, obra social y prestaciones en el mismo almacén que las fotocopias. Supervisión ve el call center. Si Carla representa un solo puesto de stock y llamadas, ese puesto también ve el historial. Consultar una ficha no queda en la auditoría.

Una foto de planilla de asistencia, cuando exista, también puede tener nombres del personal. Ese archivo todavía no tiene reglas de conservación ni de acceso.

**Propuesta de esta auditoría.** Inventario, presentismo y documentación pueden avanzar con datos operativos del municipio cuando esos datos estén definidos. Pacientes y atenciones no se cargan, no se importan y no se copian al repositorio hasta que el área responsable autorice el tratamiento y estén definidos el acceso mínimo, el registro de consultas, el cifrado en tránsito y en reposo, la retención y el lugar de alojamiento. La interpretación legal le corresponde al municipio; el repo solo pide «proteger datos personales», sin constancia de esa revisión.

Los datos de la demo son ficticios y así deben seguir. El plan ya prohíbe datos reales de pacientes en el repo. No hay un control técnico que lo impida: no existe `.gitignore` ni revisión automática, y la fase 0 pide juntar fotos de planillas y del cuaderno.

### R3. Reglas de negocio congeladas por el prototipo

Quien programe copiando la demo va a heredar descuento al entregar, sin reserva, cierre del pedido en la primera entrega, rechazo, devoluciones, programas no confirmados, motivos de llamada y una cuenta compartida por centro. El doc 04 existe precisamente para elegir eso después de la demo.

### R4. La base común puede mezclar información que el propio doc 01 manda separar

El mapa dice que la base es compartida y que la información no se mezcla. El historial del paciente tiene que quedar separado de inventario y presentismo. En el prototipo todo es un solo objeto JSON. Un modelo único sin permisos por dato, o un supervisor que «ve todo» también en pacientes, contradice ese límite en el momento en que haya datos reales.

### R5. Respaldos, pruebas y despliegue quedan tarde

El doc 02 deja las copias de seguridad automáticas y la prueba de restauración para la fase 7, después de los cuatro módulos. No hay migraciones, pruebas de permisos ni entorno definido. Un piloto de stock, aunque no tenga datos clínicos, ya es el registro de pedidos y entregas: si se pierde, el cuaderno en paralelo salva la operación solo si el piloto no reemplazó el cuaderno. El plan dice piloto en paralelo. Esa condición hay que sostenerla.

El corte de internet deja una aplicación web inutilizable. **Dijeron** que el corte es poco frecuente y no está garantizado. El modo sin conexión sigue siendo una evaluación posterior, con el riesgo de conflictos que el doc 01 ya señala. Abrir el HTML sin internet no demuestra ese modo.

### R6. Expectativa de la foto y del historial de asistencia

El problema que Luis describió es revisar fotos y detectar quién no envió. El prototipo anota que la foto llegó y transcribe el estado. La foto sigue afuera. El historial de días anteriores parece real en la pantalla y no lo es. Validar esa pantalla sin aclararlo puede dar por aceptada una función distinta de la que se puede construir en la primera versión.

### R7. Alcance que se cuela por los nombres

Integrar SUMAR, mandar WhatsApp, guardar historias clínicas de pacientes o conectar las impresoras no está pedido como sistema. WhatsApp aparece solo en la pregunta de cómo avisa Luis hoy, y en observaciones ficticias de la demo. Construir esa integración sería una necesidad nueva.

---

## 6. Decisiones antes de programar

Ninguna casilla del doc 04 está resuelta. Esta tabla separa lo que bloquea cualquier código de aplicación, lo que bloquea el inventario y lo que puede esperar a su módulo.

### Bloquean el inicio del desarrollo

| # | Decisión | Estado | Nota |
|---|---|---|---|
| D1 | Qué módulo se usa primero en un piloto | **Pendiente.** Los docs recomiendan presentismo. Esta auditoría propone inventario. Los empleados no eligieron. | Se cierra en la demo, no en el repo. |
| D2 | Cuentas: una por persona, con más de un módulo solo si un supervisor lo autoriza; o una cuenta compartida | **Pendiente.** La opción recomendada en el doc 04 es la cuenta personal. La demo del centro es una cuenta compartida. | Hace falta saber quiénes entran de verdad, quién supervisa y si stock y call center son el mismo puesto. |
| D3 | Dónde se aloja, con qué base, cómo se respalda y cómo se restaura | **Pendiente.** Las cuatro líneas técnicas del doc 04 están vacías. | **Propuesta de esta auditoría:** definirlo antes del piloto y probar una restauración con datos ficticios. El modo sin conexión no entra en esa decisión. |
| D4 | Con qué datos se prueba | **Pendiente.** El doc 04 recomienda ficticios para empezar. | Mientras no haya autorización, ficticios en el sistema de prueba y ninguno real en el repositorio. |
| D5 | Alcance de la primera versión usable | **Pendiente.** | **Propuesta de esta auditoría:** la base mínima más un solo módulo. El prototipo visual ya cumple el tercer ítem del doc 04 y no reemplaza esa versión. |

### Bloquean el módulo de inventario, y no hace falta resolver el call center para eso

| # | Decisión | Qué pasa si se programa igual |
|---|---|---|
| D6 | El centro pide y el encargado confirma la entrega; el pedido descuenta al aprobarlo; o se reserva al aprobar y se descuenta al entregar | Se copia la demo (descuento al entregar, sin reserva) sin que nadie la haya elegido. |
| D7 | Entrega parcial: ¿cierra el pedido o queda un pendiente? ¿Existe el rechazo? | La demo cierra el pedido y permite rechazar. |
| D8 | ¿El pedido que supera el stock se bloquea o solo se avisa? | La demo avisa y deja enviarlo. |
| D9 | ¿Hay devoluciones? | La demo ya las registra. La pregunta del doc 04 sigue abierta. |
| D10 | ¿El centro pide desde una computadora o el encargado sigue cargando lo que llega por teléfono o mensaje? | Cambia si hacen falta 23 accesos de centro o una sola pantalla de carga. |
| D11 | Lista inicial de formularios y existencias, dicha por quien lleva el cuaderno | La demo tiene siete formularios ficticios. Alcanza para mostrar. No alcanza para un piloto. |
| D12 | Si la firma en papel sigue siendo el comprobante | Está propuesto y mostrado. Conviene una confirmación explícita en la demo. |

### Pueden esperar a su propio módulo

| Módulo | Decisiones que no bloquean el inventario |
|---|---|
| Presentismo | Hora límite, si la foto se guarda, quién la carga, canal de aviso, nómina real de administrativos por centro. |
| Documentación | Programas además de SUMAR, frecuencia y formularios de cada uno. |
| Pacientes | Fuente, autorización, qué ve cada rol, preguntas de la llamada, cantidad de operadores, relación familiar estructurada o solo teléfono compartido, obra social como dato. |
| Después de los pilotos | Integración SUMAR, reportes que nadie pidió todavía, modo sin conexión. |

**Propuesta de esta auditoría.** D5, escrito de forma operativa: la primera especificación para programar incluye identidad, centros, permisos, auditoría y el circuito de inventario. No incluye tablas de pacientes, prestaciones ni llamadas. Así la base común no arrastra datos de salud «por si después hacen falta».

---

## 7. Dependencias entre módulos

```
Cuentas, permisos, centros y auditoría
        │
        ├── Inventario y pedidos
        │     materiales, pedidos, entregas, movimientos
        │     no lee presentismo ni pacientes
        │
        ├── Presentismo
        │     personal administrativo del centro, planilla del día, novedades
        │     no lee stock ni pacientes
        │
        ├── Documentación de programas
        │     programa, período, recepción
        │     comparte el centro con los otros dos
        │     no es el presentismo ni el padrón de pacientes
        │
        └── Pacientes y call center
              identidad, teléfonos, atenciones, llamadas
              el centro solo se cita como lugar de atención
              depende de autorización y de una fuente
              no comparte permisos con stock
```

**Hecho, según la documentación y el prototipo.**

- Los cuatro módulos dependen de una base que todavía no existe: cuentas, permisos, el padrón de 23 centros y un registro de actividad que no viva en el navegador.
- Inventario no necesita presentismo, documentación ni pacientes para un piloto.
- Presentismo no necesita el stock. Necesita el personal administrativo de cada centro, que no es lo mismo que los usuarios que inician sesión.
- Documentación comparte con presentismo al usuario de administración y al centro. El doc 01 pide tratarlos como procesos distintos. No depende de las novedades de asistencia.
- El call center cita al centro en la atención. No necesita el stock ni la planilla diaria. Sí necesita una fuente de pacientes y permiso para verla.
- SUMAR no es una dependencia del inventario. Es un nombre que hoy aparece en documentación, en un formulario y en el criterio de obra social. Conectarlo es una fase posterior y puede no ocurrir.
- La firma en papel y el canal actual de fotos o de mensajes quedan afuera del sistema hasta que alguien pida lo contrario y se decida.

**Propuesta de esta auditoría.** El padrón de centros se carga una vez y lo reutilizan inventario, presentismo y documentación. Los usuarios de un centro, en la primera versión, solo existen si D10 confirma que el centro carga el pedido. No crear 23 cuentas «por las dudas» si van a seguir pidiendo por teléfono y el encargado va a registrar el pedido.

---

## 8. Plan recomendado para las fases siguientes

El calendario en semanas del doc 02 queda como referencia del equipo. Esta revisión no le asigna otra duración. El cambio propuesto es el orden y la condición de salida de cada fase. Inventario va primero. Los demás módulos siguen.

**Propuesta de esta auditoría.** Distinto del orden por defecto de los docs 01, 02 y 03, y alineado con la salvedad que esos docs ya dejan: intercambiar presentismo e inventario si el stock es lo más urgente. Falta que los empleados confirmen esa urgencia (D1).

### Fase A — Demo y decisiones

Salida: doc 04 con las casillas D1 a D12 que correspondan, motivo escrito y devoluciones en la tabla del guion. Sin eso no hay especificación para programar.

En la reunión conviene decir, con el prototipo abierto:

- los datos son ficticios y viven en esa computadora;
- que el archivo abra sin internet no es el modo sin conexión;
- la foto de la planilla no está, y un día anterior no es el archivo real de ese día;
- la regla de stock que se ve es una opción para discutir, no la regla ya elegida.

### Fase B — Base mínima, todavía sin pacientes

Salida: una persona entra con cuenta propia; otra no ve el módulo que no tiene; los 23 centros existen como dato; las acciones del inventario de prueba quedan registradas; hay un respaldo y una restauración probados con datos ficticios.

Incluye el alta de centros y de usuarios que el piloto necesite. No incluye padrón de pacientes, prestaciones ni llamadas.

### Fase C — Inventario y pedidos, primer piloto

Salida: un circuito real en paralelo al cuaderno, con la firma en papel si D12 se confirma, el catálogo que dicte quien lleva el stock y la regla D6–D10 ya elegida.

Pantallas, en el orden en que el doc 01 ya las propuso: pedido con aviso de stock, panel del encargado, entrega que actualiza existencias, historial por centro. El consumo comparativo puede esperar a que pidan el criterio; el 1,6 del prototipo no se traslada solo.

El piloto no apaga el cuaderno. Los otros módulos no se construyen en este mismo tramo.

### Fase D — Presentismo

Después del piloto de stock, salvo que la demo invierta D1 con un motivo de Luis.

Salida: el día en curso de los 23 centros, novedades y centros sin planilla, con la hora límite y el canal de aviso ya respondidos. El historial de días anteriores se construye con lo que el sistema haya guardado desde el piloto, no con datos generados.

La foto se incluye en esta fase solo si se decide quién la sube, quién la ve y cuánto se conserva. Si no, la primera versión registra la recepción y el estado, y la foto sigue llegando por el canal actual.

### Fase E — Documentación de programas

Proceso separado del presentismo, como pide el doc 01. Empieza por los programas que Luis nombre. SUMAR entra si confirma frecuencia y formularios. No se agregan Materno Infantil ni Inmunizaciones por estar en la demo.

### Fase F — Pacientes y call center

Condición de entrada: fuente identificada, autorización del área responsable, qué campos ve cada rol, registro de las consultas, y un entorno distinto del repositorio y de la demo. Recién ahí tienen sentido el buscador, la ficha de una sola vista, el teléfono compartido y el «volver a llamar».

La cantidad de operadores y el texto de la llamada salen de las respuestas que hoy están vacías. Hasta entonces, Marcos, los motivos fijos y las prestaciones ficticias no son especificación.

### Fase G — Después de los pilotos

Evaluar integración con SUMAR, reportes nuevos que los pilotos hayan pedido, y modo sin conexión. Cada uno entra si alguien lo confirma. No forman parte de la especificación inicial.

### Qué no hacer en ninguna de estas fases

- Programar sobre datos reales de pacientes.
- Publicar la demo como aplicación del municipio.
- Dar por elegidas las reglas que solo viven en `demo/app.js`.
- Unir stock y call center en el mismo permiso porque la demo los muestra juntos.
- Reemplazar de una vez la planilla o el cuaderno.

---

## 9. Cierre

### Cinco riesgos más importantes

1. **El prototipo no autentica, no comparte datos y se borra.** Un parámetro en la dirección elige el rol. El estado está en el navegador y se regenera al día siguiente. No sirve como registro ni como prueba de varios operadores.
2. **Los datos de pacientes, incluidos familiares menores en el caso que contaron, no tienen autorización ni separación real.** En la demo comparten almacén con el stock, supervisión los ve y abrir una ficha no queda registrada. Cargar datos reales en ese esquema los expone.
3. **La demo ya ejecuta reglas que nadie eligió:** descuento al entregar, sin reserva, pedido que supera el stock, cierre en la entrega parcial, devoluciones, programas y motivos de llamada. Programar desde el prototipo congela esas reglas.
4. **Presentismo parece más resuelto de lo que está.** La foto no existe en el sistema y el día anterior es aleatorio. El guion pide mostrar una asistencia histórica que el prototipo no guarda.
5. **No hay base, migraciones, pruebas, respaldo ni control para evitar archivos reales en el repo.** El plan deja la prueba de restauración para el final, después de haber cargado módulos de más.

### Cinco decisiones para resolver primero

1. **D1.** Qué módulo se pilota primero, dicho por los empleados. Esta auditoría propone inventario y pedidos, y mantiene presentismo, documentación y call center en la cola. La casilla del doc 04 sigue vacía.
2. **D2.** Cuentas personales y permisos, quién es el supervisor, y si stock y call center son el mismo puesto o dos.
3. **D6, D8 y D10.** Cuándo baja el stock, si un pedido sin existencia se puede enviar, y si el centro lo carga en una computadora o el encargado sigue anotando el llamado.
4. **D3 y D4.** Alojamiento, base de datos, copia de seguridad con una restauración probada, y datos ficticios hasta una autorización expresa.
5. **D5, escrita como límite.** La primera especificación no incluye pacientes. Fuente, autorización y quién puede ver datos de salud se resuelven antes de ese módulo, no mientras se arma la base del inventario.

Con esas cinco respuestas se puede escribir la especificación del doc 01, sección 10. Sin ellas, programar agrega un sistema al costado de las planillas y del cuaderno, con reglas que la demo todavía no validó.
