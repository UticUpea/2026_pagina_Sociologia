// =============================================
// ARCHIVO: src/services/institucionService.js
// PROPÓSITO: Servicios con fallback automático y gestión de colores institucionales
// SERVICIO: https://apiadministrador.upea.bo/api/v2
// INSTITUCIÓN: Sociología - ID: 35
// =============================================

// =============================================
// CONFIGURACIÓN BASE
// =============================================
/** @type {string} ID de la institución (Sociología) */
const INSTITUCION_ID = process.env.NEXT_PUBLIC_API_INSTITUCION || "35";

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
// 🛡️ DATOS DE FALLBACK PARA SOCIOLOGÍA (ID: 35)
// Se usan cuando la API falla o retorna 403/404
// =============================================
const FALLBACK_DATA = {
  // Datos principales de la institución
  Descripcion: {
    institucion_id: 35,
    institucion_nombre: "SOCIOLOGÍA",
    institucion_iniciales: "SOC",
    institucion_nombre_iniciales: "sociologia",
    institucion_logo: "fa3a79f9-27a7-4e9e-9d7c-f0ca2fde6105.png",
    institucion_historia: "<p>La Carrera de Sociología de la UPEA forma profesionales investigadores sociales capaces de analizar e interpretar científicamente la realidad social...</p>",
    institucion_mision: "<p>El profesional sociólogo de la UPEA es fundamentalmente investigador social, capaz de explicar, analizar, comparar e interpretar científicamente la realidad social...</p>",
    institucion_vision: "<p>La Carrera de Sociología contribuirá en la construcción de una nueva sociedad soberana, autosuficiente y libre...</p>",
    institucion_facebook: "https://www.facebook.com/Ingenieriadesistemasupeafuturo/",
    institucion_youtube: "#",
    institucion_twitter: "#",
    institucion_direccion: "Av. Sucre Z. Villa Esperanza, Campus UPEA Bloque D 2",
    institucion_celular1: "",
    institucion_celular2: "",
    institucion_telefono1: "",
    institucion_telefono2: "",
    institucion_correo1: "sociologia@upea.bo",
    institucion_correo2: "",
    institucion_api_google_map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.678553338397!2d-68.19589318451965!3d-16.491806444888784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x915ede3378ea9d6d%3A0x26cac4a2caefcb29!2sUniversidad%20P%C3%BAblica%20de%20El%20Alto!5e0!3m2!1ses!2sbo!4v1621349240107!5m2!1ses!2sbo",
    institucion_objetivos: "<p>Formar investigadores sociales y planificadores de gestión social para el desarrollo...</p>",
    institucion_sobre_ins: "<p><strong>PERFIL PROFESIONAL</strong></p><p>El profesional sociólogo de la UPEA es fundamentalmente investigador social...</p>",
    institucion_link_video_vision: "",
    // ✅ COLORES INSTITUCIONALES - ID: 32
    colorinstitucion: [{
      id_color: 32,
      color_primario: "#FD1C0A",
      color_secundario: "#FAB265",
      color_terciario: "#050504"
    }]
  },
  
  // Recursos y enlaces
  recursos: {
    upea_publicaciones: [],
    linksExternoInterno: [
      {
        id_link: 79,
        imagen: "83be86f3-5a78-4d72-ac09-a0590c616953.png",
        nombre: "Campus Virtual",
        url_link: "https://virtualsociologia.upea.bo/",
        estado: 1,
        tipo: "CAMPUS VIRTUAL"
      },
      {
        id_link: 80,
        imagen: "c79a8b62-7efc-409f-b54f-93b19a3c4260.png",
        nombre: "Inscripciones",
        url_link: "https://inscripcionessociologia.upea.bo/",
        estado: 1,
        tipo: "INSCRIPCIONES"
      },
      {
        id_link: 156,
        imagen: "a27b0ebd-e60b-4dbe-9438-3d83f9e90b15.png",
        nombre: "Página Web",
        url_link: "https://sociologia.upea.edu.bo/",
        estado: 1,
        tipo: "PAGINA WEB"
      }
    ],
    links: []
  },
  
  // Eventos, gacetas y convocatorias (vacíos por defecto)
  eventos: {
    upea_gaceta_universitaria: [],
    upea_evento: [],
    cursos: [],
    convocatorias: [],
    serviciosCarrera: [],
    ofertasAcademicas: []
  }
};

