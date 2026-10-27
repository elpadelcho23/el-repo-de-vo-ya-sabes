const STORE_KEY = 'demo-cac-v1';
const SESSION_KEY = 'demo-cac-usuario';
const HOY = isoDate(new Date());

const MODULOS = {
  inicio: { nombre: 'Inicio', color: '#8a96ab' },
  presentismo: { nombre: 'Presentismo', color: '#2f6fed' },
  documentacion: { nombre: 'Documentación', color: '#7a4fd6' },
  stock: { nombre: 'Stock y entregas', color: '#1f9d6b' },
  pedidos: { nombre: 'Pedir materiales', color: '#1f9d6b' },
  callcenter: { nombre: 'Call center', color: '#138a9e' },
  usuarios: { nombre: 'Usuarios y permisos', color: '#e0a106' },
  auditoria: { nombre: 'Registro de actividad', color: '#e0a106' },
};
const ORDEN_MODULOS = ['presentismo', 'documentacion', 'stock', 'pedidos', 'callcenter', 'usuarios', 'auditoria'];

const ESTADO_CENTRO = {
  completo: { txt: 'Completo', cls: 'ok' },
  revisar: { txt: 'A revisar', cls: 'warn' },
  pendiente: { txt: 'Sin planilla', cls: 'bad' },
};
const ESTADO_EMP = { sin_dato: 'Sin dato', presente: 'Presente', ausente: 'Ausente', demora: 'Demora', licencia: 'Licencia' };
const ESTADO_PEDIDO = {
  pendiente: { txt: 'Pendiente', cls: 'warn' },
  en_preparacion: { txt: 'En preparación', cls: 'info' },
  entregado: { txt: 'Entregado', cls: 'ok' },
  rechazado: { txt: 'Rechazado', cls: 'bad' },
};
const TIPO_MOV = {
  ingreso: { txt: 'Ingreso', cls: 'ok', signo: '+' },
  entrega: { txt: 'Entrega', cls: 'info', signo: '−' },
  devolucion: { txt: 'Devolución', cls: 'ok', signo: '+' },
  ajuste: { txt: 'Ajuste', cls: 'warn', signo: '±' },
};
const MOTIVOS_LLAMADA = ['Recordatorio de turno', 'Vacunación pendiente', 'Seguimiento', 'Resultado de laboratorio', 'Encuesta de atención'];
const RESULTADOS_LLAMADA = ['Atendió', 'No atendió', 'Ocupado', 'Dejó mensaje', 'Número equivocado'];

const params = new URLSearchParams(location.search);
let state = cargar();
let usuario = state.usuarios.find(u => u.id === (params.get('usuario') || sessionStorage.getItem(SESSION_KEY))) || null;
let vista = params.get('vista') || 'inicio';
const ui = {
  overlay: null,
  avisoCentro: null,
  presFiltro: 'todos',
  presBusqueda: '',
  presFecha: HOY,
  docProg: 'sumar',
  docPeriodo: null,
  docFiltro: 'todos',
  stockTab: 'pedidos',
  verEntregados: false,
  movMat: '',
  movCentro: '',
  carrito: {},
  ccQuery: '',
  ccObra: 'todos',
  ccPaciente: +params.get('paciente') || null,
  audUser: '',
};

// ---------- utilidades ----------

function cargar() {
  try {
    const s = JSON.parse(localStorage.getItem(STORE_KEY));
    if (s && s.fechaDatos === HOY) return s;
  } catch (e) { /* datos corruptos: se regeneran */ }
  const d = crearDatosIniciales();
  localStorage.setItem(STORE_KEY, JSON.stringify(d));
  return d;
}

function guardar() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function registrar(accion, detalle) {
  state.auditoria.unshift({ fecha: new Date().toISOString(), usuario: usuario.nombre, accion, detalle });
  guardar();
}

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = iso => { const [y, m, d] = iso.slice(0, 10).split('-'); return `${d}/${m}/${y}`; };
const fmtHora = ts => new Date(ts).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
const num = n => n.toLocaleString('es-AR');
const sinAcentos = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const digitos = s => s.replace(/\D/g, '');
const centro = id => state.centros.find(c => c.id === +id);
const material = id => state.materiales.find(m => m.id === +id);
const paciente = id => state.pacientes.find(p => p.id === +id);
const iniciales = n => n.split(/[\s—]+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
const ahoraHora = () => new Date().toTimeString().slice(0, 5);

function fechaLarga(iso) {
  const s = new Date(`${iso}T00:00`).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return s[0].toUpperCase() + s.slice(1);
}

function edad(nac) {
  const n = new Date(`${nac}T00:00`);
  const h = new Date();
  let e = h.getFullYear() - n.getFullYear();
  if (h < new Date(h.getFullYear(), n.getMonth(), n.getDate())) e--;
  return e;
}

let toastTimer;
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
}

function copiar(texto) {
  const fallback = () => {
    const ta = document.createElement('textarea');
    ta.value = texto;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    toast('Texto copiado');
  };
  if (navigator.clipboard) navigator.clipboard.writeText(texto).then(() => toast('Texto copiado'), fallback);
  else fallback();
}

const pill = (txt, cls) => `<span class="pill ${cls}">${esc(txt)}</span>`;

function panel(titulo, cuerpo, pie = '', ancho = '') {
  return `<div class="overlay" data-act="cerrar"><div class="panel ${ancho}" data-act="noop">
    <div class="panel-head"><h2>${titulo}</h2><button class="x" data-act="cerrar" aria-label="Cerrar">×</button></div>
    <div class="panel-body">${cuerpo}</div>
    <div class="panel-foot">${pie}<button class="btn ghost" data-act="cerrar">Cerrar</button></div>
  </div></div>`;
}

// ---------- cálculos ----------

function estadoCentro(c) {
  const f = state.fotos[c.id];
  if (!f) return 'pendiente';
  return f.revisado ? 'completo' : 'revisar';
}

function resumenPresentismo() {
  const r = { completo: 0, revisar: 0, pendiente: 0 };
  state.centros.forEach(c => r[estadoCentro(c)]++);
  return r;
}

function novedadesCentro(id) {
  return state.empleados.filter(e => e.centroId === id && ['ausente', 'demora', 'licencia'].includes(state.asistencia[e.id].estado)).length;
}

function docPendientes(prog) {
  const per = periodosDe(prog)[0].key;
  return state.centros.filter(c => !state.presentaciones[`${prog.id}|${per}|${c.id}`]).length;
}

function nivelStock(m) {
  if (m.stock === 0) return { txt: 'Sin stock', cls: 'bad' };
  if (m.stock < m.minimo) return { txt: 'Stock bajo', cls: 'warn' };
  return { txt: 'Disponible', cls: 'ok' };
}

function pedidosAbiertos() {
  return state.pedidos.filter(p => p.estado === 'pendiente' || p.estado === 'en_preparacion');
}

function consumoPorCentro(dias = 90) {
  const desde = isoDate(sumarDias(new Date(), -dias));
  const tot = {};
  state.centros.forEach(c => { tot[c.id] = 0; });
  state.movimientos.forEach(m => { if (m.tipo === 'entrega' && m.fecha >= desde) tot[m.centroId] += m.cantidad; });
  return tot;
}

function volverALlamar() {
  return state.llamadas.filter(l => l.volverLlamar && !l.resuelta).sort((a, b) => a.fechaVolver.localeCompare(b.fechaVolver));
}

function compartenTelefono(p) {
  const tels = p.telefonos.map(digitos);
  return state.pacientes.filter(o => o.id !== p.id && o.telefonos.some(t => tels.includes(digitos(t))));
}

function badgeNav(m) {
  let n = 0;
  if (m === 'presentismo') { const r = resumenPresentismo(); n = r.pendiente + r.revisar; }
  if (m === 'documentacion') n = state.programas.reduce((s, p) => s + docPendientes(p), 0);
  if (m === 'stock') n = pedidosAbiertos().length;
  if (m === 'callcenter') n = volverALlamar().filter(l => l.fechaVolver <= HOY).length;
  if (m === 'pedidos') n = pedidosAbiertos().filter(p => p.centroId === usuario.centroId).length;
  return n ? `<span class="badge">${n}</span>` : '';
}

