import { StaticImageData } from "next/image";

import blogThumb_1 from "@/assets/img/blog/1.png";
import blogThumb_2 from "@/assets/img/blog/2.png";
import blogThumb_3 from "@/assets/img/blog/4.png";
import blogThumb_4 from "@/assets/img/blog/5.png";
import blogThumb_5 from "@/assets/img/blog/6.png";
import blogThumb_6 from "@/assets/img/blog/7.png";

import blog2Thumb_1 from "@/assets/img/blog/4.png";
import blog2Thumb_2 from "@/assets/img/blog/5.png";
import blog2Thumb_3 from "@/assets/img/blog/6.png";
import blog2Thumb_4 from "@/assets/img/blog/7.png";

interface DataType {
   id: number;
   page: string;
   thumb: StaticImageData;
   date: string;
   title: string;
   desc?: string;
}[];

const blog_data: DataType[] = [
   {
      id: 1,
      page: "home_1",
      thumb: blogThumb_1,
      date: "20 JANUARY, 2024",
      title: "Quisque suscipit ipsum est, eu venenatis leo",
   },
   {
      id: 2,
      page: "home_1",
      thumb: blogThumb_2,
      date: "28 JANUARY, 2024",
      title: "Maecenas interdu rem eleifend orci aliquam",
   },

   // home_2

   {
      id: 1,
      page: "home_2",
      thumb: blogThumb_1,
      date: "20 JANUARY, 2024",
      title: "Quisque suscipit ipsum est, eu venenatis leo",
   },
   {
      id: 2,
      page: "home_2",
      thumb: blogThumb_2,
      date: "28 JANUARY, 2024",
      title: "Maecenas interdu rem eleifend orci aliquam",
   },
   {
      id: 3,
      page: "home_2",
      thumb: blogThumb_2,
      date: "28 JANUARY, 2024",
      title: "Maecenas interdu rem eleifend orci aliquam",
   },

   // inner_blog

   {
      id: 1,
      page: "inner_blog",
      thumb: blogThumb_3,
      date: "28 JANUARY, 2024",
      title: "Flock by when MTV ax quiz prog quiz graced",
      desc: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam",
   },
   {
      id: 2,
      page: "inner_blog",
      thumb: blogThumb_4,
      date: "20 JANUARY, 2024",
      title: "Quisque suscipit ipsum est, eu venen leo",
      desc: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam",
   },
   {
      id: 3,
      page: "inner_blog",
      thumb: blogThumb_5,
      date: "15 JANUARY, 2024",
      title: "When MTV ax quiz prog Flock by graced",
      desc: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam",
   },
   {
      id: 4,
      page: "inner_blog",
      thumb: blogThumb_4,
      date: "20 JANUARY, 2024",
      title: "Quisque suscipit ipsum est, eu venen leo",
      desc: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam",
   },
   {
      id: 5,
      page: "inner_blog",
      thumb: blogThumb_5,
      date: "15 JANUARY, 2024",
      title: "When MTV ax quiz prog Flock by graced",
      desc: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam",
   },
   {
      id: 6,
      page: "inner_blog",
      thumb: blogThumb_3,
      date: "28 JANUARY, 2024",
      title: "Flock by when MTV ax quiz prog quiz graced",
      desc: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam",
   },
   {
      id: 7,
      page: "inner_blog",
      thumb: blogThumb_4,
      date: "20 JANUARY, 2024",
      title: "Quisque suscipit ipsum est, eu venen leo",
      desc: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam",
   },

   // inner_blog_2

   {
      id: 1,
      page: "inner_blog_2",
      thumb: blog2Thumb_1,
      date: "28 JANUARY, 2020",
      title: "Flock by when MTV ax quiz prog quiz graced",
      desc: "Lorem ipsum dolor sit amet sed diam nonumy eirmod tempor invidunt ut labore et dolore magna",
   },
   {
      id: 2,
      page: "inner_blog_2",
      thumb: blog2Thumb_2,
      date: "29 JANUARY, 2020",
      title: "Quisque suscipit ipsum est, eu venen leo",
      desc: "Lorem ipsum dolor sit amet sed diam nonumy eirmod tempor invidunt ut labore et dolore magna",
   },
   {
      id: 3,
      page: "inner_blog_2",
      thumb: blog2Thumb_3,
      date: "30 JANUARY, 2020",
      title: "When MTV ax quiz prog Flock by graced",
      desc: "Lorem ipsum dolor sit amet sed diam nonumy eirmod tempor invidunt ut labore et dolore magna",
   },
   {
      id: 4,
      page: "inner_blog_2",
      thumb: blog2Thumb_4,
      date: "28 JANUARY, 2020",
      title: "Flock by when MTV ax quiz prog quiz graced",
      desc: "Lorem ipsum dolor sit amet sed diam nonumy eirmod tempor invidunt ut labore et dolore magna",
   },
   {
      id: 5,
      page: "inner_blog_2",
      thumb: blog2Thumb_1,
      date: "29 JANUARY, 2020",
      title: "Quisque suscipit ipsum est, eu venen leo",
      desc: "Lorem ipsum dolor sit amet sed diam nonumy eirmod tempor invidunt ut labore et dolore magna",
   },
   {
      id: 6,
      page: "inner_blog_2",
      thumb: blog2Thumb_2,
      date: "30 JANUARY, 2020",
      title: "When MTV ax quiz prog Flock by graced",
      desc: "Lorem ipsum dolor sit amet sed diam nonumy eirmod tempor invidunt ut labore et dolore magna",
   },
   {
      id: 7,
      page: "inner_blog_2",
      thumb: blog2Thumb_3,
      date: "28 JANUARY, 2020",
      title: "Flock by when MTV ax quiz prog quiz graced",
      desc: "Lorem ipsum dolor sit amet sed diam nonumy eirmod tempor invidunt ut labore et dolore magna",
   },
   {
      id: 8,
      page: "inner_blog_2",
      thumb: blog2Thumb_4,
      date: "29 JANUARY, 2020",
      title: "Quisque suscipit ipsum est, eu venen leo",
      desc: "Lorem ipsum dolor sit amet sed diam nonumy eirmod tempor invidunt ut labore et dolore magna",
   },
   {
      id: 9,
      page: "inner_blog_2",
      thumb: blog2Thumb_1,
      date: "30 JANUARY, 2020",
      title: "When MTV ax quiz prog Flock by graced",
      desc: "Lorem ipsum dolor sit amet sed diam nonumy eirmod tempor invidunt ut labore et dolore magna",
   },
   {
      id: 10,
      page: "inner_blog_2",
      thumb: blog2Thumb_2,
      date: "28 JANUARY, 2020",
      title: "Flock by when MTV ax quiz prog quiz graced",
      desc: "Lorem ipsum dolor sit amet sed diam nonumy eirmod tempor invidunt ut labore et dolore magna",
   },
   {
      id: 11,
      page: "inner_blog_2",
      thumb: blog2Thumb_3,
      date: "29 JANUARY, 2020",
      title: "Quisque suscipit ipsum est, eu venen leo",
      desc: "Lorem ipsum dolor sit amet sed diam nonumy eirmod tempor invidunt ut labore et dolore magna",
   },
   {
      id: 12,
      page: "inner_blog_2",
      thumb: blog2Thumb_3,
      date: "30 JANUARY, 2020",
      title: "When MTV ax quiz prog Flock by graced",
      desc: "Lorem ipsum dolor sit amet sed diam nonumy eirmod tempor invidunt ut labore et dolore magna",
   },
   {
      id: 13,
      page: "inner_blog_2",
      thumb: blog2Thumb_4,
      date: "28 JANUARY, 2020",
      title: "Flock by when MTV ax quiz prog quiz graced",
      desc: "Lorem ipsum dolor sit amet sed diam nonumy eirmod tempor invidunt ut labore et dolore magna",
   },
   {
      id: 14,
      page: "inner_blog_2",
      thumb: blog2Thumb_1,
      date: "29 JANUARY, 2020",
      title: "Quisque suscipit ipsum est, eu venen leo",
      desc: "Lorem ipsum dolor sit amet sed diam nonumy eirmod tempor invidunt ut labore et dolore magna",
   },
   {
      id: 15,
      page: "inner_blog_2",
      thumb: blog2Thumb_2,
      date: "30 JANUARY, 2020",
      title: "When MTV ax quiz prog Flock by graced",
      desc: "Lorem ipsum dolor sit amet sed diam nonumy eirmod tempor invidunt ut labore et dolore magna",
   },
];

export default blog_data;