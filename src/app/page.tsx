import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import LatestQuestions from "./components/LatestQuestions";
import TopContributers from "./components/TopContributers";

export default function Home() {
    return (
        <>
            <HeroSection />
            <section className="container mx-auto space-y-8 px-4 pb-20">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <h2 className="mb-6 text-2xl font-bold">Latest Questions</h2>
                        <LatestQuestions />
                    </div>
                    <div>
                        <h2 className="mb-6 text-2xl font-bold">Top Contributors</h2>
                        <TopContributers />
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}