// ---------- render principal ----------

function render() {
  const app = document.getElementById('app');
  if (!usuario) { app.innerHTML = vistaLogin(); return; }
  if (vista !== 'inicio' && !usuario.modulos.includes(vista)) vista = 'inicio';
  const nav = ['inicio', ...ORDEN_MODULOS.filter(m => usuario.modulos.includes(m))];
  app.innerHTML = `
    <div class="banner">Demo con datos ficticios · los cambios se guardan solo en este navegador · <button class="link" data-act="reset">Reiniciar datos</button></div>
    <div class="shell">
      <aside class="side">
        <div class="brand">Gestión CAC<small>Plataforma administrativa</small></div>
        <nav>${nav.map(m => `<button class="nav-item ${vista === m ? 'active' : ''}" data-act="ir" data-vista="${m}">
          <span class="dot" style="background:${MODULOS[m].color}"></span><span class="nav-txt">${MODULOS[m].nombre}</span>${badgeNav(m)}</button>`).join('')}</nav>
        <div class="me"><div class="avatar">${iniciales(usuario.nombre)}</div>
          <div class="me-txt"><b>${esc(usuario.nombre)}</b><small>${esc(usuario.rol)}</small></div>
          <button class="btn small dark" data-act="logout">Cambiar usuario</button></div>
      </aside>
      <main class="main">${VISTAS[vista]()}</main>
    </div>
    ${renderOverlay()}`;
}

function renderOverlay() {
  const o = ui.overlay;
  if (!o) return '';
  if (o.tipo === 'centro') return overlayCentro(o.id);
  if (o.tipo === 'entrega') return overlayEntrega(o.id);
  if (o.tipo === 'movimiento') return overlayMovimiento(o.id, o.mov);
  if (o.tipo === 'nuevoMaterial') return overlayNuevoMaterial();
  if (o.tipo === 'confirmPedido') return overlayConfirmPedido();
  return '';
}

// ---------- login ----------

function vistaLogin() {
  return `<div class="login"><div class="login-box">
    <div class="login-brand">Gestión CAC</div>
    <p class="muted">Plataforma administrativa de los centros de atención comunitaria</p>
    <div class="fake-form">
      <label>Usuario<input disabled placeholder="usuario personal"></label>
      <label>Contraseña<input disabled type="password" placeholder="••••••••"></label>
    </div>
    <p class="hint">En la versión real cada empleado entra con su usuario y contraseña. En esta demo elegí con quién entrar para ver qué ve cada uno:</p>
    <div class="login-users">${state.usuarios.map(u => `
      <button class="login-user" data-act="login" data-id="${u.id}">
        <div class="avatar">${iniciales(u.nombre)}</div>
        <div><b>${esc(u.nombre)}</b><small>${esc(u.rol)}</small>
        <div class="mods">${u.modulos.map(m => `<span class="tag">${MODULOS[m].nombre}</span>`).join('')}</div></div>
      </button>`).join('')}</div>
    <p class="foot">Demo con datos ficticios · ningún dato corresponde a personas reales</p>
  </div></div>`;
}

// ---------- inicio ----------

function kpi(titulo, valor, sub, destino, cls = '') {
  return `<button class="kpi ${cls}" data-act="ir" data-vista="${destino}"><span class="kpi-t">${titulo}</span><span class="kpi-v">${valor}</span><span class="kpi-s">${sub}</span></button>`;
}

function vistaInicio() {
  const m = usuario.modulos;
  const cards = [];
  const avisos = [];
  if (m.includes('presentismo')) {
    const r = resumenPresentismo();
    cards.push(kpi('Presentismo de hoy', `${r.completo}/${state.centros.length}`, 'centros completos', 'presentismo'));
    if (r.pendiente) avisos.push({ cls: 'bad', txt: `${r.pendiente} centros todavía no enviaron la planilla de asistencia`, ir: 'presentismo' });
    if (r.revisar) avisos.push({ cls: 'warn', txt: `${r.revisar} centros tienen novedades para revisar`, ir: 'presentismo' });
  }
  if (m.includes('documentacion')) {
    const tot = state.programas.reduce((s, p) => s + docPendientes(p), 0);
    cards.push(kpi('Documentación pendiente', tot, 'entregas en el período actual', 'documentacion'));
    state.programas.forEach(p => {
      const n = docPendientes(p);
      if (n) avisos.push({ cls: 'warn', txt: `${p.nombre}: ${n} centros sin entregar (${periodosDe(p)[0].label.replace(' (actual)', '')})`, ir: 'documentacion' });
    });
  }
  if (m.includes('stock')) {
    const abiertos = pedidosAbiertos().length;
    cards.push(kpi('Pedidos por atender', abiertos, 'pendientes o en preparación', 'stock'));
    state.materiales.filter(x => x.stock < x.minimo).forEach(x => {
      avisos.push({ cls: x.stock === 0 ? 'bad' : 'warn', txt: `${x.nombre}: ${x.stock === 0 ? 'sin stock' : `quedan ${num(x.stock)} (mínimo ${num(x.minimo)})`}`, ir: 'stock' });
    });
  }
  if (m.includes('pedidos')) {
    const mios = pedidosAbiertos().filter(p => p.centroId === usuario.centroId).length;
    cards.push(kpi('Mis pedidos en curso', mios, 'esperando entrega', 'pedidos'));
    state.materiales.filter(x => x.stock === 0).forEach(x => avisos.push({ cls: 'bad', txt: `${x.nombre}: sin stock por el momento`, ir: 'pedidos' }));
  }
  if (m.includes('callcenter')) {
    const vl = volverALlamar().filter(l => l.fechaVolver <= HOY).length;
    cards.push(kpi('Volver a llamar hoy', vl, 'pacientes', 'callcenter'));
    if (vl) avisos.push({ cls: 'info', txt: `${vl} pacientes para volver a llamar hoy`, ir: 'callcenter' });
  }
  if (m.includes('usuarios')) cards.push(kpi('Usuarios', state.usuarios.length, 'cuentas activas', 'usuarios'));

  return `
    <div class="page-head"><div><h1>Hola, ${esc(usuario.nombre.split(' ')[0])}</h1><p class="muted">${fechaLarga(HOY)}</p></div></div>
    <div class="kpis">${cards.join('')}</div>
    <div class="card">
      <h2>Avisos</h2>
      ${avisos.length ? `<ul class="avisos">${avisos.map(a => `<li class="${a.cls}"><span>${esc(a.txt)}</span><button class="btn small ghost" data-act="ir" data-vista="${a.ir}">Ver</button></li>`).join('')}</ul>`
        : '<p class="muted">No hay avisos pendientes.</p>'}
    </div>
    <p class="muted small-note">Cada usuario ve solo los módulos que tiene habilitados. Probá "Cambiar usuario" para ver la pantalla de otro puesto.</p>`;
}

// ---------- presentismo ----------

function stat(titulo, valor, cls, filtro) {
  return `<button class="stat ${cls} ${ui.presFiltro === filtro ? 'active' : ''}" data-act="presFiltro" data-f="${filtro}"><span>${titulo}</span><b>${valor}</b></button>`;
}

