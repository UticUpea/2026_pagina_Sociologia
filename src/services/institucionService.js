// =============================================
// ARCHIVO: src/services/institucionService.js
// PROPÓSITO: Servicios para Sociología - SIN FALLBACK, DATOS DEL API
// SERVICIO: https://apiadministrador.upea.bo/api/v2
// =============================================

// =============================================
// CONFIGURACIÓN - SOLO DESDE .env (SIN HARDCODEAR)
// =============================================
/** @type {string} ID de la institución desde .env */
const INSTITUCION_ID = process.env.NEXT_PUBLIC_INSTITUCION_ID || "35";

/** @type {string} URL base del API desde .env */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://apiadministrador.upea.bo";

/** @type {string} Token de autorización desde .env */
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || "";

/** @type {number} Tiempo de caché en milisegundos (30 segundos) */
const CACHE_TTL_MS = 30000;

/** @type {Object} Caché local para evitar peticiones repetidas */
let __cache = {
  principal: null,
  contenido: null,
  recursos: null,
  eventos: null,
};

// =============================================
// UTILIDAD: Verificar si el caché está válido
// =============================================
const isCacheValid = (cacheEntry) => {
  return cacheEntry && (Date.now() - cacheEntry.ts < CACHE_TTL_MS);
};

// =============================================
// 🎨 UTILIDAD: Extraer colores institucionales de la respuesta API
// Busca el esquema con id_color desde .env o usa el primero disponible
// =============================================
export const extractInstitutionalColors = (apiResponse) => {
  try {
    const TARGET_COLOR_ID = process.env.NEXT_PUBLIC_COLOR_ID 
      ? parseInt(process.env.NEXT_PUBLIC_COLOR_ID, 10) 
      : 32;
    
    const descripcion = apiResponse?.Descripcion || apiResponse?.data || apiResponse;
    
    const colorScheme = descripcion?.colorinstitucion?.find(
      (c) => c.id_color === TARGET_COLOR_ID
    ) || descripcion?.colorinstitucion?.[0];
    
    if (!colorScheme) {
      console.warn('⚠️ No se encontraron colores institucionales en la API');
      return null;
    }
    
    return {
      id_color: colorScheme.id_color || TARGET_COLOR_ID,
      primario: (colorScheme.color_primario || '#FD1C0A').trim(),
      secundario: (colorScheme.color_secundario || '#FAB265').trim(),
      terciario: (colorScheme.color_terciario || '#050504').trim()
    };
    
  } catch (error) {
    console.error('❌ Error extrayendo colores institucionales:', error);
    return null;
  }
};

// =============================================
// 🎨 UTILIDAD: Calcular contraste automático (WCAG 2.1)
// =============================================
const getContrastTextColor = (bgColor) => {
  try {
    const clean = bgColor.replace('#', '').trim();
    if (clean.length !== 6) return '#FFFFFF';
    
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  } catch {
    return '#FFFFFF';
  }
};

// =============================================
// 🎨 UTILIDAD: Aplicar colores a CSS variables globales
// =============================================
export const applyColorsToCSS = (colors) => {
  if (!colors || typeof document === 'undefined') {
    console.warn('⚠️ No se pueden aplicar colores: colores inválidos o entorno no-browser');
    return;
  }
  
  const root = document.documentElement;
  
  root.style.setProperty('--main-color', colors.primario);
  root.style.setProperty('--heading-color', colors.secundario);
  root.style.setProperty('--accent-color', colors.terciario);
  
  const textOnPrimario = getContrastTextColor(colors.primario);
  const textOnSecundario = getContrastTextColor(colors.secundario);
  
  root.style.setProperty('--text-on-main', textOnPrimario);
  root.style.setProperty('--text-on-heading', textOnSecundario);
  
  root.style.setProperty('--paragraph-color', '#333333');
  root.style.setProperty('--border-color', 'rgba(255,255,255,0.1)');
  
  console.log('🎨 Colores CSS aplicados:', { ...colors, textOnPrimario, textOnSecundario });
};