// =============================================
// UTILIDAD: Verificar si el caché está válido
// =============================================
const isCacheValid = (cacheEntry) => {
  return cacheEntry && (Date.now() - cacheEntry.ts < CACHE_TTL_MS);
};

// =============================================
// 🎨 UTILIDAD: Extraer colores institucionales de la respuesta API
// Busca el esquema con id_color: 32 o usa el primero disponible
// =============================================
export const extractInstitutionalColors = (apiResponse) => {
  try {
    // Acceso seguro a la estructura de la API
    const descripcion = apiResponse?.Descripcion || apiResponse?.data || apiResponse;
    
    // Buscar esquema de colores por id_color: 32 o usar el primero disponible
    const colorScheme = descripcion?.colorinstitucion?.find(
      (c) => c.id_color === 32
    ) || descripcion?.colorinstitucion?.[0];
    
    if (!colorScheme) {
      console.warn('⚠️ No se encontraron colores institucionales en la API');
      return null;
    }
    
    // Retornar colores limpios (sin espacios) y validados
    return {
      id_color: colorScheme.id_color || 32,
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
// Retorna '#000000' para fondos claros, '#FFFFFF' para oscuros
// =============================================
const getContrastTextColor = (bgColor) => {
  try {
    const clean = bgColor.replace('#', '').trim();
    if (clean.length !== 6) return '#FFFFFF';
    
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    
    // Fórmula de luminosidad percibida (WCAG 2.1)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Texto oscuro sobre fondo claro, texto claro sobre fondo oscuro
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  } catch {
    return '#FFFFFF'; // Fallback seguro
  }
};

// =============================================
// 🎨 UTILIDAD: Aplicar colores a CSS variables globales
// Estas variables están disponibles en TODA la aplicación
// =============================================
export const applyColorsToCSS = (colors) => {
  if (!colors || typeof document === 'undefined') {
    console.warn('⚠️ No se pueden aplicar colores: colores inválidos o entorno no-browser');
    return;
  }
  
  const root = document.documentElement;
  
  // Variables CSS principales
  root.style.setProperty('--main-color', colors.primario);
  root.style.setProperty('--heading-color', colors.secundario);
  root.style.setProperty('--accent-color', colors.terciario);
  
  // Calcular y aplicar contraste automático
  const textOnPrimario = getContrastTextColor(colors.primario);
  const textOnSecundario = getContrastTextColor(colors.secundario);
  
  root.style.setProperty('--text-on-main', textOnPrimario);
  root.style.setProperty('--text-on-heading', textOnSecundario);
  
  // Variables adicionales
  root.style.setProperty('--paragraph-color', '#333333');
  root.style.setProperty('--border-color', 'rgba(255,255,255,0.1)');
  
  console.log('🎨 Colores CSS aplicados:', {
    ...colors,
    textOnPrimario,
    textOnSecundario
  });
};

// =============================================
// 🎨 UTILIDAD: Cargar y aplicar colores institucionales
// Función completa que extrae de la API y aplica a CSS
// =============================================
export const loadAndApplyColors = async (institucionId = INSTITUCION_ID) => {
  try {
    console.log(`🎨 Cargando colores para institución ID: ${institucionId}`);
    
    // Obtener datos de la institución
    const result = await getInstitucionPrincipal();
    
    if (!result.success || !result.data) {
      console.warn('⚠️ No se pudieron cargar colores desde API, usando fallback');
      applyColorsToCSS({
        primario: '#FD1C0A',
        secundario: '#FAB265',
        terciario: '#050504'
      });
      return false;
    }
    
    // Extraer colores de la respuesta
    const colors = extractInstitutionalColors(result.data);
    
    if (colors) {
      applyColorsToCSS(colors);
      console.log('✅ Colores institucionales aplicados desde API');
      return true;
    } else {
      console.warn('⚠️ No se encontraron colores en la respuesta, usando fallback');
      applyColorsToCSS({
        primario: '#FD1C0A',
        secundario: '#FAB265',
        terciario: '#050504'
      });
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error cargando colores institucionales:', error);
    // Fallback seguro
    applyColorsToCSS({
      primario: '#FD1C0A',
      secundario: '#FAB265',
      terciario: '#050504'
    });
    return false;
  }
};

// =============================================
// UTILIDAD: Fetch con fallback automático
// =============================================
const fetchWithFallback = async (url, fallbackKey = null, options = {}) => {
  try {
    console.log("📡 Solicitando (API Route):", url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      cache: 'no-store',
      ...options
    });
    
    // ✅ Si la respuesta no es exitosa, retornar fallback
    if (!response.ok) {
      console.warn(`⚠️ [Fallback] ${response.status} en ${url}, usando datos estáticos`);
      
      if (fallbackKey && FALLBACK_DATA[fallbackKey]) {
        return FALLBACK_DATA[fallbackKey];
      }
      return FALLBACK_DATA.Descripcion; // Fallback por defecto
    }
    
    // ✅ Respuesta exitosa, parsear JSON
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return await response.json();
    }
    return { raw: await response.text() };
    
  } catch (error) {
    console.error(`❌ [Fallback] Error en ${url}:`, error.message);
    
    // ✅ Retornar fallback en caso de error de red o parseo
    if (fallbackKey && FALLBACK_DATA[fallbackKey]) {
      return FALLBACK_DATA[fallbackKey];
    }
    return FALLBACK_DATA.Descripcion;
  }
};

// =============================================
// SERVICIO PRINCIPAL: Obtener datos de institución
// Endpoint: /api/v2/institucionesPrincipal/{id}
// =============================================
export const getInstitucionPrincipal = async () => {
  try {
    // ✅ Verificar caché primero
    if (isCacheValid(__cache.principal)) {
      console.log("♻️ [Principal] Usando caché");
      return __cache.principal.value;
    }
    
    const path = `institucionesPrincipal/${INSTITUCION_ID}`;
    const url = `/api/institucion?path=${encodeURIComponent(path)}`;
    
    // ✅ Usar fetch con fallback automático
    const result = await fetchWithFallback(url, 'Descripcion');
    
    // ✅ Adaptar respuesta: la API retorna { Descripcion: {...} }
    const value = {
      success: true,
      data: result?.Descripcion || result?.data || result || FALLBACK_DATA.Descripcion,
      url: url,
      timestamp: new Date().toISOString(),
      fromFallback: !result?.Descripcion && !result?.data // Indicador de fallback
    };
    
    // ✅ Guardar en caché
    __cache.principal = { ts: Date.now(), value };
    
    console.log(`✅ [Principal] Datos cargados ${value.fromFallback ? '(fallback)' : '(API)'}`);
    return value;
    
  } catch (error) {
    console.error("❌ [Principal] Error crítico:", error.message);
    
    // ✅ Retornar fallback garantizado para no romper UI
    return {
      success: true, // No propagar error a la UI
      data: FALLBACK_DATA.Descripcion,
      url: `/api/institucion?path=institucionesPrincipal/${INSTITUCION_ID}`,
      timestamp: new Date().toISOString(),
      fromFallback: true,
      error: error.message
    };
  }
};

// =============================================
// SERVICIO: Obtener contenido institucional
// =============================================
export const getInstitucionContenido = async () => {
  try {
    if (isCacheValid(__cache.contenido)) {
      console.log("♻️ [Contenido] Usando caché");
      return __cache.contenido.value;
    }
    
    const path = `institucionesPrincipal/${INSTITUCION_ID}`;
    const url = `/api/institucion?path=${encodeURIComponent(path)}`;
    
    const result = await fetchWithFallback(url, 'Descripcion');
    
    const descripcion = result?.Descripcion || result?.data || result || FALLBACK_DATA.Descripcion;
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
      url: url,
      timestamp: new Date().toISOString(),
      fromFallback: !result?.Descripcion && !result?.data
    };
    
    __cache.contenido = { ts: Date.now(), value };
    
    console.log(`✅ [Contenido] Datos cargados ${value.fromFallback ? '(fallback)' : '(API)'}`);
    return value;
    
  } catch (error) {
    console.error("❌ [Contenido] Error:", error.message);
    
    return {
      success: true,
      data: {
        institucion_historia: FALLBACK_DATA.Descripcion.institucion_historia,
        institucion_mision: FALLBACK_DATA.Descripcion.institucion_mision,
        institucion_vision: FALLBACK_DATA.Descripcion.institucion_vision,
        institucion_objetivos: FALLBACK_DATA.Descripcion.institucion_objetivos,
        institucion_sobre_ins: FALLBACK_DATA.Descripcion.institucion_sobre_ins
      },
      fullData: FALLBACK_DATA.Descripcion,
      fromFallback: true,
      error: error.message
    };
  }
};

// =============================================
// SERVICIO: Obtener recursos y enlaces
// Endpoint: /api/v2/institucion/{id}/recursos
// =============================================
export const getInstitucionRecursos = async () => {
  try {
    if (isCacheValid(__cache.recursos)) {
      console.log("♻️ [Recursos] Usando caché");
      return __cache.recursos.value;
    }
    
    const path = `institucion/${INSTITUCION_ID}/recursos`;
    const url = `/api/institucion?path=${encodeURIComponent(path)}`;
    
    // ✅ Fetch con fallback a FALLBACK_DATA.recursos
    const result = await fetchWithFallback(url, 'recursos');
    
    const value = {
      success: true,
      data: {
        upea_publicaciones: Array.isArray(result?.upea_publicaciones) ? result.upea_publicaciones : [],
        linksExternoInterno: Array.isArray(result?.linksExternoInterno) ? result.linksExternoInterno : (FALLBACK_DATA.recursos?.linksExternoInterno || []),
        links: Array.isArray(result?.links) ? result.links : []
      },
      url: url,
      timestamp: new Date().toISOString(),
      isEmpty: !result?.upea_publicaciones?.length && !result?.linksExternoInterno?.length,
      fromFallback: !result?.upea_publicaciones && !result?.linksExternoInterno
    };
    
    __cache.recursos = { ts: Date.now(), value };
    
    console.log(`✅ [Recursos] ${value.data.linksExternoInterno.length} enlaces cargados ${value.fromFallback ? '(fallback)' : '(API)'}`);
    return value;
    
  } catch (error) {
    console.error("❌ [Recursos] Error:", error.message);
    
    // ✅ Retornar estructura vacía o fallback con enlaces estáticos
    return {
      success: true,
      data: FALLBACK_DATA.recursos,
      isEmpty: false, // Los enlaces de fallback sí tienen datos
      fromFallback: true,
      error: error.message
    };
  }
};

// =============================================
// SERVICIO: Obtener gacetas, eventos y convocatorias
// Endpoint: /api/v2/institucion/{id}/gacetaEventos
// =============================================
export const getInstitucionGacetaEventos = async () => {
  try {
    if (isCacheValid(__cache.eventos)) {
      console.log("♻️ [Eventos] Usando caché");
      return __cache.eventos.value;
    }
    
    const path = `institucion/${INSTITUCION_ID}/gacetaEventos`;
    const url = `/api/institucion?path=${encodeURIComponent(path)}`;
    
    console.log("📡 Solicitando eventos:", url);
    
    // ✅ Fetch directo porque este endpoint maneja 404 como "sin datos"
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    });
    
    // 📌 CASO ESPECIAL: 404 es "sin datos", no error crítico
    if (!response.ok) {
      console.log("ℹ️ [Eventos] Sin datos disponibles (404 esperado), usando fallback vacío");
      
      const emptyStructure = FALLBACK_DATA.eventos;
      
      const value = {
        success: true,
        data: emptyStructure,
        url: url,
        isEmpty: true,
        statusCode: response.status,
        timestamp: new Date().toISOString(),
        fromFallback: true
      };
      
      __cache.eventos = { ts: Date.now(), value };
      return value;
    }
    
    // ✅ Procesar respuesta exitosa
    const result = await response.json();
    
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
      url: url,
      isEmpty: false,
      timestamp: new Date().toISOString(),
      fromFallback: false
    };
    
    __cache.eventos = { ts: Date.now(), value };
    
    const total = Object.values(value.data).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);
    console.log(`✅ [Eventos] ${total} ítems cargados ${value.fromFallback ? '(fallback)' : '(API)'}`);
    
    return value;
    
  } catch (error) {
    console.error("❌ [Eventos] Error crítico:", error.message);
    
    // ✅ Fallback seguro: estructura vacía
    return {
      success: true,
      data: FALLBACK_DATA.eventos,
      isEmpty: true,
      fromFallback: true,
      error: error.message
    };
  }
};