function vistaPresentismo() {
  const esHoy = ui.presFecha === HOY;
  const r = resumenPresentismo();
  return `
    <div class="page-head">
      <div><h1>Presentismo</h1><p class="muted">${fechaLarga(ui.presFecha)} · planillas de asistencia del personal administrativo</p></div>
      <label class="field-inline">Día <input type="date" value="${ui.presFecha}" max="${HOY}" data-change="presFecha"></label>
    </div>
    ${esHoy ? `<div class="stats">
        ${stat('Completos', r.completo, 'ok', 'completo')}${stat('A revisar', r.revisar, 'warn', 'revisar')}
        ${stat('Sin planilla', r.pendiente, 'bad', 'pendiente')}${stat('Todos los centros', state.centros.length, 'neutral', 'todos')}
      </div>`
      : `<div class="notice">Estás viendo un día anterior (solo lectura). <button class="link" data-act="presHoy">Volver a hoy</button></div>`}
    <div class="toolbar">
      <input class="search" placeholder="Buscar centro, barrio o empleado…" value="${esc(ui.presBusqueda)}" data-input="presBusqueda">
    </div>
    <div id="pres-grid" class="center-grid">${gridPresentismo()}</div>
    ${esHoy ? '<p class="muted small-note">Tocá un centro para ver su planilla, cargar novedades o preparar un aviso.</p>' : ''}`;
}

function gridPresentismo() {
  const q = sinAcentos(ui.presBusqueda.trim());
  const esHoy = ui.presFecha === HOY;
  const hist = esHoy ? null : historialDia(ui.presFecha);
  const lista = state.centros.filter(c => {
    if (q) {
      const emps = state.empleados.filter(e => e.centroId === c.id).map(e => e.nombre).join(' ');
      if (!sinAcentos(`${c.nombre} ${c.barrio} ${emps}`).includes(q)) return false;
    }
    return !(esHoy && ui.presFiltro !== 'todos' && estadoCentro(c) !== ui.presFiltro);
  });
  if (!lista.length) return '<div class="empty">No hay centros que coincidan.</div>';
  return lista.map(c => {
    const est = esHoy ? estadoCentro(c) : hist[c.id].estado;
    const hora = esHoy ? state.fotos[c.id]?.hora : hist[c.id].hora;
    const nov = esHoy ? novedadesCentro(c.id) : hist[c.id].novedades;
    const e = ESTADO_CENTRO[est];
    return `<button class="center-card ${e.cls} ${esHoy ? '' : 'readonly'}" ${esHoy ? `data-act="abrirCentro" data-id="${c.id}"` : ''}>
      <div class="cc-top"><b>${c.nombre}</b>${pill(e.txt, e.cls)}</div>
      <div class="cc-barrio">${esc(c.barrio)}</div>
      <div class="cc-meta"><span>${hora ? `Planilla ${hora} h` : 'Sin planilla'}</span>${nov ? `<span class="nov">${nov} novedad${nov > 1 ? 'es' : ''}</span>` : ''}</div>
    </button>`;
  }).join('');
}

function overlayCentro(id) {
  const c = centro(id);
  const f = state.fotos[id];
  const emps = state.empleados.filter(e => e.centroId === c.id);
  const est = ESTADO_CENTRO[estadoCentro(c)];
  const aviso = `Hola ${c.nombre} (${c.barrio}), todavía no recibimos la planilla de asistencia de hoy ${fmt(HOY)}. ¿Nos la pueden enviar? Gracias. — Administración`;
  const cuerpo = `
    <div class="row-between">${pill(est.txt, est.cls)}<span class="muted">Contacto del centro: ${c.contacto}</span></div>
    ${f ? `<div class="foto-ok"><div class="foto-thumb">Foto de la planilla</div>
        <div>Recibida a las <b>${f.hora} h</b><br><small class="muted">En la versión real acá se ve la foto que mandó el centro.</small></div></div>`
      : `<div class="foto-falta"><b>Todavía no llegó la planilla de hoy.</b>
        <div class="btns"><button class="btn" data-act="registrarFoto" data-id="${c.id}">Registrar planilla recibida</button>
        <button class="btn ghost" data-act="verAviso" data-id="${c.id}">Preparar aviso al centro</button></div></div>`}
    ${ui.avisoCentro === c.id ? `<div class="aviso-box"><label>Mensaje para enviar por WhatsApp o mail</label>
        <textarea id="aviso-txt" rows="3">${esc(aviso)}</textarea>
        <button class="btn small" data-act="copiarAviso">Copiar mensaje</button></div>` : ''}
    <h3>Personal administrativo</h3>
    <div class="table-wrap"><table class="table">
      <thead><tr><th>Empleado</th><th>Estado</th><th>Novedad / observación</th></tr></thead>
      <tbody>${emps.map(e => {
        const a = state.asistencia[e.id];
        return `<tr><td><b>${esc(e.nombre)}</b><br><small class="muted">${e.puesto}</small></td>
          <td><select data-change="asistencia" data-id="${e.id}" ${f ? '' : 'disabled'} class="sel-${a.estado}">
            ${Object.entries(ESTADO_EMP).map(([k, v]) => `<option value="${k}" ${a.estado === k ? 'selected' : ''}>${v}</option>`).join('')}</select></td>
          <td><input value="${esc(a.nota)}" placeholder="Ej.: avisó por WhatsApp" data-change="notaAsistencia" data-id="${e.id}" ${f ? '' : 'disabled'}></td></tr>`;
      }).join('')}</tbody></table></div>`;
  let pie = '';
  if (f && !f.revisado) pie = `<button class="btn ok" data-act="marcarRevisado" data-id="${c.id}">Marcar como revisado</button>`;
  else if (f) pie = `<button class="btn ghost" data-act="desmarcarRevisado" data-id="${c.id}">Volver a "a revisar"</button>`;
  return panel(`${c.nombre} — ${esc(c.barrio)}`, cuerpo, pie, 'wide');
}

// ---------- documentación ----------

function vistaDocumentacion() {
  const prog = state.programas.find(p => p.id === ui.docProg);
  const pers = periodosDe(prog);
  if (!pers.find(p => p.key === ui.docPeriodo)) ui.docPeriodo = pers[0].key;
  const filas = state.centros.map(c => ({ c, fecha: state.presentaciones[`${prog.id}|${ui.docPeriodo}|${c.id}`] }));
  const recibidos = filas.filter(f => f.fecha).length;
  const vis = filas.filter(f => ui.docFiltro === 'todos' || (ui.docFiltro === 'recibido' ? f.fecha : !f.fecha));
  return `
    <div class="page-head"><div><h1>Documentación de programas</h1>
      <p class="muted">Recepción de formularios por centro. Es un proceso separado del presentismo.</p></div>
      <button class="btn ghost" data-act="copiarPendientesDoc">Copiar lista de pendientes</button></div>
    <div class="tabs">${state.programas.map(p => `<button class="tab ${p.id === prog.id ? 'active' : ''}" data-act="docProg" data-id="${p.id}">${p.nombre}<span class="badge light">${docPendientes(p)}</span></button>`).join('')}</div>
    <div class="card prog-info">
      <div><b>${prog.nombre}</b> · entrega ${prog.frecuencia}</div>
      <div class="muted">Documentación requerida: ${prog.documentos.join(' · ')}</div>
      <small class="muted">Cada programa se configura con sus propios formularios y plazos.</small>
    </div>
    <div class="toolbar">
      <label class="field-inline">Período <select data-change="docPeriodo">${pers.map(p => `<option value="${p.key}" ${p.key === ui.docPeriodo ? 'selected' : ''}>${p.label}</option>`).join('')}</select></label>
      <div class="chips">${[['todos', 'Todos'], ['pendiente', 'Pendientes'], ['recibido', 'Recibidos']].map(([k, t]) => `<button class="chip ${ui.docFiltro === k ? 'active' : ''}" data-act="docFiltro" data-f="${k}">${t}</button>`).join('')}</div>
      <div class="progress-wrap"><div class="progress"><div style="width:${(recibidos / filas.length) * 100}%"></div></div><span>${recibidos} de ${filas.length} centros entregaron</span></div>
    </div>
    <div class="card table-wrap"><table class="table">
      <thead><tr><th>Centro</th><th>Barrio</th><th>Estado</th><th>Fecha de recepción</th><th></th></tr></thead>
      <tbody>${vis.map(({ c, fecha }) => `<tr>
        <td><b>${c.nombre}</b></td><td>${esc(c.barrio)}</td>
        <td>${fecha ? pill('Recibido', 'ok') : pill('Pendiente', 'warn')}</td>
        <td>${fecha ? fmt(fecha) : '—'}</td>
        <td class="right">${fecha ? `<button class="btn small ghost" data-act="deshacerDoc" data-id="${c.id}">Deshacer</button>`
          : `<button class="btn small" data-act="registrarDoc" data-id="${c.id}">Registrar recepción</button>`}</td></tr>`).join('')}
      </tbody></table>
      ${vis.length ? '' : '<div class="empty">No hay centros en este filtro.</div>'}
    </div>`;
}

