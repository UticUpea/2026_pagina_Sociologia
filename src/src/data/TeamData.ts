import { StaticImageData } from "next/image";

// ✅ Imports de imágenes (reemplaza con las fotos reales de autoridades)
import teamThumb_1 from "@/assets/img/team/1.png";
import teamThumb_2 from "@/assets/img/team/2.png";
import teamThumb_3 from "@/assets/img/team/3.png";
import teamThumb_4 from "@/assets/img/team/4.png";
import teamThumb_5 from "@/assets/img/team/5.png";
import teamThumb_6 from "@/assets/img/team/6.png";

// =============================================
// INTERFACES
// =============================================
export interface TeamMember {
   id: number;
   page: string;
   thumb: StaticImageData;
   title: string;
   designation: string;
   // Campos adicionales para integración con API
   foto?: string;           // UUID de imagen en API
   nombre?: string;         // Nombre desde API
   cargo?: string;          // Cargo desde API
   celular?: string;        // Teléfono desde API
   facebook?: string;       // Red social desde API
   email?: string;          // Email desde API
}

// =============================================
// DATOS ESTÁTICOS - AUTORIDADES SOCIOLOGÍA UPEA
// =============================================
const team_data: TeamMember[] = [  // ✅ CORREGIDO: Agregado ":" y "_data"
   {
      id: 102,
      page: "home_1",
      thumb: teamThumb_1,
      title: "Dr. LIC. AURELIO  CHURA MAMANI",
      designation: "DIRECTOR/A DE CARRERA",
      foto: "/storage/imagenes/autoridades/foto_autoridad-1773776799403-841552466.webp",
      nombre: "",
      cargo: "Director/a de Carrera de Sociología",
      celular: "",
      facebook: "",
      email: "sociologia@upea.bo"
   },
   {
      id: 2,
      page: "home_1",
      thumb: teamThumb_2,
      title: "Mg. [Nombre Subdirector/a]",
      designation: "SUBDIRECTOR/A ACADÉMICO/A",
      foto: "",
      nombre: "",
      cargo: "Subdirector/a Académico/a",
      celular: "",
      facebook: "",
      email: ""
   },
   {
      id: 3,
      page: "home_1",
      thumb: teamThumb_3,
      title: "Lic. [Nombre Secretario/a]",
      designation: "SECRETARIO/A ACADÉMICO/A",
      foto: "",
      nombre: "",
      cargo: "Secretario/a Académico/a",
      celular: "",
      facebook: "",
      email: ""
   },
   {
      id: 4,
      page: "home_1",
      thumb: teamThumb_4,
      title: "Dr. [Nombre Docente]",
      designation: "DOCENTE INVESTIGADOR/A",
      foto: "",
      nombre: "",
      cargo: "Docente Investigador/a en Sociología",
      celular: "",
      facebook: "",
      email: ""
   },
   {
      id: 5,
      page: "home_1",
      thumb: teamThumb_5,
      designation: "DOCENTE DE METODOLOGÍA",
      title: "Mg. [Nombre Docente]",
      foto: "",
      nombre: "",
      cargo: "Docente de Metodología de la Investigación",
      celular: "",
      facebook: "",
      email: ""
   },
   {
      id: 6,
      page: "home_1",
      thumb: teamThumb_6,
      title: "Lic. [Nombre Coordinador/a]",
      designation: "COORDINADOR/A DE PRÁCTICAS",
      foto: "",
      nombre: "",
      cargo: "Coordinador/a de Prácticas Pre-profesionales",
      celular: "",
      facebook: "",
      email: ""
   },
];

export default team_data;  // ✅ Esto ahora funcionará correctamente