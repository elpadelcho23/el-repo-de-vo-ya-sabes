// Datos ficticios para la demo. Ningún nombre, DNI ni teléfono corresponde a personas reales.

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

function isoDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function sumarDias(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function seeded(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function lunesDe(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x;
}

function periodosDe(programa, hoy = new Date()) {
  if (programa.frecuencia === 'semanal') {
    const lunes = lunesDe(hoy);
    return [0, 1, 2, 3].map(i => {
      const d = sumarDias(lunes, -7 * i);
      return { key: isoDate(d), label: `Semana del ${d.getDate()}/${d.getMonth() + 1}${i === 0 ? ' (actual)' : ''}` };
    });
  }
  return [0, 1, 2].map(i => {
    const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
    const mes = MESES[d.getMonth()];
    return {
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: `${mes[0].toUpperCase()}${mes.slice(1)} ${d.getFullYear()}${i === 0 ? ' (actual)' : ''}`,
    };
  });
}

function historialDia(fechaISO) {
  const r = seeded(parseInt(fechaISO.replace(/-/g, ''), 10));
  const res = {};
  for (let id = 1; id <= 23; id++) {
    const sinPlanilla = r() < 0.04;
    res[id] = {
      estado: sinPlanilla ? 'pendiente' : 'completo',
      hora: sinPlanilla ? null : `07:${String(5 + Math.floor(r() * 54)).padStart(2, '0')}`,
      novedades: r() < 0.25 ? 1 : 0,
    };
  }
  return res;
}

function crearDatosIniciales() {
  const r = seeded(20261020);
  const ent = (a, b) => a + Math.floor(r() * (b - a + 1));
  const pick = arr => arr[Math.floor(r() * arr.length)];
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const BARRIOS = ['Villa Nueva', 'San Martín', 'Los Álamos', 'El Progreso', 'Santa Rosa', 'La Esperanza', 'Belgrano', 'San José',
    'Las Flores', 'Villa del Parque', 'El Mirador', 'Los Pinos', 'San Cayetano', 'La Ribera', 'Barrio Norte', 'Altos del Sur',
    'Las Heras', 'San Vicente', 'El Bosque', 'Villa Elena', 'La Loma', 'Los Sauces', 'Santa Lucía'];

  const centros = BARRIOS.map((barrio, i) => ({
    id: i + 1,
    nombre: `CAC ${i + 1}`,
    barrio,
    contacto: `11-${4100 + i * 37}-${String(1000 + i * 271).slice(-4)}`,
  }));

  const NOMBRES = ['Ana', 'Beatriz', 'Carlos', 'Daniela', 'Esteban', 'Florencia', 'Gabriel', 'Hernán', 'Inés', 'Julieta',
    'Lorena', 'Matías', 'Natalia', 'Oscar', 'Paula', 'Ramiro', 'Silvia', 'Tomás', 'Valeria', 'Walter'];
  const APELLIDOS = ['Acosta', 'Benítez', 'Cabrera', 'Díaz', 'Escobar', 'Ferreyra', 'García', 'Herrera', 'Ibáñez', 'Juárez',
    'López', 'Medina', 'Núñez', 'Ortiz', 'Paz', 'Quiroga', 'Romero', 'Sosa', 'Torres', 'Vega'];

  const empleados = [];
  let eid = 1;
  centros.forEach(c => {
    const n = ent(1, 3);
    for (let k = 0; k < n; k++) {
      empleados.push({ id: eid++, centroId: c.id, nombre: `${pick(NOMBRES)} ${pick(APELLIDOS)}`, puesto: k === 0 ? 'Administrativo/a' : 'Recepción' });
    }
  });

  const SIN_PLANILLA = [4, 11, 17, 22];
  const CON_NOVEDAD = [2, 9, 15];
  const asistencia = {};
  const fotos = {};
  centros.forEach(c => {
    const emps = empleados.filter(e => e.centroId === c.id);
    if (SIN_PLANILLA.includes(c.id)) {
      emps.forEach(e => { asistencia[e.id] = { estado: 'sin_dato', nota: '' }; });
      fotos[c.id] = null;
      return;
    }
    let novedad = false;
    emps.forEach(e => {
      const x = r();
      let estado = 'presente';
      let nota = '';
      if (x < 0.06) { estado = 'ausente'; nota = 'Avisó por WhatsApp: enfermedad'; }
      else if (x < 0.1) { estado = 'licencia'; nota = 'Licencia anual hasta el viernes'; }
      if (estado !== 'presente') novedad = true;
      asistencia[e.id] = { estado, nota };
    });
    if (CON_NOVEDAD.includes(c.id) && !novedad) {
      asistencia[emps[0].id] = { estado: 'demora', nota: 'Llega 9:30 por un trámite' };
      novedad = true;
    }
    fotos[c.id] = { hora: `${r() < 0.2 ? '08' : '07'}:${String(ent(5, 58)).padStart(2, '0')}`, revisado: !novedad };
  });

  const programas = [
    { id: 'sumar', nombre: 'SUMAR', frecuencia: 'semanal', documentos: ['Planilla de prestaciones', 'Fichas de inscripción'] },
    { id: 'materno', nombre: 'Materno Infantil', frecuencia: 'mensual', documentos: ['Planilla de controles', 'Registro de entrega de leche'] },
    { id: 'inmunizaciones', nombre: 'Inmunizaciones', frecuencia: 'mensual', documentos: ['Planilla de vacunas aplicadas'] },
  ];

  const presentaciones = {};
  programas.forEach(p => {
    periodosDe(p, hoy).forEach((per, idx) => {
      centros.forEach(c => {
        if (r() < (idx === 0 ? 0.55 : 0.93)) {
          const base = p.frecuencia === 'semanal' ? new Date(`${per.key}T00:00`) : new Date(`${per.key}-01T00:00`);
          let f = sumarDias(base, ent(0, p.frecuencia === 'semanal' ? 4 : 12));
          if (f > hoy) f = hoy;
          presentaciones[`${p.id}|${per.key}|${c.id}`] = isoDate(f);
        }
      });
    });
  });

  const materiales = [
    { id: 1, nombre: 'Historia clínica', stock: 5000, minimo: 1000 },
    { id: 2, nombre: 'Ficha de inscripción SUMAR', stock: 1200, minimo: 500 },
    { id: 3, nombre: 'Planilla de asistencia diaria', stock: 800, minimo: 300 },
    { id: 4, nombre: 'Carnet de vacunación', stock: 150, minimo: 200 },
    { id: 5, nombre: 'Consentimiento informado', stock: 2300, minimo: 400 },
    { id: 6, nombre: 'Hoja de ingreso mensual', stock: 0, minimo: 300 },
    { id: 7, nombre: 'Planilla de controles Materno Infantil', stock: 650, minimo: 200 },
  ];

  const pedidos = [];
  const movimientos = [];
  let nextId = 1000;

  const entregas = [];
  for (let i = 0; i < 70; i++) {
    const centroId = r() < 0.18 ? 14 : ent(1, 23);
    const materialId = pick([1, 1, 2, 3, 4, 5, 6, 7]);
    let cantidad = ent(3, 15) * 10;
    if (centroId === 14) cantidad *= 2;
    entregas.push({ fecha: isoDate(sumarDias(hoy, -ent(3, 88))), centroId, materialId, cantidad });
  }
  entregas.push({ fecha: isoDate(sumarDias(hoy, -20)), centroId: 5, materialId: 1, cantidad: 150 });
  entregas.push({ fecha: isoDate(sumarDias(hoy, -9)), centroId: 5, materialId: 3, cantidad: 60 });
  entregas.sort((a, b) => a.fecha.localeCompare(b.fecha));

  materiales.forEach(m => {
    const usado = entregas.filter(e => e.materialId === m.id).reduce((s, e) => s + e.cantidad, 0);
    movimientos.push({
      fecha: `${isoDate(sumarDias(hoy, -95))}T09:00`, tipo: 'ingreso', materialId: m.id, cantidad: m.stock + usado,
      centroId: null, usuario: 'Carla Ríos', detalle: 'Carga inicial de existencias',
    });
  });

  entregas.forEach(e => {
    const id = ++nextId;
    pedidos.push({
      id, centroId: e.centroId, fecha: e.fecha, estado: 'entregado', solicitante: `Centro ${e.centroId}`,
      items: [{ materialId: e.materialId, cantidad: e.cantidad, entregado: e.cantidad }], fechaEntrega: e.fecha,
    });
    movimientos.push({
      fecha: `${e.fecha}T11:00`, tipo: 'entrega', materialId: e.materialId, cantidad: e.cantidad,
      centroId: e.centroId, usuario: 'Carla Ríos', detalle: `Pedido #${id}`,
    });
  });

  const pendientes = [
    { centroId: 3, dias: 1, estado: 'pendiente', items: [[1, 200], [3, 50]] },
    { centroId: 8, dias: 1, estado: 'pendiente', items: [[4, 300]] },
    { centroId: 12, dias: 0, estado: 'pendiente', items: [[6, 100], [5, 50]] },
    { centroId: 14, dias: 0, estado: 'pendiente', items: [[1, 400], [2, 200]] },
    { centroId: 5, dias: 2, estado: 'en_preparacion', items: [[2, 100]] },
  ];
  pendientes.forEach(p => {
    pedidos.push({
      id: ++nextId, centroId: p.centroId, fecha: isoDate(sumarDias(hoy, -p.dias)), estado: p.estado,
      solicitante: `Centro ${p.centroId}`, items: p.items.map(([materialId, cantidad]) => ({ materialId, cantidad })),
    });
  });

  const pacientes = [
    { id: 1, nombre: 'Mariela', apellido: 'Gómez', dni: '30.456.789', nacimiento: '1991-03-14', obraSocial: 'Sin obra social', telefonos: ['11-4567-8901'], direccion: 'Calle 12 N° 345', centroId: 7, vinculo: 'Madre de Tiago, Luz y Benjamín' },
    { id: 2, nombre: 'Tiago', apellido: 'Fernández', dni: '52.345.678', nacimiento: '2016-05-02', obraSocial: 'Sin obra social', telefonos: ['11-4567-8901'], direccion: 'Calle 12 N° 345', centroId: 7, vinculo: 'Hijo de Mariela Gómez' },
    { id: 3, nombre: 'Luz', apellido: 'Fernández', dni: '54.876.123', nacimiento: '2019-08-21', obraSocial: 'Sin obra social', telefonos: ['11-4567-8901'], direccion: 'Calle 12 N° 345', centroId: 7, vinculo: 'Hija de Mariela Gómez' },
    { id: 4, nombre: 'Benjamín', apellido: 'Gómez', dni: '57.012.345', nacimiento: '2023-01-10', obraSocial: 'Sin obra social', telefonos: ['11-4567-8901'], direccion: 'Calle 12 N° 345', centroId: 7, vinculo: 'Hijo de Mariela Gómez' },
    { id: 5, nombre: 'Rosa', apellido: 'Benítez', dni: '12.345.678', nacimiento: '1952-11-30', obraSocial: 'PAMI', telefonos: ['11-4321-0987', '11-6543-2109'], direccion: 'Av. San Martín 1200', centroId: 3, vinculo: 'Esposa de Hugo Benítez' },
    { id: 6, nombre: 'Hugo', apellido: 'Benítez', dni: '11.987.654', nacimiento: '1949-07-07', obraSocial: 'PAMI', telefonos: ['11-4321-0987'], direccion: 'Av. San Martín 1200', centroId: 3 },
    { id: 7, nombre: 'Camila', apellido: 'Sosa', dni: '40.123.456', nacimiento: '1997-02-18', obraSocial: 'Sin obra social', telefonos: ['11-5555-1234'], direccion: 'Pasaje Los Robles 45', centroId: 10 },
    { id: 8, nombre: 'Jorge', apellido: 'Ramírez', dni: '25.678.901', nacimiento: '1976-09-09', obraSocial: 'IOMA', telefonos: ['11-3333-4444'], direccion: 'Calle 5 N° 980', centroId: 12 },
    { id: 9, nombre: 'Agustina', apellido: 'Ramírez', dni: '45.234.567', nacimiento: '2003-12-01', obraSocial: 'IOMA', telefonos: ['11-3333-4444', '11-7777-8888'], direccion: 'Calle 5 N° 980', centroId: 12, vinculo: 'Hija de Jorge Ramírez' },
    { id: 10, nombre: 'Norma', apellido: 'Villalba', dni: '17.456.123', nacimiento: '1965-04-25', obraSocial: 'Sin obra social', telefonos: ['11-2222-9999'], direccion: 'Calle 30 N° 77', centroId: 18 },
    { id: 11, nombre: 'Lucas', apellido: 'Medina', dni: '38.765.432', nacimiento: '1994-06-15', obraSocial: 'OSECAC', telefonos: ['11-8888-1111'], direccion: 'Belgrano 450', centroId: 7 },
    { id: 12, nombre: 'Milagros', apellido: 'Ortiz', dni: '46.987.321', nacimiento: '2005-10-03', obraSocial: 'Sin obra social', telefonos: ['11-9999-0000'], direccion: 'Calle 8 N° 210', centroId: 21 },
    { id: 13, nombre: 'Ramón', apellido: 'Quiroga', dni: '20.111.222', nacimiento: '1968-01-19', obraSocial: 'PAMI', telefonos: ['11-1212-3434'], direccion: 'Mitre 1500', centroId: 1 },
    { id: 14, nombre: 'Sofía', apellido: 'Herrera', dni: '49.333.111', nacimiento: '2009-07-27', obraSocial: 'Sin obra social', telefonos: ['11-5656-7878'], direccion: 'Calle 22 N° 640', centroId: 16, vinculo: 'Hija de Paula Herrera' },
    { id: 15, nombre: 'Paula', apellido: 'Herrera', dni: '33.222.111', nacimiento: '1987-03-03', obraSocial: 'Sin obra social', telefonos: ['11-5656-7878'], direccion: 'Calle 22 N° 640', centroId: 16, vinculo: 'Madre de Sofía Herrera' },
  ];

  const PREST_NINO = ['Control niño sano', 'Vacunación', 'Odontología', 'Pediatría', 'Control de crecimiento'];
  const PREST_ADULTO = ['Consulta clínica', 'Control de presión', 'Laboratorio', 'Odontología', 'Vacunación', 'Control de diabetes'];
  const atenciones = [];
  pacientes.forEach(p => {
    const edad = hoy.getFullYear() - parseInt(p.nacimiento.slice(0, 4), 10);
    const lista = edad < 15 ? PREST_NINO : PREST_ADULTO;
    const n = ent(2, 6);
    for (let i = 0; i < n; i++) {
      atenciones.push({
        id: ++nextId, pacienteId: p.id, fecha: isoDate(sumarDias(hoy, -ent(5, 400))),
        centroId: r() < 0.85 ? p.centroId : ent(1, 23), prestacion: pick(lista),
      });
    }
  });
  atenciones.push({ id: ++nextId, pacienteId: 1, fecha: isoDate(sumarDias(hoy, -40)), centroId: 7, prestacion: 'Control ginecológico' });

  const llamadas = [
    { id: ++nextId, pacienteId: 2, fecha: `${isoDate(sumarDias(hoy, -5))}T10:15`, operador: 'Carla Ríos', motivo: 'Vacunación pendiente', resultado: 'No atendió', notas: '', volverLlamar: true, fechaVolver: isoDate(hoy), resuelta: false },
    { id: ++nextId, pacienteId: 6, fecha: `${isoDate(sumarDias(hoy, -2))}T11:40`, operador: 'Carla Ríos', motivo: 'Recordatorio de turno', resultado: 'Atendió', notas: 'Confirma el turno de control de presión.', volverLlamar: false, resuelta: false },
    { id: ++nextId, pacienteId: 12, fecha: `${isoDate(sumarDias(hoy, -1))}T09:05`, operador: 'Marcos Paz', motivo: 'Seguimiento', resultado: 'Ocupado', notas: '', volverLlamar: true, fechaVolver: isoDate(sumarDias(hoy, 1)), resuelta: false },
    { id: ++nextId, pacienteId: 10, fecha: `${isoDate(sumarDias(hoy, -3))}T12:30`, operador: 'Carla Ríos', motivo: 'Resultado de laboratorio', resultado: 'Dejó mensaje', notas: 'Le dejamos mensaje con la hija.', volverLlamar: true, fechaVolver: isoDate(hoy), resuelta: false },
  ];

  const usuarios = [
    { id: 'luis', nombre: 'Luis Martínez', rol: 'Administración', modulos: ['presentismo', 'documentacion'] },
    { id: 'carla', nombre: 'Carla Ríos', rol: 'Call center y stock', modulos: ['stock', 'callcenter'] },
    { id: 'marcos', nombre: 'Marcos Paz', rol: 'Operador de call center', modulos: ['callcenter'] },
    { id: 'cac5', nombre: 'CAC 5 — Santa Rosa', rol: 'Centro (pide materiales)', modulos: ['pedidos'], centroId: 5 },
    { id: 'super', nombre: 'Supervisión', rol: 'Supervisor del sistema', modulos: ['presentismo', 'documentacion', 'stock', 'callcenter', 'usuarios', 'auditoria'] },
  ];

  const ahora = new Date();
  const hace = min => new Date(ahora.getTime() - min * 60000).toISOString();
  const auditoria = [
    { fecha: hace(20), usuario: 'Carla Ríos', accion: 'Call center', detalle: 'Registró llamada a Hugo Benítez: Atendió' },
    { fecha: hace(55), usuario: 'Luis Martínez', accion: 'Presentismo', detalle: 'Marcó CAC 6 como revisado' },
    { fecha: hace(70), usuario: 'Luis Martínez', accion: 'Documentación', detalle: 'Registró recepción SUMAR de CAC 2' },
    { fecha: hace(95), usuario: 'Supervisión', accion: 'Permisos', detalle: 'Habilitó Call center a Marcos Paz' },
  ];

  return {
    fechaDatos: isoDate(hoy), centros, empleados, asistencia, fotos, programas, presentaciones, materiales,
    pedidos, movimientos, pacientes, atenciones, llamadas, usuarios, auditoria, nextId: nextId + 1,
  };
}
