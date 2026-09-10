import Hero from "../components/hero";
import Projects from "../components/Projects";
import Services from "../components/services";
import About from "../components/about";
import Team from "../components/team";
import Contact from "../components/contact";
import NetworkBackground from "../components/networkBackground";

export default function Home() {
    return (
        <div className="relative min-h-screen bg-cream dark:bg-[#0a0a0a] text-charcoal dark:text-white transition-colors duration-300">
            {/* Single Fixed Background Canvas */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <NetworkBackground />
            </div>

            {/* Main Content Layer */}
            <main className="relative z-10">
                <Hero />
                <Projects />
                <Services />
                <Team />
                <About />
                <Contact />
            </main>
        </div>
    );
}