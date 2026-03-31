import { StaticImageData } from "next/image";

import icon_1 from "@/assets/img/intro/1.png";
import icon_2 from "@/assets/img/intro/2.png";
import icon_3 from "@/assets/img/intro/3.png";
import icon_4 from "@/assets/img/intro/4.png";
import icon_5 from "@/assets/img/intro/5.png";
import icon_6 from "@/assets/img/intro/6.png";
import icon_7 from "@/assets/img/icon/19.png";
import icon_8 from "@/assets/img/icon/20.png";
import icon_9 from "@/assets/img/icon/21.png";
import icon_10 from "@/assets/img/intro/7.png";
import icon_11 from "@/assets/img/intro/8.png";
import icon_12 from "@/assets/img/intro/9.png";
import icon_13 from "@/assets/img/intro/10.png";

interface DataType {
   id: number;
   page:string;
   icon: StaticImageData;
   title: string;
   desc?: string;
   item_bg?:string;
}[];

const intro_data: DataType[] = [
   {
      id: 1,
      page:"home_1",
      icon: icon_1,
      title: "MISIÓN",
      desc: "Formar profesionales con excelencia en las Sociologia, de recnocida capacidad, calidad y competitividad para ejercer las diferentes disciplinas artistica"
   },
   {
      id: 2,
      page:"home_1",
      icon: icon_2,
      title: "VISIÓN",
      desc: "La Carrera de Sociologia por ser una carrera especializada dentro la Universidad Pública de El Alto, es reconocida por su excelencia y alta calidad académicar"
   },
   {
      id: 3,
      page:"home_1",
      icon: icon_3,
      title: "OBJETIVO",
      desc: "Formar profesionales idóneo de reconocida calidad human, creativa y especializada en Sociología, con capacidad teórica-práctica, con alto nivel de competitividad"
   },

   // home_2
   
   {
      id: 1,
      page:"home_2",
      icon: icon_4,
      title: "Postgraduate",
      desc: "Lorem ipsum dolor"
   },
   {
      id: 2,
      page:"home_2",
      icon: icon_5,
      title: "Postgraduate",
      desc: "Lorem ipsum dolor"
   },
   {
      id: 3,
      page:"home_2",
      icon: icon_6,
      title: "Postgraduate",
      desc: "Lorem ipsum dolor"
   },
   {
      id: 4,
      page:"home_2",
      icon: icon_7,
      title: "Engineering",
      desc: "Lorem ipsum dolor"
   },
   {
      id: 5,
      page:"home_2",
      icon: icon_8,
      title: "PHD Scholarship",
      desc: "Lorem ipsum dolor"
   },
   {
      id: 6,
      page:"home_2",
      icon: icon_9,
      title: "Accounting",
      desc: "Lorem ipsum dolor"
   },

   // home_3
   
   {
      id: 1,
      page:"home_3",
      icon: icon_10,
      title: "Postgraduate",
      item_bg:"bg-green",
   },
   {
      id: 2,
      page:"home_3",
      icon: icon_11,
      title: "Postgraduate",
      item_bg:"bg-yellow",
   },
   {
      id: 3,
      page:"home_3",
      icon: icon_12,
      title: "Postgraduate",
      item_bg:"bg-blue",
   },
   {
      id: 4,
      page:"home_3",
      icon: icon_13,
      title: "Postgraduate",
      item_bg:"bg-red",
   },
   {
      id: 5,
      page:"home_3",
      icon: icon_11,
      title: "Postgraduate",
      item_bg:"bg-blue"
   },
];

export default intro_data;