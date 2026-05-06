import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";
import Hero from "./_components/sections/Hero";
import Experience from "./_components/sections/Experience";
import Projects from "./_components/sections/Projects";
import TechStack from "./_components/sections/TechStack";
import Terminal from "./_components/sections/Terminal";
import Contact from "./_components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Experience />
        <Projects />
        <TechStack />
        <Terminal />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