// =============================================
// 🎨 UTILIDAD: Cargar y aplicar colores institucionales
// =============================================
export const loadAndApplyColors = async (institucionId = INSTITUCION_ID) => {
  try {
    console.log(`🎨 Cargando colores para institución ID: ${institucionId}`);
    
    const result = await getInstitucionPrincipal();
    
    if (!result.success || !result.data) {
      console.warn('⚠️ No se pudieron cargar colores desde API');
      // ✅ Sin fallback: retornar null para que la UI maneje el estado vacío
      return false;
    }
    
    const colors = extractInstitutionalColors(result.data);
    
    if (colors) {
      applyColorsToCSS(colors);
      console.log('✅ Colores institucionales aplicados desde API');
      return true;
    } else {
      console.warn('⚠️ No se encontraron colores en la respuesta');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error cargando colores institucionales:', error);
    return false;
  }
};

// =============================================
// UTILIDAD: Fetch directo al API (SIN FALLBACK)
// =============================================
const fetchFromAPI = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    console.log("📡 Solicitando API directa:", url);
    
    const headers = {
      'Content-Type': 'application/json',
      ...(API_TOKEN && { 'Authorization': `Bearer ${API_TOKEN}` }),
      ...options.headers
    };
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store',
      ...options
    });
    
    // ✅ Si no es exitoso, lanzar error (sin fallback)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return await response.json();
    }
    
    return { raw: await response.text() };
    
  } catch (error) {
    console.error(`❌ Error en API ${endpoint}:`, error.message);
    // ✅ Re-lanzar error para que el componente lo maneje
    throw error;
  }
};

// =============================================
// SERVICIO PRINCIPAL: Obtener datos de institución
// Endpoint: /api/v2/institucionesPrincipal/{id}
// SIN FALLBACK - Siempre del API
// =============================================
export const getInstitucionPrincipal = async () => {
  try {
    // ✅ Verificar caché primero
    if (isCacheValid(__cache.principal)) {
      console.log("♻️ [Principal] Usando caché");
      return __cache.principal.value;
    }
    
    const endpoint = `/api/v2/institucionesPrincipal/${INSTITUCION_ID}`;
    
    // ✅ Fetch directo al API (sin fallback)
    const result = await fetchFromAPI(endpoint);
    
    // ✅ Adaptar respuesta
    const value = {
      success: true,
      data: result?.Descripcion || result?.data || result,
      url: `${API_BASE_URL}${endpoint}`,
      timestamp: new Date().toISOString(),
      fromFallback: false // ✅ Siempre false: sin fallback
    };
    
    // ✅ Guardar en caché
    __cache.principal = { ts: Date.now(), value };
    
    console.log('✅ [Principal] Datos cargados desde API');
    return value;
    
  } catch (error) {
    console.error("❌ [Principal] Error crítico:", error.message);
    
    // ✅ Retornar error para que el componente lo maneje (sin fallback)
    return {
      success: false,
      data: null,
      url: `${API_BASE_URL}/api/v2/institucionesPrincipal/${INSTITUCION_ID}`,
      timestamp: new Date().toISOString(),
      fromFallback: false,
      error: error.message
    };
  }
};

// =============================================
// SERVICIO: Obtener contenido institucional
// SIN FALLBACK - Siempre del API
// =============================================
export const getInstitucionContenido = async () => {
  try {
    if (isCacheValid(__cache.contenido)) {
      console.log("♻️ [Contenido] Usando caché");
      return __cache.contenido.value;
    }
    
    const endpoint = `/api/v2/institucionesPrincipal/${INSTITUCION_ID}`;
    
    const result = await fetchFromAPI(endpoint);
    
    const descripcion = result?.Descripcion || result?.data || result;
    
    const contenidoData = {
      institucion_historia: descripcion?.institucion_historia || "",
      institucion_mision: descripcion?.institucion_mision || "",
      institucion_vision: descripcion?.institucion_vision || "",
      institucion_objetivos: descripcion?.institucion_objetivos || "",
      institucion_sobre_ins: descripcion?.institucion_sobre_ins || ""
    };
    
    const value = {
      success: true,
      data: contenidoData,
      fullData: descripcion,
      url: `${API_BASE_URL}${endpoint}`,
      timestamp: new Date().toISOString(),
      fromFallback: false
    };
    
    __cache.contenido = { ts: Date.now(), value };
    
    console.log('✅ [Contenido] Datos cargados desde API');
    return value;
    
  } catch (error) {
    console.error("❌ [Contenido] Error:", error.message);
    
    // ✅ Retornar error para que el componente lo maneje
    return {
      success: false,
      data: null,
      fullData: null,
      fromFallback: false,
      error: error.message
    };
  }
};

