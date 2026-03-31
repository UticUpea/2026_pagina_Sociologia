// data/GalleryData.ts

import { StaticImageData } from "next/image";
import galleryThumb_1 from "@/assets/img/gallery/artes-galeria-6.jpg";
import galleryThumb_2 from "@/assets/img/gallery/artes-galeria-5.jpg";
import galleryThumb_3 from "@/assets/img/gallery/artes-galeria-4.jpg";
import galleryThumb_4 from "@/assets/img/gallery/artes-galeria-3.jpg";
import galleryThumb_5 from "@/assets/img/gallery/artes-galeria-2.jpg";
import galleryThumb_6 from "@/assets/img/gallery/artes-galeria-1.jpg";

interface DataType {
  id: number;
  thumb: StaticImageData;
  title: string;
  desc: string;
}

const gallery_data: DataType[] = [
  {
    id: 1,
    thumb: galleryThumb_1,
    title: "AUTOR",
    desc: "Nombre o descripción de la obra",
  },
  {
    id: 2,
    thumb: galleryThumb_2,
    title: "AUTOR",
    desc: "Nombre o descripción de la obra",
  },
  {
    id: 3,
    thumb: galleryThumb_3,
    title: "AUTOR",
    desc: "Nombre o descripción de la obra",
  },
  {
    id: 4,
    thumb: galleryThumb_4,
    title: "AUTOR",
    desc: "Nombre o descripción de la obra",
  },
  {
    id: 5,
    thumb: galleryThumb_5,
    title: "AUTOR",
    desc: "Nombre o descripción de la obra",
  },
  {
    id: 6,
    thumb: galleryThumb_6,
    title: "AUTOR",
    desc: "Nombre o descripción de la obra",
  },
];

export default gallery_data;
