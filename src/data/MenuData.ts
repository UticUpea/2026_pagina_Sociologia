// src/data/menu_data.ts

export interface SubMenuItem {
   link: string;
   title: string;
}

export interface MenuItem {
   id: number;
   title: string;
   link: string;
   has_dropdown: boolean;
   sub_menus?: SubMenuItem[];
}

// ✅ MENÚ ESTÁTICO ACTUALIZADO PARA SOCIOLOGÍA (ID: 35)
const menu_data: MenuItem[] = [
   {
      id: 1,
      title: "Inicio",
      link: "/",
      has_dropdown: false,
   },
   {
      id: 3,
      title: "Carrera",
      link: "/about",
      has_dropdown: true,
      sub_menus: [
         { link: "/about", title: "Nosotros" },
         { link: "/about#historia", title: "Historia" },
         { link: "/team", title: "Autoridades" },
         { link: "/contact", title: "Contacto" },
      ],
   },
   {
      id: 4,
      title: "Académico",
      link: "#",
      has_dropdown: true,
      sub_menus: [
         { link: "/blog", title: "Convocatorias" },
         { link: "/course", title: "Gaceta Universitaria" },
         { link: "/blog-grid", title: "Cursos" },
         { link: "/publicaciones", title: "Publicaciones" },
      ],
   },
   {
      id: 2,
      title: "Enlaces",
      link: "#",
      has_dropdown: true,
      sub_menus: [
         { link: "https://virtualsociologia.upea.bo/", title: "Campus Virtual", },
         { link: "https://inscripcionessociologia.upea.bo/", title: "Inscripciones", },
         { link: "https://sociologia.upea.edu.bo/", title: "Página Web", },
      ],
   },
   {
      id: 5,
      title: "Contacto",
      link: "/contact",
      has_dropdown: false,
   },
];

export default menu_data;