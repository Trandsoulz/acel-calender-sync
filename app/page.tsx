import { Navbar, Footer } from "@/app/_components/layout";
import { Hero } from "@/app/_components/sections";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
      </main>
      <Footer />
    </>
  );
}