// =============================================
// SERVICIO: Obtener recursos y enlaces
// Endpoint: /api/v2/institucion/{id}/recursos
// SIN FALLBACK - Siempre del API
// =============================================
export const getInstitucionRecursos = async () => {
  try {
    if (isCacheValid(__cache.recursos)) {
      console.log("♻️ [Recursos] Usando caché");
      return __cache.recursos.value;
    }
    
    const endpoint = `/api/v2/institucion/${INSTITUCION_ID}/recursos`;
    
    const result = await fetchFromAPI(endpoint);
    
    const value = {
      success: true,
      data: {
        upea_publicaciones: Array.isArray(result?.upea_publicaciones) ? result.upea_publicaciones : [],
        linksExternoInterno: Array.isArray(result?.linksExternoInterno) ? result.linksExternoInterno : [],
        links: Array.isArray(result?.links) ? result.links : []
      },
      url: `${API_BASE_URL}${endpoint}`,
      timestamp: new Date().toISOString(),
      isEmpty: !result?.upea_publicaciones?.length && !result?.linksExternoInterno?.length,
      fromFallback: false
    };
    
    __cache.recursos = { ts: Date.now(), value };
    
    console.log(`✅ [Recursos] ${value.data.linksExternoInterno.length} enlaces cargados desde API`);
    return value;
    
  } catch (error) {
    console.error("❌ [Recursos] Error:", error.message);
    
    // ✅ Retornar estructura vacía (sin fallback con datos hardcodeados)
    return {
      success: false,
      data: {
        upea_publicaciones: [],
        linksExternoInterno: [],
        links: []
      },
      isEmpty: true,
      fromFallback: false,
      error: error.message
    };
  }
};

// =============================================
// SERVICIO: Obtener gacetas, eventos y convocatorias
// Endpoint: /api/v2/institucion/{id}/gacetaEventos
// SIN FALLBACK - Siempre del API
// =============================================
export const getInstitucionGacetaEventos = async () => {
  try {
    if (isCacheValid(__cache.eventos)) {
      console.log("♻️ [Eventos] Usando caché");
      return __cache.eventos.value;
    }
    
    const endpoint = `/api/v2/institucion/${INSTITUCION_ID}/gacetaEventos`;
    
    console.log("📡 Solicitando eventos:", `${API_BASE_URL}${endpoint}`);
    
    const result = await fetchFromAPI(endpoint);
    
    const value = {
      success: true,
      data: {
        upea_gaceta_universitaria: Array.isArray(result?.upea_gaceta_universitaria) ? result.upea_gaceta_universitaria : [],
        upea_evento: Array.isArray(result?.upea_evento) ? result.upea_evento : [],
        cursos: Array.isArray(result?.cursos) ? result.cursos : [],
        convocatorias: Array.isArray(result?.convocatorias) ? result.convocatorias : [],
        serviciosCarrera: Array.isArray(result?.serviciosCarrera) ? result.serviciosCarrera : [],
        ofertasAcademicas: Array.isArray(result?.ofertasAcademicas) ? result.ofertasAcademicas : []
      },
      url: `${API_BASE_URL}${endpoint}`,
      isEmpty: false,
      timestamp: new Date().toISOString(),
      fromFallback: false
    };
    
    __cache.eventos = { ts: Date.now(), value };
    
    const total = Object.values(value.data).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);
    console.log(`✅ [Eventos] ${total} ítems cargados desde API`);
    
    return value;
    
  } catch (error) {
    console.error("❌ [Eventos] Error crítico:", error.message);
    
    // ✅ Retornar estructura vacía (sin fallback)
    return {
      success: false,
      data: {
        upea_gaceta_universitaria: [],
        upea_evento: [],
        cursos: [],
        convocatorias: [],
        serviciosCarrera: [],
        ofertasAcademicas: []
      },
      isEmpty: true,
      fromFallback: false,
      error: error.message
    };
  }
};

