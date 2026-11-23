import Header from "./components/Header/Header";
import SkipLink from "./components/SkipLink/SkipLink";
import SectionDeck from "./components/Sections/SectionDeck/SectionDeck";
import { useSectionRouting } from "./hooks/useSectionRouting";

const MAIN_CONTENT_ID = "main-content";

function App() {
  useSectionRouting();

  return (
    <>
      <SkipLink targetId={MAIN_CONTENT_ID} label="Skip to main content" />
      <Header />
      <main id={MAIN_CONTENT_ID} tabIndex={-1}>
        <SectionDeck />
      </main>
    </>
  );
}

export default App;