// ---------- stock (encargado) ----------

function vistaStock() {
  const tabs = [['pedidos', `Pedidos <span class="badge light">${pedidosAbiertos().length}</span>`], ['inventario', 'Inventario'], ['movimientos', 'Historial de movimientos'], ['consumo', 'Consumo por centro']];
  const contenido = { pedidos: stockPedidos, inventario: stockInventario, movimientos: stockMovimientos, consumo: stockConsumo }[ui.stockTab]();
  return `
    <div class="page-head"><div><h1>Stock y entregas de fotocopias</h1>
      <p class="muted">El centro pide · el encargado prepara y confirma lo entregado · el stock se descuenta al entregar.</p></div></div>
    <div class="tabs">${tabs.map(([k, t]) => `<button class="tab ${ui.stockTab === k ? 'active' : ''}" data-act="stockTab" data-tab="${k}">${t}</button>`).join('')}</div>
    ${contenido}`;
}

function stockPedidos() {
  const consumo = consumoPorCentro();
  const promedio = Object.values(consumo).reduce((s, v) => s + v, 0) / state.centros.length;
  const lista = ui.verEntregados
    ? state.pedidos.filter(p => p.estado === 'entregado' || p.estado === 'rechazado').sort((a, b) => b.id - a.id).slice(0, 12)
    : pedidosAbiertos().sort((a, b) => a.fecha.localeCompare(b.fecha));
  return `
    <div class="toolbar"><div class="chips">
      <button class="chip ${!ui.verEntregados ? 'active' : ''}" data-act="verEntregados" data-v="0">Por atender</button>
      <button class="chip ${ui.verEntregados ? 'active' : ''}" data-act="verEntregados" data-v="1">Últimos cerrados</button></div></div>
    ${lista.length ? `<div class="pedidos">${lista.map(p => {
      const c = centro(p.centroId);
      const ep = ESTADO_PEDIDO[p.estado];
      const alto = consumo[c.id] > promedio * 1.6;
      const abierto = p.estado === 'pendiente' || p.estado === 'en_preparacion';
      return `<div class="card pedido">
        <div class="row-between"><div><b>${c.nombre} — ${esc(c.barrio)}</b><br><small class="muted">Pedido #${p.id} · ${fmt(p.fecha)} · ${esc(p.solicitante)}</small></div>${pill(ep.txt, ep.cls)}</div>
        <table class="table compact"><thead><tr><th>Material</th><th class="right">Pedido</th><th class="right">${abierto ? 'Disponible' : 'Entregado'}</th><th></th></tr></thead>
        <tbody>${p.items.map(it => {
          const m = material(it.materialId);
          const falta = abierto && it.cantidad > m.stock;
          return `<tr><td>${esc(m.nombre)}</td><td class="right">${num(it.cantidad)}</td>
            <td class="right">${abierto ? num(m.stock) : num(it.entregado ?? 0)}</td>
            <td>${falta ? pill(m.stock === 0 ? 'Sin stock' : 'Supera el stock', 'bad') : ''}</td></tr>`;
        }).join('')}</tbody></table>
        ${abierto ? `<div class="hint-line ${alto ? 'warn' : ''}">Este centro recibió <b>${num(consumo[c.id])}</b> copias en los últimos 90 días (promedio de los centros: ${num(Math.round(promedio))}).${alto ? ' Consumo alto: conviene revisar el pedido.' : ''}</div>
          <div class="btns">
            ${p.estado === 'pendiente' ? `<button class="btn ghost" data-act="prepararPedido" data-id="${p.id}">Pasar a preparación</button>` : ''}
            <button class="btn ok" data-act="abrirEntrega" data-id="${p.id}">Registrar entrega</button>
            <button class="btn ghost danger" data-act="rechazarPedido" data-id="${p.id}">Rechazar</button>
          </div>` : ''}
      </div>`;
    }).join('')}</div>` : '<div class="card empty">No hay pedidos por atender.</div>'}`;
}

function overlayEntrega(id) {
  const p = state.pedidos.find(x => x.id === +id);
  const c = centro(p.centroId);
  const cuerpo = `
    <p>Indicá cuánto se entregó de cada material. El stock se descuenta al confirmar.</p>
    <div class="table-wrap"><table class="table">
      <thead><tr><th>Material</th><th class="right">Pedido</th><th class="right">Disponible</th><th>Entregado</th></tr></thead>
      <tbody>${p.items.map(it => {
        const m = material(it.materialId);
        return `<tr><td>${esc(m.nombre)}</td><td class="right">${num(it.cantidad)}</td><td class="right">${num(m.stock)}</td>
          <td><input type="number" min="0" max="${m.stock}" step="10" value="${Math.min(it.cantidad, m.stock)}" id="ent-${m.id}" class="num"></td></tr>`;
      }).join('')}</tbody></table></div>
    <div class="notice">Recordá hacer firmar el remito en papel: la firma sigue siendo el comprobante de recepción.</div>`;
  return panel(`Entrega a ${c.nombre} — pedido #${p.id}`, cuerpo, `<button class="btn ok" data-act="confirmarEntrega" data-id="${p.id}">Confirmar entrega</button>`);
}

function stockInventario() {
  return `
    <div class="toolbar"><span class="muted">Existencias actuales de cada formulario.</span><button class="btn" data-act="nuevoMaterial">Agregar material</button></div>
    <div class="card table-wrap"><table class="table">
      <thead><tr><th>Material</th><th class="right">Stock</th><th class="right">Mínimo</th><th>Nivel</th><th>Estado</th><th></th></tr></thead>
      <tbody>${state.materiales.map(m => {
        const n = nivelStock(m);
        const pct = Math.min(100, (m.stock / (m.minimo * 4)) * 100);
        return `<tr><td><b>${esc(m.nombre)}</b></td><td class="right">${num(m.stock)}</td><td class="right">${num(m.minimo)}</td>
          <td><div class="level ${n.cls}"><div style="width:${pct}%"></div></div></td><td>${pill(n.txt, n.cls)}</td>
          <td class="right nowrap"><button class="btn small" data-act="abrirMov" data-id="${m.id}" data-mov="ingreso">Ingreso</button>
            <button class="btn small ghost" data-act="abrirMov" data-id="${m.id}" data-mov="devolucion">Devolución</button>
            <button class="btn small ghost" data-act="abrirMov" data-id="${m.id}" data-mov="ajuste">Ajuste</button></td></tr>`;
      }).join('')}</tbody></table></div>`;
}

function overlayMovimiento(id, mov) {
  const m = material(id);
  const titulos = { ingreso: 'Registrar ingreso (copias nuevas)', devolucion: 'Registrar devolución de un centro', ajuste: 'Ajuste por conteo físico' };
  const cuerpo = `
    <p><b>${esc(m.nombre)}</b> · stock actual: ${num(m.stock)}</p>
    ${mov === 'devolucion' ? `<label>Centro que devuelve<select id="mov-centro">${state.centros.map(c => `<option value="${c.id}">${c.nombre} — ${esc(c.barrio)}</option>`).join('')}</select></label>` : ''}
    <label>${mov === 'ajuste' ? 'Cantidad contada (nuevo stock)' : 'Cantidad'}<input type="number" min="0" step="10" id="mov-cant" class="num" value="${mov === 'ajuste' ? m.stock : ''}"></label>
    <label>Detalle<input id="mov-det" placeholder="${mov === 'ingreso' ? 'Ej.: impresión de la semana' : mov === 'ajuste' ? 'Ej.: conteo mensual' : 'Ej.: sobrante del mes'}"></label>`;
  return panel(titulos[mov], cuerpo, `<button class="btn ok" data-act="confirmarMov" data-id="${m.id}" data-mov="${mov}">Guardar</button>`);
}

