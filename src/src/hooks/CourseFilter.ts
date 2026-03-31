import course_data from "@/data/InnerCourseData";
import { useState } from "react";

interface DataType {
   itemsPerPage: number;
}

const CourseFilter = ({ itemsPerPage }: DataType) => {

   const all_course = course_data;
   
   const [itemOffset, setItemOffset] = useState(0);
   const [searchTerm, setSearchTerm] = useState("");
   
   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      setSearchTerm(e.target.value);
      setItemOffset(0); // Reset pagination when searching
   };

   // Filter courses based on search term
   const filteredCourses = all_course.filter((course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
   );

   const endOffset = itemOffset + itemsPerPage;
   const currentItems = filteredCourses.slice(itemOffset, endOffset);
   const pageCount = Math.ceil(filteredCourses.length / itemsPerPage);

   return {
      handleSearchChange,
      currentItems,
      pageCount,
   };
}

export default CourseFilter;