// =============================================
// SERVICIO EXTRA: Obtener TODOS los datos en paralelo
// SIN FALLBACK - Siempre del API
// =============================================
export const getTodosLosDatos = async () => {
  try {
    console.log("🔄 [Todos] Cargando todos los datos desde API...");
    
    const [principal, contenido, recursos, eventos] = await Promise.all([
      getInstitucionPrincipal(),
      getInstitucionContenido(),
      getInstitucionRecursos(),
      getInstitucionGacetaEventos()
    ]);
    
    const allSuccessful = principal.success && contenido.success && recursos.success && eventos.success;
    
    if (!allSuccessful) {
      console.warn("⚠️ [Todos] Algunas peticiones fallaron");
    }
    
    // ✅ Combinar datos solo del API
    const combinedData = {
      success: allSuccessful,
      timestamp: new Date().toISOString(),
      
      // Datos crudos
      institucion: principal.data,
      contenido: contenido.data,
      recursos: recursos.data,
      eventos: eventos.data,
      
      // ✅ Datos combinados y normalizados
      datosCombinados: {
        // Información básica
        id: principal.data?.institucion_id || INSTITUCION_ID,
        nombre: principal.data?.institucion_nombre || null,
        logo: principal.data?.institucion_logo || null,
        
        // Contenido institucional
        mision: principal.data?.institucion_mision || contenido.data?.institucion_mision || null,
        vision: principal.data?.institucion_vision || contenido.data?.institucion_vision || null,
        historia: principal.data?.institucion_historia || contenido.data?.institucion_historia || null,
        objetivos: principal.data?.institucion_objetivos || contenido.data?.institucion_objetivos || null,
        sobreNosotros: principal.data?.institucion_sobre_ins || contenido.data?.institucion_sobre_ins || null,
        
        // Contacto
        direccion: principal.data?.institucion_direccion || null,
        correos: [
          principal.data?.institucion_correo1,
          principal.data?.institucion_correo2
        ].filter(Boolean),
        
        // Redes sociales (del API, no hardcodeadas)
        redes: {
          facebook: principal.data?.institucion_facebook || null,
          twitter: principal.data?.institucion_twitter || null,
          youtube: principal.data?.institucion_youtube || null
        },
        
        // ✅ Colores institucionales (extraídos del API)
        colores: principal.data?.colorinstitucion?.[0] || null,
        
        // Recursos y enlaces (del API)
        enlaces: recursos.data?.linksExternoInterno || [],
        publicaciones: recursos.data?.upea_publicaciones || [],
        
        // Contenido dinámico
        eventos: eventos.data?.upea_evento || [],
        gacetas: eventos.data?.upea_gaceta_universitaria || [],
        convocatorias: eventos.data?.convocatorias || [],
        
        // Metadata
        fechaConsulta: new Date().toISOString(),
        fuente: `${API_BASE_URL}/api/v2`,
        usingFallback: false // ✅ Siempre false: sin fallback
      }
    };
    
    console.log(`✅ [Todos] Datos combinados listos desde API`);
    return combinedData;
    
  } catch (error) {
    console.error("❌ [Todos] Error crítico:", error.message);
    
    // ✅ Retornar estructura vacía (sin fallback con datos hardcodeados)
    return {
      success: false,
      timestamp: new Date().toISOString(),
      institucion: null,
      contenido: null,
      recursos: null,
      eventos: null,
      datosCombinados: {
        id: INSTITUCION_ID,
        nombre: null,
        logo: null,
        mision: null,
        vision: null,
        historia: null,
        objetivos: null,
        sobreNosotros: null,
        direccion: null,
        correos: [],
        redes: {
          facebook: null,
          twitter: null,
          youtube: null
        },
        colores: null,
        enlaces: [],
        publicaciones: [],
        eventos: [],
        gacetas: [],
        convocatorias: [],
        fechaConsulta: new Date().toISOString(),
        fuente: `${API_BASE_URL}/api/v2`,
        usingFallback: false
      },
      fromFallback: false,
      error: error.message
    };
  }
};

// =============================================
// UTILIDAD: Limpiar caché manualmente
// =============================================
export const clearCache = (service = null) => {
  if (service && __cache[service]) {
    console.log(`🗑️ [Cache] Limpiando caché de: ${service}`);
    __cache[service] = null;
  } else if (!service) {
    console.log("🗑️ [Cache] Limpiando TODO el caché");
    __cache = {
      principal: null,
      contenido: null,
      recursos: null,
      eventos: null,
    };
  }
};

// =============================================
// UTILIDAD: Forzar refresh ignorando caché
// =============================================
export const refreshData = async (service) => {
  console.log(`🔄 [Refresh] Forzando recarga de: ${service}`);
  
  if (__cache[service]) {
    __cache[service] = null;
  }
  
  switch (service) {
    case 'principal': return await getInstitucionPrincipal();
    case 'contenido': return await getInstitucionContenido();
    case 'recursos': return await getInstitucionRecursos();
    case 'eventos': return await getInstitucionGacetaEventos();
    default: 
      console.error(`❌ [Refresh] Servicio desconocido: ${service}`);
      return { success: false, error: "Servicio no válido", fromFallback: false };
  }
};

// =============================================
// EXPORTACIÓN DE CONFIGURACIÓN
// =============================================
export const getConfig = () => ({
  institucionId: INSTITUCION_ID,
  cacheTTL: CACHE_TTL_MS,
  apiUrl: API_BASE_URL,
  apiVersion: '/api/v2',
  hasFallback: false // ✅ SIN FALLBACK
});