function overlayNuevoMaterial() {
  const cuerpo = `
    <label>Nombre del formulario<input id="nm-nombre" placeholder="Ej.: Planilla de derivación"></label>
    <label>Stock inicial<input type="number" min="0" step="10" id="nm-stock" class="num" value="0"></label>
    <label>Stock mínimo (para avisar)<input type="number" min="0" step="10" id="nm-min" class="num" value="100"></label>`;
  return panel('Agregar material', cuerpo, '<button class="btn ok" data-act="confirmarNuevoMaterial">Agregar</button>');
}

function stockMovimientos() {
  const lista = state.movimientos
    .filter(m => (!ui.movMat || m.materialId === +ui.movMat) && (!ui.movCentro || m.centroId === +ui.movCentro))
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
  return `
    <div class="toolbar">
      <label class="field-inline">Material <select data-change="movMat"><option value="">Todos</option>${state.materiales.map(m => `<option value="${m.id}" ${+ui.movMat === m.id ? 'selected' : ''}>${esc(m.nombre)}</option>`).join('')}</select></label>
      <label class="field-inline">Centro <select data-change="movCentro"><option value="">Todos</option>${state.centros.map(c => `<option value="${c.id}" ${+ui.movCentro === c.id ? 'selected' : ''}>${c.nombre}</option>`).join('')}</select></label>
      <span class="muted">${lista.length} movimientos</span>
    </div>
    <div class="card table-wrap"><table class="table">
      <thead><tr><th>Fecha</th><th>Tipo</th><th>Material</th><th class="right">Cantidad</th><th>Centro</th><th>Usuario</th><th>Detalle</th></tr></thead>
      <tbody>${lista.slice(0, 80).map(m => {
        const t = TIPO_MOV[m.tipo];
        return `<tr><td class="nowrap">${fmt(m.fecha)}</td><td>${pill(t.txt, t.cls)}</td><td>${esc(material(m.materialId).nombre)}</td>
          <td class="right nowrap">${m.tipo === 'ajuste' ? (m.cantidad >= 0 ? '+' : '−') + num(Math.abs(m.cantidad)) : t.signo + num(m.cantidad)}</td>
          <td>${m.centroId ? centro(m.centroId).nombre : '—'}</td><td>${esc(m.usuario)}</td><td class="muted">${esc(m.detalle)}</td></tr>`;
      }).join('')}</tbody></table>
      ${lista.length ? '' : '<div class="empty">No hay movimientos con ese filtro.</div>'}</div>`;
}

function stockConsumo() {
  const consumo = consumoPorCentro();
  const valores = Object.values(consumo);
  const promedio = valores.reduce((s, v) => s + v, 0) / valores.length;
  const max = Math.max(...valores, 1);
  const filas = state.centros.map(c => ({ c, v: consumo[c.id] })).sort((a, b) => b.v - a.v);
  return `
    <div class="notice">Copias entregadas por centro en los últimos 90 días. Sirve para revisar pedidos, <b>no es prueba automática de desperdicio</b>.</div>
    <div class="card table-wrap"><table class="table">
      <thead><tr><th>Centro</th><th>Barrio</th><th class="right">Copias</th><th style="width:40%">Comparación</th><th></th></tr></thead>
      <tbody>${filas.map(({ c, v }) => `<tr><td><b>${c.nombre}</b></td><td>${esc(c.barrio)}</td><td class="right">${num(v)}</td>
        <td><div class="hbar"><div style="width:${(v / max) * 100}%" class="${v > promedio * 1.6 ? 'alto' : ''}"></div><span class="avg" style="left:${(promedio / max) * 100}%"></span></div></td>
        <td>${v > promedio * 1.6 ? pill('Para revisar', 'warn') : ''}</td></tr>`).join('')}</tbody></table>
      <p class="muted small-note">La línea vertical marca el promedio (${num(Math.round(promedio))} copias).</p></div>`;
}

// ---------- pedidos (centro) ----------

function warnCarrito(m) {
  const q = ui.carrito[m.id] || 0;
  if (q > m.stock) return m.stock === 0 ? 'Sin stock: el encargado va a revisar el pedido' : `Supera lo disponible (${num(m.stock)})`;
  return '';
}

function resumenCarrito() {
  const items = Object.entries(ui.carrito).filter(([, q]) => q > 0);
  if (!items.length) return '<span class="muted">Todavía no elegiste materiales.</span>';
  return `${items.length} material${items.length > 1 ? 'es' : ''} · ${num(items.reduce((s, [, q]) => s + q, 0))} copias`;
}

function vistaPedidos() {
  const c = centro(usuario.centroId);
  const mios = state.pedidos.filter(p => p.centroId === c.id).sort((a, b) => b.id - a.id).slice(0, 10);
  return `
    <div class="page-head"><div><h1>Pedir materiales</h1><p class="muted">${c.nombre} — ${esc(c.barrio)} · mirá lo disponible antes de pedir</p></div></div>
    <div class="mat-grid">${state.materiales.map(m => {
      const n = nivelStock(m);
      const q = ui.carrito[m.id] || 0;
      return `<div class="mat-card">
        <div class="row-between"><b>${esc(m.nombre)}</b>${pill(n.txt, n.cls)}</div>
        <div class="muted">Disponible: <b>${num(m.stock)}</b> copias</div>
        <label class="field-inline">Cantidad <input type="number" min="0" step="10" placeholder="0" value="${q || ''}" data-input="carrito" data-id="${m.id}" class="num ${q > m.stock ? 'over' : ''}"></label>
        <div class="warn-text" id="warn-${m.id}">${warnCarrito(m)}</div>
      </div>`;
    }).join('')}</div>
    <div class="card send-bar"><div id="carrito-resumen">${resumenCarrito()}</div>
      <div class="btns"><button class="btn ghost" data-act="vaciarCarrito">Vaciar</button><button class="btn ok" data-act="enviarPedido">Enviar pedido</button></div></div>
    <h3>Mis pedidos</h3>
    <div class="card table-wrap"><table class="table">
      <thead><tr><th>Pedido</th><th>Fecha</th><th>Materiales</th><th>Estado</th></tr></thead>
      <tbody>${mios.map(p => `<tr><td>#${p.id}</td><td>${fmt(p.fecha)}</td>
        <td>${p.items.map(it => `${esc(material(it.materialId).nombre)}: ${num(it.cantidad)}${it.entregado !== undefined && it.entregado !== it.cantidad ? ` <small class="muted">(entregado ${num(it.entregado)})</small>` : ''}`).join('<br>')}</td>
        <td>${pill(ESTADO_PEDIDO[p.estado].txt, ESTADO_PEDIDO[p.estado].cls)}</td></tr>`).join('')}</tbody></table>
      ${mios.length ? '' : '<div class="empty">Todavía no hiciste pedidos.</div>'}</div>`;
}

function overlayConfirmPedido() {
  const exceden = Object.entries(ui.carrito).filter(([id, q]) => q > material(id).stock);
  const cuerpo = `<p>Algunos materiales superan el stock disponible:</p>
    <ul>${exceden.map(([id, q]) => `<li><b>${esc(material(id).nombre)}</b>: pedís ${num(q)}, hay ${num(material(id).stock)}</li>`).join('')}</ul>
    <p>Podés enviarlo igual: el encargado de stock lo va a revisar y te va a avisar qué se puede entregar.</p>`;
  return panel('El pedido supera el stock', cuerpo, '<button class="btn ok" data-act="confirmarPedido">Enviar igual</button>');
}

function crearPedido() {
  const items = Object.entries(ui.carrito).filter(([, q]) => q > 0).map(([id, q]) => ({ materialId: +id, cantidad: q }));
  const p = { id: state.nextId++, centroId: usuario.centroId, fecha: HOY, estado: 'pendiente', solicitante: usuario.nombre, items };
  state.pedidos.push(p);
  registrar('Pedidos', `Envió pedido #${p.id} (${items.length} materiales)`);
  ui.carrito = {};
  ui.overlay = null;
  render();
  toast(`Pedido #${p.id} enviado. Lo vas a ver en "Mis pedidos".`);
}

