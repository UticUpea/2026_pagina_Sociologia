"use client"
import { useState } from "react";

const HeaderSearchbar = ({ isSearch, setIsSearch }: any) => {

   const [searchValue, setSearchValue] = useState("");

   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event.target.value);
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setSearchValue('');
      setIsSearch(false);
   };

   return (
      <>
         <div className={`td-search-popup ${isSearch ? "active" : ""}`} id="td-search-popup">
            <form onSubmit={handleSubmit} className="search-form">
               <div className="form-group">
                  <input value={searchValue} onChange={handleSearchChange} type="text" className="form-control" placeholder="Search....." />
               </div>
               <button type="submit" className="submit-btn"><i className="fa fa-search"></i></button>
            </form>
         </div>
         <div onClick={() => setIsSearch(false)} className={`body-overlay ${isSearch ? "active" : ""}`} id="body-overlay"></div>
      </>
   )
}

export default HeaderSearchbar
