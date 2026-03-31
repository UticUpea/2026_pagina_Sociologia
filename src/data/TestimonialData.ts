import { StaticImageData } from "next/image";

import authorImg_1 from "@/assets/img/logo sociologia2.png";
import authorImg_2 from "@/assets/img/logo-artes-foother.png";

interface DataType {
   id: number;
   page: string;
   desc: string;
   author_img: StaticImageData;
   author_name: string;
   designation: string;
}[];

const testi_data: DataType[] = [
   {
      id: 1,
      page: "home_1",
      desc: "Debe ser una persona introspectiva, metódica, racional, curiosa, analítica y lógica, debido a que su labor requiere de mucha investigación y aplicación de teorías. ",
      author_img: authorImg_1,
      author_name: "PERFIL PROFESIONAL",
      designation: "Sociología",
   },
   {
      id: 2,
      page: "home_1",
      desc: "Tener habilidades investigativas, ya que debe estudiar las relaciones sociales, las estructuras e instituciones, para así poder proponer soluciones a los problemas que presente la sociedad ",
      author_img: authorImg_2,
      author_name: "PERFIL PROFESIONAL",
      designation: "Sociología",
   },

   // home_2

   /* {
      id: 1,
      page: "home_2",
      desc: "Lorem ipsum dolor sit amet, consect etur adipiscing elit. Duis at est id leo luctus gravida a in ipsum.",
      author_img: authorImg_1,
      author_name: "VISIÓN",
      designation: "Tincidunt",
   },
   {
      id: 2,
      page: "home_2",
      desc: "Lorem ipsum dolor sit amet, consect etur adipiscing elit. Duis at est id leo luctus gravida a in ipsum.",
      author_img: authorImg_2,
      author_name: "OBJETIVOS",
      designation: "Nulla nec",
   },
   {
      id: 3,
      page: "home_2",
      desc: "Lorem ipsum dolor sit amet, consect etur adipiscing elit. Duis at est id leo luctus gravida a in ipsum.",
      author_img: authorImg_1,
      author_name: "OBJETIVOS",
      designation: "Tincidunt",
   },
   {
      id: 4,
      page: "home_2",
      desc: "Lorem ipsum dolor sit amet, consect etur adipiscing elit. Duis at est id leo luctus gravida a in ipsum.",
      author_img: authorImg_2,
      author_name: "MISIÓN",
      designation: "Nulla nec",
   }, */

   // home_3

   {
      id: 1,
      page: "home_3",
      desc: "Lorem ipsum dolor sit amet, elitr, sed diam volu sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat",
      author_img: authorImg_1,
      author_name: "Eugene Freeman",
      designation: "Tincidunt",
   },
   {
      id: 2,
      page: "home_3",
      desc: "Lorem ipsum dolor sit amet, elitr, sed diam volu sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat",
      author_img: authorImg_2,
      author_name: "Freeman Ugene",
      designation: "Tincidunt",
   },
   {
      id: 3,
      page: "home_3",
      desc: "Lorem ipsum dolor sit amet, elitr, sed diam volu sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat",
      author_img: authorImg_1,
      author_name: "Freeman Ugene",
      designation: "Tincidunt",
   },
   {
      id: 4,
      page: "home_3",
      desc: "Lorem ipsum dolor sit amet, elitr, sed diam volu sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat",
      author_img: authorImg_2,
      author_name: "Freeman Ugene",
      designation: "Tincidunt",
   },
];

export default testi_data;