// ---------- call center ----------

function vistaCallcenter() {
  return `
    <div class="page-head"><div><h1>Call center</h1>
      <p class="muted">Buscá por DNI, nombre o teléfono. Incluye pacientes con y sin obra social.</p></div></div>
    <div class="cc-layout">
      <div class="card cc-left">
        <input class="search big" id="cc-search" placeholder="DNI, nombre o teléfono…" value="${esc(ui.ccQuery)}" data-input="ccQuery">
        <div class="chips">${[['todos', 'Todos'], ['sin', 'Sin obra social'], ['con', 'Con obra social']].map(([k, t]) => `<button class="chip ${ui.ccObra === k ? 'active' : ''}" data-act="ccObra" data-f="${k}">${t}</button>`).join('')}</div>
        <div id="cc-results">${resultadosCC()}</div>
      </div>
      <div class="cc-right">${ui.ccPaciente ? fichaPaciente(paciente(ui.ccPaciente)) : panelVolverLlamar()}</div>
    </div>`;
}

function buscarPacientes() {
  const q = ui.ccQuery.trim();
  const qd = digitos(q);
  const qt = sinAcentos(q);
  return state.pacientes.filter(p => {
    if (ui.ccObra === 'sin' && p.obraSocial !== 'Sin obra social') return false;
    if (ui.ccObra === 'con' && p.obraSocial === 'Sin obra social') return false;
    if (!q) return true;
    if (qd.length >= 3 && (digitos(p.dni).includes(qd) || p.telefonos.some(t => digitos(t).includes(qd)))) return true;
    return /[a-z]/.test(qt) && sinAcentos(`${p.nombre} ${p.apellido} ${p.apellido} ${p.nombre}`).includes(qt);
  });
}

function resultadosCC() {
  const lista = buscarPacientes();
  if (!lista.length) return '<div class="empty">No se encontraron pacientes.</div>';
  return `<div class="res-count muted">${lista.length} paciente${lista.length > 1 ? 's' : ''}${ui.ccQuery ? '' : ' · escribí para filtrar'}</div>
    ${lista.map(p => {
      const comp = compartenTelefono(p).length;
      return `<button class="res ${ui.ccPaciente === p.id ? 'active' : ''}" data-act="verPaciente" data-id="${p.id}">
        <div class="row-between"><b>${esc(p.apellido)}, ${esc(p.nombre)}</b><small class="muted">${edad(p.nacimiento)} años</small></div>
        <small class="muted">DNI ${p.dni} · ${p.telefonos[0]}</small>
        <div class="res-tags">${comp ? `<span class="tag shared">Teléfono compartido con ${comp}</span>` : ''}<span class="tag">${esc(p.obraSocial)}</span></div>
      </button>`;
    }).join('')}`;
}

function panelVolverLlamar() {
  const lista = volverALlamar();
  return `<div class="card">
    <h2>Para volver a llamar</h2>
    ${lista.length ? `<ul class="callback">${lista.map(l => {
      const p = paciente(l.pacienteId);
      return `<li><button class="res" data-act="verPaciente" data-id="${p.id}">
        <div class="row-between"><b>${esc(p.nombre)} ${esc(p.apellido)}</b>${pill(l.fechaVolver <= HOY ? 'Hoy' : fmt(l.fechaVolver), l.fechaVolver <= HOY ? 'warn' : 'neutral')}</div>
        <small class="muted">${esc(l.motivo)} · último intento: ${esc(l.resultado)} (${fmtHora(l.fecha)})</small></button></li>`;
    }).join('')}</ul>` : '<p class="muted">No hay llamadas pendientes.</p>'}
    <div class="tip"><b>Probá:</b> buscá <code>4567-8901</code>. Es el teléfono de una mamá que lo comparte con sus tres hijos (de distinto apellido): aparecen las cuatro personas por separado.</div>
  </div>`;
}

function fichaPaciente(p) {
  const comp = compartenTelefono(p);
  const ats = state.atenciones.filter(a => a.pacienteId === p.id).sort((a, b) => b.fecha.localeCompare(a.fecha));
  const lls = state.llamadas.filter(l => l.pacienteId === p.id).sort((a, b) => b.fecha.localeCompare(a.fecha));
  const ultima = id => state.atenciones.filter(a => a.pacienteId === id).sort((a, b) => b.fecha.localeCompare(a.fecha))[0];
  return `<div class="card ficha">
    <div class="ficha-head">
      <div class="avatar big">${iniciales(`${p.nombre} ${p.apellido}`)}</div>
      <div class="grow"><h2>${esc(p.nombre)} ${esc(p.apellido)}</h2>
        <div class="muted">DNI ${p.dni} · ${edad(p.nacimiento)} años · nac. ${fmt(p.nacimiento)}</div></div>
      ${pill(p.obraSocial, p.obraSocial === 'Sin obra social' ? 'neutral' : 'info')}
      <button class="x" data-act="cerrarFicha" aria-label="Cerrar ficha">×</button>
    </div>
    <div class="ficha-grid">
      <div><label>Teléfonos</label>${p.telefonos.map(t => `<div class="tel">${t}</div>`).join('')}</div>
      <div><label>Dirección</label>${esc(p.direccion)}</div>
      <div><label>Centro habitual</label>${centro(p.centroId).nombre} — ${esc(centro(p.centroId).barrio)}</div>
      ${p.vinculo ? `<div><label>Vínculo familiar</label>${esc(p.vinculo)}</div>` : ''}
    </div>
    ${comp.length ? `<div class="shared"><b>Comparten teléfono con este paciente</b>
      <div class="shared-list">${comp.map(o => {
        const u = ultima(o.id);
        return `<button class="shared-item" data-act="verPaciente" data-id="${o.id}"><b>${esc(o.nombre)} ${esc(o.apellido)}</b>
          <small>${edad(o.nacimiento)} años · ${u ? `última atención: ${esc(u.prestacion)} (${fmt(u.fecha)})` : 'sin atenciones'}</small></button>`;
      }).join('')}</div></div>` : ''}
    <div class="ficha-cols">
      <div><h3>Historial de atenciones</h3>
        <div class="table-wrap"><table class="table compact"><thead><tr><th>Fecha</th><th>Prestación</th><th>Centro</th></tr></thead>
        <tbody>${ats.map(a => `<tr><td class="nowrap">${fmt(a.fecha)}</td><td>${esc(a.prestacion)}</td><td>${centro(a.centroId).nombre}</td></tr>`).join('')}</tbody></table></div></div>
      <div><h3>Registrar llamada</h3>
        <div class="form-grid">
          <label>Motivo<select id="ll-motivo">${MOTIVOS_LLAMADA.map(m => `<option>${m}</option>`).join('')}</select></label>
          <label>Resultado<select id="ll-resultado">${RESULTADOS_LLAMADA.map(m => `<option>${m}</option>`).join('')}</select></label>
          <label class="full">Respuestas / notas<textarea id="ll-notas" rows="2" placeholder="Ej.: confirma turno del jueves"></textarea></label>
          <label class="check"><input type="checkbox" id="ll-volver"> Volver a llamar</label>
          <label>Fecha<input type="date" id="ll-fecha" value="${isoDate(sumarDias(new Date(), 1))}" min="${HOY}"></label>
        </div>
        <button class="btn ok" data-act="guardarLlamada" data-id="${p.id}">Guardar llamada</button>
        <h3>Llamadas anteriores</h3>
        ${lls.length ? `<ul class="calls">${lls.map(l => `<li><div class="row-between"><b>${esc(l.resultado)}</b><small class="muted">${fmtHora(l.fecha)} · ${esc(l.operador)}</small></div>
          <small>${esc(l.motivo)}${l.notas ? ` — ${esc(l.notas)}` : ''}${l.volverLlamar && !l.resuelta ? ` · <b>volver a llamar ${fmt(l.fechaVolver)}</b>` : ''}</small></li>`).join('')}</ul>`
          : '<p class="muted">Sin llamadas registradas.</p>'}
      </div>
    </div>
  </div>`;
}

