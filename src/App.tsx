import { Header } from "./sections/Chrome";
import { Hero } from "./sections/Hero";
import { Catalog3D } from "./sections/Catalog3D";
import { Configurator } from "./sections/Configurator";
import { HowItSeals } from "./sections/HowItSeals";
import { Precision } from "./sections/Precision";
import { BuyerSafety, ConfigTable } from "./sections/DataSections";
import { Rfq, Footer } from "./sections/Chrome";

export default function App() {
  return (
    <>
      <Header />
      <Hero />
      <Catalog3D />
      <Configurator />
      <HowItSeals />
      <Precision />
      <BuyerSafety />
      <ConfigTable />
      <Rfq />
      <Footer />
    </>
  );
}
