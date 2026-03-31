//no contien archivos que se exporten de coursedata.ts
//import course_data from "@/data/CourseData"
"use client"
import Image from "next/image"
import Link from "next/link"

const CourseArea = () => {
   // Array vacío - no mostrará ningún curso pero evitará errores
   const course_data: any[] = [];

   return (
      <div className="course-area pd-top-110 pd-bottom-90">
         <div className="container">
            <div className="section-title">
               <div className="row">
                  <div className="col-md-8 align-self-center">
                     <h2 className="title mt-0">Cursos Destacados</h2>
                  </div>
                  <div className="col-md-4 text-md-right mt-3 mt-md-0">
                     <Link className="ed-btn btn-base mt-0" href="/course" style={{ color: "#fff" }}>Ver Todos</Link>
                  </div>
               </div>
            </div>

            {/* Sección que se mostrará solo cuando haya cursos */}
            {course_data.length > 0 ? (
               <div className="row">
                  {course_data.filter((items) => items.page === "home_3").map((item) => (
                     <div key={item.id} className="col-lg-3 col-md-6">
                        {/* ... código del curso ... */}
                     </div>
                  ))}
               </div>
            ) : (
               // Mensaje cuando no hay cursos (opcional)
               <div className="text-center py-5">
                  <p>Próximamente tendremos cursos disponibles</p>
                  <Link className="ed-btn btn-base" href="/course" style={{ color: "#fff" }}>
                     Explorar Cursos
                  </Link>
               </div>
            )}
         </div>
      </div>
   )
}

export default CourseArea