// ---------- usuarios y auditoría ----------

function vistaUsuarios() {
  const mods = ORDEN_MODULOS;
  return `
    <div class="page-head"><div><h1>Usuarios y permisos</h1>
      <p class="muted">Cada empleado tiene su cuenta. Los accesos a otros módulos (por ejemplo, para cubrir un reemplazo) los habilita el supervisor.</p></div></div>
    <div class="card table-wrap"><table class="table perm">
      <thead><tr><th>Usuario</th><th>Puesto</th>${mods.map(m => `<th class="center">${MODULOS[m].nombre}</th>`).join('')}</tr></thead>
      <tbody>${state.usuarios.map(u => `<tr><td><b>${esc(u.nombre)}</b></td><td class="muted">${esc(u.rol)}</td>
        ${mods.map(m => {
          const bloqueado = u.id === usuario.id && m === 'usuarios';
          return `<td class="center"><input type="checkbox" data-change="permiso" data-user="${u.id}" data-mod="${m}" ${u.modulos.includes(m) ? 'checked' : ''} ${bloqueado ? 'disabled' : ''}></td>`;
        }).join('')}</tr>`).join('')}</tbody></table></div>
    <div class="notice">Ejemplo: si Luis tiene que cubrir a Carla una semana, marcá "Call center" en su fila. Cuando vuelva, se desmarca. Todo queda en el registro de actividad.</div>`;
}

function vistaAuditoria() {
  const nombres = [...new Set(state.auditoria.map(a => a.usuario))];
  const lista = state.auditoria.filter(a => !ui.audUser || a.usuario === ui.audUser);
  return `
    <div class="page-head"><div><h1>Registro de actividad</h1><p class="muted">Quién hizo qué y cuándo.</p></div>
      <label class="field-inline">Usuario <select data-change="audUser"><option value="">Todos</option>${nombres.map(n => `<option ${ui.audUser === n ? 'selected' : ''}>${esc(n)}</option>`).join('')}</select></label></div>
    <div class="card table-wrap"><table class="table">
      <thead><tr><th>Fecha y hora</th><th>Usuario</th><th>Módulo</th><th>Detalle</th></tr></thead>
      <tbody>${lista.map(a => `<tr><td class="nowrap">${fmtHora(a.fecha)}</td><td>${esc(a.usuario)}</td><td>${pill(a.accion, 'neutral')}</td><td>${esc(a.detalle)}</td></tr>`).join('')}</tbody>
    </table></div>`;
}

const VISTAS = {
  inicio: vistaInicio,
  presentismo: vistaPresentismo,
  documentacion: vistaDocumentacion,
  stock: vistaStock,
  pedidos: vistaPedidos,
  callcenter: vistaCallcenter,
  usuarios: vistaUsuarios,
  auditoria: vistaAuditoria,
};

// ---------- acciones ----------

