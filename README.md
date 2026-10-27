# Plataforma de Gestión Administrativa — Centros CAC

Proyecto para centralizar la información administrativa de los centros de atención comunitaria (CAC): presentismo, documentación de programas, stock de fotocopias y call center de pacientes.

Por ahora el proyecto está en **etapa de definición**: todavía no hay código. Primero acordamos entre los tres cómo tiene que funcionar, armamos un prototipo para mostrarle a los dos departamentos y recién después preparamos el prompt/especificación para Cursor.

## Equipo

| Rol | Quién | Foco principal |
|---|---|---|
| Coordinación + Base técnica | Vos | Base de datos, usuarios/permisos, decisiones, integración |
| Interfaz + Prototipo | Compa 1 | Pantallas, prototipo visual, diseño adaptable |
| Relevamiento + Datos + Pruebas | Compa 2 | Contacto con Luis y la empleada del call center/stock, datos ficticios, pruebas |

> Reemplacen "Compa 1" y "Compa 2" por los nombres reales en todos los documentos.

## Documentos

1. [Documentación funcional](docs/01-documentacion-funcional.md): qué necesita cada empleado y qué proponemos construir.
2. [Plan de trabajo](docs/02-plan-de-trabajo.md): fases, tareas por persona y cronograma.
3. [Mapa conceptual del avance](docs/03-mapa-conceptual.md): cómo se conectan los módulos y en qué orden avanzamos.
4. [Decisiones pendientes](docs/04-decisiones.md): lo que tenemos que definir antes de armar el prompt para Cursor.
5. [Guion de la demo](docs/05-guion-demo.md): cómo presentarle el prototipo a los dos departamentos.

Para presentar en pantalla: abrir [`mapa-conceptual.html`](mapa-conceptual.html) con doble clic (funciona sin internet).

## Demo navegable

Abrir [`demo/index.html`](demo/index.html) con doble clic (no necesita internet ni instalar nada). Tiene datos ficticios y se elige con qué usuario entrar:

| Usuario | Qué muestra |
|---|---|
| Luis Martínez (Administración) | Panel de presentismo de los 23 centros y documentación de programas |
| Carla Ríos (Call center y stock) | Pedidos, inventario, movimientos, consumo por centro y call center |
| Marcos Paz (Operador) | Solo call center |
| CAC 5 (Centro) | Pedido de materiales viendo el stock disponible |
| Supervisión | Todo, más usuarios/permisos y registro de actividad |

Links directos para la presentación: `demo/index.html?usuario=luis&vista=presentismo`, `?usuario=carla&vista=stock`, `?usuario=carla&vista=callcenter&paciente=1`, `?usuario=cac5&vista=pedidos`.

Los cambios se guardan en el navegador; el botón "Reiniciar datos" (arriba) vuelve todo al estado inicial. Capturas en [`demo/capturas/`](demo/capturas/).
