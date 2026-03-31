interface DataType {
   id: number;
   title: string;
   price: number;
   list_details: {
      icon: string;
      list: string;
      class_name?: string;
   }[];
}[];

const pricing_data: DataType[] = [
   {
      id: 1,
      title: "BASIC",
      price: 59,
      list_details: [
         { icon: "fa fa-check", list: "Branding graphics design" },
         { icon: "fa fa-check", list: "Lifetime free support" },
         { icon: "fa fa-check", list: "Web devolopment course" },
         { icon: "fa fa-check", list: "Unlimited free revision" },
         { icon: "fa fa-times", class_name: "unable", list: "Lifetime devolopment" },
         { icon: "fa fa-times", class_name: "unable", list: "Unlimited free revision" },
      ],
   },
   {
      id: 2,
      title: "STANDARD",
      price: 99,
      list_details: [
         { icon: "fa fa-check", list: "Branding graphics design" },
         { icon: "fa fa-check", list: "Lifetime free support" },
         { icon: "fa fa-check", list: "Web devolopment course" },
         { icon: "fa fa-check", list: "Unlimited free revision" },
         { icon: "fa fa-times", class_name: "unable", list: "Lifetime devolopment" },
         { icon: "fa fa-times", class_name: "unable", list: "Unlimited free revision" },
      ],
   },
   {
      id: 3,
      title: "PLATINUM",
      price: 211,
      list_details: [
         { icon: "fa fa-check", list: "Branding graphics design" },
         { icon: "fa fa-check", list: "Lifetime free support" },
         { icon: "fa fa-check", list: "Web devolopment course" },
         { icon: "fa fa-check", list: "Unlimited free revision" },
         { icon: "fa fa-times", class_name: "unable", list: "Lifetime devolopment" },
         { icon: "fa fa-times", class_name: "unable", list: "Unlimited free revision" },
      ],
   },
];

export default pricing_data;