const acciones = {
  noop() {},
  login(d) {
    usuario = state.usuarios.find(u => u.id === d.id);
    sessionStorage.setItem(SESSION_KEY, usuario.id);
    vista = 'inicio';
    ui.ccPaciente = null;
    ui.carrito = {};
    render();
  },
  logout() {
    usuario = null;
    ui.overlay = null;
    sessionStorage.removeItem(SESSION_KEY);
    render();
  },
  reset() {
    if (!confirm('¿Reiniciar todos los datos de la demo?')) return;
    state = crearDatosIniciales();
    guardar();
    usuario = state.usuarios.find(u => u.id === usuario?.id) || null;
    ui.overlay = null;
    ui.ccPaciente = null;
    render();
    toast('Datos de la demo reiniciados');
  },
  ir(d) {
    vista = d.vista;
    ui.overlay = null;
    render();
    window.scrollTo(0, 0);
    if (vista === 'callcenter' && !ui.ccPaciente) document.getElementById('cc-search')?.focus();
  },
  cerrar() {
    ui.overlay = null;
    ui.avisoCentro = null;
    render();
  },

  presFiltro(d) { ui.presFiltro = d.f; render(); },
  presHoy() { ui.presFecha = HOY; render(); },
  abrirCentro(d) { ui.overlay = { tipo: 'centro', id: +d.id }; ui.avisoCentro = null; render(); },
  registrarFoto(d) {
    const c = centro(d.id);
    state.fotos[c.id] = { hora: ahoraHora(), revisado: false };
    state.empleados.filter(e => e.centroId === c.id).forEach(e => { state.asistencia[e.id] = { estado: 'presente', nota: '' }; });
    ui.avisoCentro = null;
    registrar('Presentismo', `Registró planilla recibida de ${c.nombre}`);
    render();
    toast('Planilla registrada. Revisá el estado de cada empleado.');
  },
  verAviso(d) { ui.avisoCentro = +d.id; render(); },
  copiarAviso() { copiar(document.getElementById('aviso-txt').value); },
  marcarRevisado(d) {
    const c = centro(d.id);
    state.fotos[c.id].revisado = true;
    registrar('Presentismo', `Marcó ${c.nombre} como revisado`);
    ui.overlay = null;
    render();
    toast(`${c.nombre} completo`);
  },
  desmarcarRevisado(d) {
    state.fotos[d.id].revisado = false;
    registrar('Presentismo', `Volvió ${centro(d.id).nombre} a "a revisar"`);
    render();
  },

  docProg(d) { ui.docProg = d.id; ui.docPeriodo = null; render(); },
  docFiltro(d) { ui.docFiltro = d.f; render(); },
  registrarDoc(d) {
    const prog = state.programas.find(p => p.id === ui.docProg);
    state.presentaciones[`${prog.id}|${ui.docPeriodo}|${d.id}`] = HOY;
    registrar('Documentación', `Registró recepción ${prog.nombre} de ${centro(d.id).nombre}`);
    render();
  },
  deshacerDoc(d) {
    const prog = state.programas.find(p => p.id === ui.docProg);
    delete state.presentaciones[`${prog.id}|${ui.docPeriodo}|${d.id}`];
    registrar('Documentación', `Deshizo recepción ${prog.nombre} de ${centro(d.id).nombre}`);
    render();
  },
  copiarPendientesDoc() {
    const prog = state.programas.find(p => p.id === ui.docProg);
    const per = periodosDe(prog).find(p => p.key === ui.docPeriodo);
    const pend = state.centros.filter(c => !state.presentaciones[`${prog.id}|${ui.docPeriodo}|${c.id}`]);
    copiar(`${prog.nombre} — ${per.label}\nCentros pendientes (${pend.length}):\n${pend.map(c => `- ${c.nombre} (${c.barrio})`).join('\n')}`);
  },

  stockTab(d) { ui.stockTab = d.tab; render(); },
  verEntregados(d) { ui.verEntregados = d.v === '1'; render(); },
  prepararPedido(d) {
    const p = state.pedidos.find(x => x.id === +d.id);
    p.estado = 'en_preparacion';
    registrar('Stock', `Pasó a preparación el pedido #${p.id} de ${centro(p.centroId).nombre}`);
    render();
  },
  abrirEntrega(d) { ui.overlay = { tipo: 'entrega', id: +d.id }; render(); },
  confirmarEntrega(d) {
    const p = state.pedidos.find(x => x.id === +d.id);
    const cantidades = p.items.map(it => ({ it, m: material(it.materialId), q: parseInt(document.getElementById(`ent-${it.materialId}`).value, 10) || 0 }));
    const invalido = cantidades.find(({ m, q }) => q < 0 || q > m.stock);
    if (invalido) { toast(`No podés entregar más de lo que hay de "${invalido.m.nombre}" (${num(invalido.m.stock)}).`); return; }
    if (cantidades.every(({ q }) => q === 0)) { toast('Indicá al menos una cantidad entregada.'); return; }
    cantidades.forEach(({ it, m, q }) => {
      it.entregado = q;
      if (!q) return;
      m.stock -= q;
      state.movimientos.push({ fecha: new Date().toISOString(), tipo: 'entrega', materialId: m.id, cantidad: q, centroId: p.centroId, usuario: usuario.nombre, detalle: `Pedido #${p.id}` });
    });
    p.estado = 'entregado';
    p.fechaEntrega = HOY;
    registrar('Stock', `Entregó pedido #${p.id} a ${centro(p.centroId).nombre}`);
    ui.overlay = null;
    render();
    toast('Entrega registrada y stock actualizado. No te olvides de la firma del remito.');
  },
  rechazarPedido(d) {
    const p = state.pedidos.find(x => x.id === +d.id);
    if (!confirm(`¿Rechazar el pedido #${p.id} de ${centro(p.centroId).nombre}?`)) return;
    p.estado = 'rechazado';
    registrar('Stock', `Rechazó pedido #${p.id} de ${centro(p.centroId).nombre}`);
    render();
  },
  abrirMov(d) { ui.overlay = { tipo: 'movimiento', id: +d.id, mov: d.mov }; render(); },
  confirmarMov(d) {
    const m = material(d.id);
    const q = parseInt(document.getElementById('mov-cant').value, 10);
    if (Number.isNaN(q) || q < 0 || (d.mov !== 'ajuste' && q === 0)) { toast('Ingresá una cantidad válida.'); return; }
    const det = document.getElementById('mov-det').value.trim();
    const mov = { fecha: new Date().toISOString(), tipo: d.mov, materialId: m.id, centroId: null, usuario: usuario.nombre, detalle: det };
    if (d.mov === 'ajuste') {
      mov.cantidad = q - m.stock;
      mov.detalle = det || `Conteo: ${num(q)}`;
      m.stock = q;
    } else {
      mov.cantidad = q;
      m.stock += q;
      if (d.mov === 'devolucion') mov.centroId = +document.getElementById('mov-centro').value;
    }
    state.movimientos.push(mov);
    registrar('Stock', `${TIPO_MOV[d.mov].txt} de ${m.nombre}: ${num(q)}`);
    ui.overlay = null;
    render();
    toast(`Stock de "${m.nombre}": ${num(m.stock)}`);
  },
  nuevoMaterial() { ui.overlay = { tipo: 'nuevoMaterial' }; render(); },
  confirmarNuevoMaterial() {
    const nombre = document.getElementById('nm-nombre').value.trim();
    const stock = parseInt(document.getElementById('nm-stock').value, 10) || 0;
    const minimo = parseInt(document.getElementById('nm-min').value, 10) || 0;
    if (!nombre) { toast('Poné el nombre del formulario.'); return; }
    if (state.materiales.some(m => sinAcentos(m.nombre) === sinAcentos(nombre))) { toast('Ya existe un material con ese nombre.'); return; }
    const m = { id: state.nextId++, nombre, stock, minimo };
    state.materiales.push(m);
    if (stock) state.movimientos.push({ fecha: new Date().toISOString(), tipo: 'ingreso', materialId: m.id, cantidad: stock, centroId: null, usuario: usuario.nombre, detalle: 'Carga inicial' });
    registrar('Stock', `Agregó material "${nombre}"`);
    ui.overlay = null;
    render();
  },

  vaciarCarrito() { ui.carrito = {}; render(); },
  enviarPedido() {
    const items = Object.entries(ui.carrito).filter(([, q]) => q > 0);
    if (!items.length) { toast('Elegí al menos un material.'); return; }
    if (items.some(([id, q]) => q > material(id).stock)) { ui.overlay = { tipo: 'confirmPedido' }; render(); return; }
    crearPedido();
  },
  confirmarPedido() { crearPedido(); },

  ccObra(d) { ui.ccObra = d.f; document.getElementById('cc-results').innerHTML = resultadosCC(); document.querySelectorAll('[data-act="ccObra"]').forEach(b => b.classList.toggle('active', b.dataset.f === d.f)); },
  verPaciente(d) { ui.ccPaciente = +d.id; render(); },
  cerrarFicha() { ui.ccPaciente = null; render(); },
  guardarLlamada(d) {
    const p = paciente(d.id);
    const volver = document.getElementById('ll-volver').checked;
    const fechaVolver = document.getElementById('ll-fecha').value;
    if (volver && !fechaVolver) { toast('Elegí la fecha para volver a llamar.'); return; }
    state.llamadas.filter(l => l.pacienteId === p.id).forEach(l => { l.resuelta = true; });
    const l = {
      id: state.nextId++, pacienteId: p.id, fecha: new Date().toISOString(), operador: usuario.nombre,
      motivo: document.getElementById('ll-motivo').value, resultado: document.getElementById('ll-resultado').value,
      notas: document.getElementById('ll-notas').value.trim(), volverLlamar: volver, fechaVolver: volver ? fechaVolver : null, resuelta: false,
    };
    state.llamadas.push(l);
    registrar('Call center', `Registró llamada a ${p.nombre} ${p.apellido}: ${l.resultado}`);
    render();
    toast('Llamada registrada');
  },
};

const cambios = {
  presFecha(el) { ui.presFecha = el.value || HOY; render(); },
  asistencia(el) {
    const e = state.empleados.find(x => x.id === +el.dataset.id);
    state.asistencia[e.id].estado = el.value;
    registrar('Presentismo', `${e.nombre} (${centro(e.centroId).nombre}): ${ESTADO_EMP[el.value]}`);
    render();
  },
  notaAsistencia(el) {
    const e = state.empleados.find(x => x.id === +el.dataset.id);
    state.asistencia[e.id].nota = el.value;
    registrar('Presentismo', `Novedad de ${e.nombre}: ${el.value || '(vacía)'}`);
  },
  docPeriodo(el) { ui.docPeriodo = el.value; render(); },
  movMat(el) { ui.movMat = el.value; render(); },
  movCentro(el) { ui.movCentro = el.value; render(); },
  audUser(el) { ui.audUser = el.value; render(); },
  permiso(el) {
    const u = state.usuarios.find(x => x.id === el.dataset.user);
    const m = el.dataset.mod;
    u.modulos = el.checked ? ORDEN_MODULOS.filter(x => x === m || u.modulos.includes(x)) : u.modulos.filter(x => x !== m);
    registrar('Permisos', `${el.checked ? 'Habilitó' : 'Quitó'} ${MODULOS[m].nombre} a ${u.nombre}`);
    render();
    toast(`${u.nombre}: ${el.checked ? 'habilitado' : 'quitado'} ${MODULOS[m].nombre}`);
  },
};

const entradas = {
  presBusqueda(el) { ui.presBusqueda = el.value; document.getElementById('pres-grid').innerHTML = gridPresentismo(); },
  ccQuery(el) { ui.ccQuery = el.value; document.getElementById('cc-results').innerHTML = resultadosCC(); },
  carrito(el) {
    const m = material(el.dataset.id);
    const v = Math.max(0, parseInt(el.value, 10) || 0);
    ui.carrito[m.id] = v;
    el.classList.toggle('over', v > m.stock);
    document.getElementById(`warn-${m.id}`).textContent = warnCarrito(m);
    document.getElementById('carrito-resumen').innerHTML = resumenCarrito();
  },
};

document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (el && acciones[el.dataset.act]) acciones[el.dataset.act](el.dataset, el, e);
});
document.addEventListener('change', e => {
  const el = e.target.closest('[data-change]');
  if (el && cambios[el.dataset.change]) cambios[el.dataset.change](el);
});
document.addEventListener('input', e => {
  const el = e.target.closest('[data-input]');
  if (el && entradas[el.dataset.input]) entradas[el.dataset.input](el);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && ui.overlay) acciones.cerrar();
  if (e.key === 'Enter' && e.target.id === 'cc-search') {
    const primero = buscarPacientes()[0];
    if (primero) acciones.verPaciente({ id: primero.id });
  }
});

render();
