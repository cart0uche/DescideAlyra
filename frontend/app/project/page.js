"use client";
import Header from "@/components/Header";
import Project from "@/components/investor/Project";

export default function Home({ projectInfo }) {
   return (
      <>
         <Header />
         <main>
            <Project />
         </main>
      </>
   );
}
