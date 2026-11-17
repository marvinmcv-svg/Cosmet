import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import Favorites from "@/components/home/Favorites";
import Premium from "@/components/home/Premium";
import BuildYourBox from "@/components/home/BuildYourBox";
import Fit from "@/components/home/Fit";
import Specials from "@/components/home/Specials";
import Process from "@/components/home/Process";
import PinkEdition from "@/components/home/PinkEdition";
import EventsTeaser from "@/components/home/EventsTeaser";
import Faq from "@/components/home/Faq";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Favorites />
      <Premium />
      <BuildYourBox />
      <Fit />
      <Specials />
      <Process />
      <EventsTeaser />
      <PinkEdition />
      <Faq />
    </>
  );
}