// =============================================
// SERVICIO EXTRA: Obtener TODOS los datos en paralelo
// =============================================
export const getTodosLosDatos = async () => {
  try {
    console.log("🔄 [Todos] Cargando todos los datos en paralelo...");
    
    const [principal, contenido, recursos, eventos] = await Promise.all([
      getInstitucionPrincipal(),
      getInstitucionContenido(),
      getInstitucionRecursos(),
      getInstitucionGacetaEventos()
    ]);
    
    const allSuccessful = principal.success && contenido.success && recursos.success && eventos.success;
    
    if (!allSuccessful) {
      console.warn("⚠️ [Todos] Algunas peticiones usaron fallback");
    }
    
    // ✅ Combinar datos con prioridad: API > Fallback
    const combinedData = {
      success: allSuccessful,
      timestamp: new Date().toISOString(),
      
      // Datos crudos con indicador de fallback
      institucion: principal.data,
      contenido: contenido.data,
      recursos: recursos.data,
      eventos: eventos.data,
      
      // ✅ Datos combinados y normalizados
      datosCombinados: {
        // Información básica
        id: principal.data?.institucion_id || INSTITUCION_ID,
        nombre: principal.data?.institucion_nombre || "Sociología",
        logo: principal.data?.institucion_logo || null,
        
        // Contenido institucional
        mision: principal.data?.institucion_mision || contenido.data?.institucion_mision || FALLBACK_DATA.Descripcion.institucion_mision,
        vision: principal.data?.institucion_vision || contenido.data?.institucion_vision || FALLBACK_DATA.Descripcion.institucion_vision,
        historia: principal.data?.institucion_historia || contenido.data?.institucion_historia || FALLBACK_DATA.Descripcion.institucion_historia,
        objetivos: principal.data?.institucion_objetivos || contenido.data?.institucion_objetivos || FALLBACK_DATA.Descripcion.institucion_objetivos,
        sobreNosotros: principal.data?.institucion_sobre_ins || contenido.data?.institucion_sobre_ins || FALLBACK_DATA.Descripcion.institucion_sobre_ins,
        
        // Contacto
        direccion: principal.data?.institucion_direccion || FALLBACK_DATA.Descripcion.institucion_direccion,
        correos: [
          principal.data?.institucion_correo1,
          principal.data?.institucion_correo2
        ].filter(Boolean).length > 0 
          ? [principal.data?.institucion_correo1, principal.data?.institucion_correo2].filter(Boolean)
          : [FALLBACK_DATA.Descripcion.institucion_correo1],
        
        // Redes sociales
        redes: {
          facebook: principal.data?.institucion_facebook || FALLBACK_DATA.Descripcion.institucion_facebook,
          twitter: principal.data?.institucion_twitter || FALLBACK_DATA.Descripcion.institucion_twitter,
          youtube: principal.data?.institucion_youtube || FALLBACK_DATA.Descripcion.institucion_youtube
        },
        
        // ✅ Colores institucionales (extraídos y aplicados)
        colores: principal.data?.colorinstitucion?.[0] || FALLBACK_DATA.Descripcion.colorinstitucion[0],
        
        // Recursos y enlaces (con fallback)
        enlaces: recursos.data?.linksExternoInterno?.length > 0 
          ? recursos.data.linksExternoInterno 
          : FALLBACK_DATA.recursos.linksExternoInterno,
        publicaciones: recursos.data?.upea_publicaciones || [],
        
        // Contenido dinámico
        eventos: eventos.data?.upea_evento || [],
        gacetas: eventos.data?.upea_gaceta_universitaria || [],
        convocatorias: eventos.data?.convocatorias || [],
        
        // Metadata
        fechaConsulta: new Date().toISOString(),
        fuente: "apiadministrador.upea.bo/api/v2",
        usingFallback: principal.fromFallback || contenido.fromFallback || recursos.fromFallback || eventos.fromFallback
      }
    };
    
    console.log(`✅ [Todos] Datos combinados listos ${combinedData.datosCombinados.usingFallback ? '(con fallback)' : '(API completa)'}`);
    return combinedData;
    
  } catch (error) {
    console.error("❌ [Todos] Error crítico:", error.message);
    
    // ✅ Retornar TODO desde fallback en caso de error catastrófico
    return {
      success: true, // No romper la app
      timestamp: new Date().toISOString(),
      institucion: FALLBACK_DATA.Descripcion,
      contenido: {
        institucion_historia: FALLBACK_DATA.Descripcion.institucion_historia,
        institucion_mision: FALLBACK_DATA.Descripcion.institucion_mision,
        institucion_vision: FALLBACK_DATA.Descripcion.institucion_vision,
        institucion_objetivos: FALLBACK_DATA.Descripcion.institucion_objetivos,
        institucion_sobre_ins: FALLBACK_DATA.Descripcion.institucion_sobre_ins
      },
      recursos: FALLBACK_DATA.recursos,
      eventos: FALLBACK_DATA.eventos,
      datosCombinados: {
        id: INSTITUCION_ID,
        nombre: "Sociología",
        logo: FALLBACK_DATA.Descripcion.institucion_logo,
        mision: FALLBACK_DATA.Descripcion.institucion_mision,
        vision: FALLBACK_DATA.Descripcion.institucion_vision,
        historia: FALLBACK_DATA.Descripcion.institucion_historia,
        objetivos: FALLBACK_DATA.Descripcion.institucion_objetivos,
        sobreNosotros: FALLBACK_DATA.Descripcion.institucion_sobre_ins,
        direccion: FALLBACK_DATA.Descripcion.institucion_direccion,
        correos: [FALLBACK_DATA.Descripcion.institucion_correo1],
        redes: {
          facebook: FALLBACK_DATA.Descripcion.institucion_facebook,
          twitter: FALLBACK_DATA.Descripcion.institucion_twitter,
          youtube: FALLBACK_DATA.Descripcion.institucion_youtube
        },
        colores: FALLBACK_DATA.Descripcion.colorinstitucion[0],
        enlaces: FALLBACK_DATA.recursos.linksExternoInterno,
        publicaciones: [],
        eventos: [],
        gacetas: [],
        convocatorias: [],
        fechaConsulta: new Date().toISOString(),
        fuente: "fallback",
        usingFallback: true
      },
      fromFallback: true,
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
  apiUrl: (process.env.NEXT_APP_API_URL_V1 || 'https://apiadministrador.upea.bo').replace(/\/+$/, ''),
  apiVersion: '/api/v2',
  hasFallback: true
});