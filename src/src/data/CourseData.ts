/* import { StaticImageData } from "next/image";

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
   page: string;
   thumb: StaticImageData;
   user_thumb: StaticImageData;
   user_name: string;
   title: string;
   rating: number;
   total_rating: number;
   price: number;
   category?: string;
}[];

const course_data: DataType[] = [
   {
      id: 1,
      page: "home_1",
      thumb: courseThumb_1,
      user_thumb: userThumb_1,
      user_name: "PUBLICACIÓN 1",
      title: "Fox nymphs grab quick-jived waltz. Brick quiz whangs",
      rating: 4.3,
      total_rating: 23,
      price: 54,
      category: "Graphics Digital Writing Music",
   },
   {
      id: 2,
      page: "home_1",
      thumb: courseThumb_2,
      user_thumb: userThumb_2,
      user_name: "Joe Powell",
      title: "Aenean sed nibh a magna posuere tempo faucib",
      rating: 4.4,
      total_rating: 24,
      price: 55,
      category: "Digital Graphics Writing Music",
   },
   {
      id: 3,
      page: "home_1",
      thumb: courseThumb_3,
      user_thumb: userThumb_3,
      user_name: " Timothy Willis",
      title: "Praesent eu dolor eu orci vehicula euismod",
      rating: 4.9,
      total_rating: 73,
      price: 74,
      category: "Writing Digital Graphics Music",
   },
   {
      id: 4,
      page: "home_1",
      thumb: courseThumb_4,
      user_thumb: userThumb_4,
      user_name: "Walter Griffin",
      title: "Duis vestibulum elit vel neque pharetra vulputate",
      rating: 4.5,
      total_rating: 53,
      price: 64,
      category: "Music Writing Digital Graphics",
   },
   {
      id: 5,
      page: "home_1",
      thumb: courseThumb_5,
      user_thumb: userThumb_5,
      user_name: "Aaron Powell",
      title: "Quisque suscipit ipsum est, eu venenatis leo ornare eget",
      rating: 4.6,
      total_rating: 50,
      price: 34,
      category: "Digital Music Writing Graphics",
   },
   {
      id: 6,
      page: "home_1",
      thumb: courseThumb_6,
      user_thumb: userThumb_6,
      user_name: " Randy Hart",
      title: "Duis rhoncus dui venenatis consequat porttito",
      rating: 4.8,
      total_rating: 20,
      price: 60,
      category: "Writing Digital Music Graphics",
   },
   {
      id: 7,
      page: "home_1",
      thumb: courseThumb_6,
      user_thumb: userThumb_6,
      user_name: " Randy Hart",
      title: "Duis rhoncus dui venenatis consequat porttito",
      rating: 4.8,
      total_rating: 20,
      price: 60,
      category: "Writing Digital Music Graphics",
   },
   {
      id: 8,
      page: "home_1",
      thumb: courseThumb_5,
      user_thumb: userThumb_5,
      user_name: "Aaron Powell",
      title: "Quisque suscipit ipsum est, eu venenatis leo ornare eget",
      rating: 4.6,
      total_rating: 50,
      price: 34,
      category: "Digital Music Writing Graphics",
   },
   {
      id: 9,
      page: "home_1",
      thumb: courseThumb_4,
      user_thumb: userThumb_4,
      user_name: "Walter Griffin",
      title: "Duis vestibulum elit vel neque pharetra vulputate",
      rating: 4.5,
      total_rating: 53,
      price: 64,
      category: "Music Writing Digital Graphics",
   },
   {
      id: 10,
      page: "home_1",
      thumb: courseThumb_3,
      user_thumb: userThumb_3,
      user_name: " Timothy Willis",
      title: "Praesent eu dolor eu orci vehicula euismod",
      rating: 4.9,
      total_rating: 73,
      price: 74,
      category: "Writing Digital Graphics Music",
   },
   {
      id: 11,
      page: "home_1",
      thumb: courseThumb_2,
      user_thumb: userThumb_2,
      user_name: "Joe Powell",
      title: "Aenean sed nibh a magna posuere tempo faucib",
      rating: 4.4,
      total_rating: 24,
      price: 55,
      category: "Digital Graphics Writing Music",
   },
   {
      id: 12,
      page: "home_1",
      thumb: courseThumb_1,
      user_thumb: userThumb_1,
      user_name: "Nancy Reyes",
      title: "Fox nymphs grab quick-jived waltz. Brick quiz whangs",
      rating: 4.3,
      total_rating: 23,
      price: 54,
      category: "Graphics Digital Writing Music",
   },

   // home_3
   
   {
      id: 1,
      page: "home_3",
      thumb: courseThumb_3,
      user_thumb: userThumb_3,
      user_name: "Timothy Willis",
      title: "Praesent eu dolor eu orci vehicula euismod",
      rating: 4.9,
      total_rating: 73,
      price: 74,
   },
   {
      id: 2,
      page: "home_3",
      thumb: courseThumb_6,
      user_thumb: userThumb_6,
      user_name: "Randy Hart",
      title: "Duis rhoncus dui venenatis consequat porttito",
      rating: 5,
      total_rating: 75,
      price: 70,
   },
   {
      id: 3,
      page: "home_3",
      thumb: courseThumb_4,
      user_thumb: userThumb_4,
      user_name: "Walter Griffin",
      title: "Duis vestibulum elit vel neque pharetra vulputate",
      rating: 4.7,
      total_rating: 50,
      price: 54,
   },
   {
      id: 4,
      page: "home_3",
      thumb: courseThumb_1,
      user_thumb: userThumb_1,
      user_name: "Nancy Reyes",
      title: "Fox nymphs grab quick-jived waltz. Brick quiz whangs",
      rating: 4.6,
      total_rating: 40,
      price: 60,
   },
   {
      id: 5,
      page: "home_3",
      thumb: courseThumb_5,
      user_thumb: userThumb_5,
      user_name: "Aaron Powell",
      title: "Quisque suscipit ipsum est, eu venenatis leo ornare eget",
      rating: 4.5,
      total_rating: 70,
      price: 65,
   },
   {
      id: 6,
      page: "home_3",
      thumb: courseThumb_2,
      user_thumb: userThumb_2,
      user_name: "Joe Powell",
      title: "Aenean sed nibh a magna posuere tempo faucib",
      rating: 4.8,
      total_rating: 75,
      price: 70,
   },
   {
      id: 7,
      page: "home_3",
      thumb: courseThumb_7,
      user_thumb: userThumb_7,
      user_name: "Randy Hart",
      title: "Duis rhoncus dui venenatis consequat porttito",
      rating: 4.9,
      total_rating: 45,
      price: 50,
   },
   {
      id: 8,
      page: "home_3",
      thumb: courseThumb_8,
      user_thumb: userThumb_2,
      user_name: "Walter Griffin",
      title: "Duis vestibulum elit vel neque pharetra vulputate",
      rating: 4.7,
      total_rating: 55,
      price: 40,
   },
];

export default course_data; */