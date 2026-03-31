import { StaticImageData } from "next/image";

import courseThumb_1 from "@/assets/img/course/1.png";
import courseThumb_2 from "@/assets/img/course/2.png";
import courseThumb_3 from "@/assets/img/course/3.png";
import courseThumb_4 from "@/assets/img/course/4.png";
import courseThumb_5 from "@/assets/img/course/5.png";
import courseThumb_6 from "@/assets/img/course/6.png";
import courseThumb_7 from "@/assets/img/course/7.png";
import courseThumb_8 from "@/assets/img/course/8.png";

import userThumb_1 from "@/assets/img/author/1.png";
import userThumb_2 from "@/assets/img/author/2.png";
import userThumb_3 from "@/assets/img/author/3.png";
import userThumb_4 from "@/assets/img/author/4.png";
import userThumb_5 from "@/assets/img/author/5.png";
import userThumb_6 from "@/assets/img/author/6.png";
import userThumb_7 from "@/assets/img/author/7.png";

interface DataType {
   id: number;
   thumb: StaticImageData;
   user_thumb: StaticImageData;
   user_name: string;
   title: string;
   rating: number;
   total_rating: number;
   price: number;
   category: string;
   course_filter: string;
   level:string;
   tag:string;
}[];

const inner_course_data: DataType[] = [
   {
      id: 1,
      thumb: courseThumb_1,
      user_thumb: userThumb_1,
      user_name: "",
      title: "Fox nymphs grab quick-jived waltz. Brick quiz whangs",
      rating: 4.3,
      total_rating: 23,
      price: 54,
      category: "Pharetra amet",
      course_filter:"Paid Courses",
      level:"Advanced",
      tag:"Landing",
   },
   {
      id: 2,
      thumb: courseThumb_2,
      user_thumb: userThumb_2,
      user_name: "Joe Powell",
      title: "Aenean sed nibh a magna posuere tempo faucib",
      rating: 4.4,
      total_rating: 24,
      price: 55,
      category: "Pharetra amet",
      course_filter:"Only Subscription",
      level:"Advanced",
      tag:"Personal",
   },
   {
      id: 3,
      thumb: courseThumb_3,
      user_thumb: userThumb_3,
      user_name: " Timothy Willis",
      title: "Praesent eu dolor eu orci vehicula euismod",
      rating: 4.9,
      total_rating: 73,
      price: 74,
      category: "Dolor proin",
      course_filter:"Only Subscription",
      level:"Advanced",
      tag:"Project",
   },
   {
      id: 4,
      thumb: courseThumb_4,
      user_thumb: userThumb_4,
      user_name: "Walter Griffin",
      title: "Duis vestibulum elit vel neque pharetra vulputate",
      rating: 4.5,
      total_rating: 53,
      price: 64,
      category: "Dolor proin",
      course_filter:"Paid Courses",
      level:"Intermediate",
      tag:"Portfolio",
   },
   {
      id: 5,
      thumb: courseThumb_5,
      user_thumb: userThumb_5,
      user_name: "Aaron Powell",
      title: "Quisque suscipit ipsum est, eu venenatis leo ornare eget",
      rating: 4.6,
      total_rating: 50,
      price: 34,
      category: "Auctor mattis lacus",
      course_filter:"Paid Courses",
      level:"Intermediate",
      tag:"Designer",
   },
   {
      id: 6,
      thumb: courseThumb_6,
      user_thumb: userThumb_6,
      user_name: " Randy Hart",
      title: "Duis rhoncus dui venenatis consequat porttito",
      rating: 4.8,
      total_rating: 20,
      price: 60,
      category: "Auctor mattis lacus",
      course_filter:"Free Courses",
      level:"Intermediate",
      tag:"Article",
   },
   {
      id: 7,
      thumb: courseThumb_7,
      user_thumb: userThumb_7,
      user_name: " Randy Hart",
      title: "Duis rhoncus dui venenatis consequat porttito",
      rating: 4.8,
      total_rating: 20,
      price: 60,
      category: "Tempor lorem interdum",
      course_filter:"Free Courses",
      level:"Beginner",
      tag:"Creative",
   },
   {
      id: 8,
      thumb: courseThumb_8,
      user_thumb: userThumb_4,
      user_name: "Aaron Powell",
      title: "Quisque suscipit ipsum est, eu venenatis leo ornare eget",
      rating: 4.6,
      total_rating: 50,
      price: 34,
      category: "Tempor lorem interdum",
      course_filter:"Free Courses",
      level:"Beginner",
      tag:"Art",
   },
   {
      id: 9,
      thumb: courseThumb_3,
      user_thumb: userThumb_3,
      user_name: " Timothy Willis",
      title: "Praesent eu dolor eu orci vehicula euismod",
      rating: 4.9,
      total_rating: 73,
      price: 74,
      category: "Dolor proin",
      course_filter:"Only Subscription",
      level:"Advanced",
      tag:"Project",
   },
];

export default inner_course_data;