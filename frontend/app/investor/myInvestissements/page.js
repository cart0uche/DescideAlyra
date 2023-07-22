"use client";
import Header from "@/components/Header";
import MyInvestissements from "@/components/investor/MyInvestissements";

export default function Home() {
   return (
      <>
         <Header />
         <main>
            <MyInvestissements />
         </main>
      </>
   );
}
