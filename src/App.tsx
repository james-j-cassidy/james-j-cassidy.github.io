import Header from "./components/Header/Header";
import SkipLink from "./components/SkipLink/SkipLink";

const MAIN_CONTENT_ID = "main-content";

function App() {
  return (
    <>
      <SkipLink targetId={MAIN_CONTENT_ID} label="Skip to main content" />
      <Header />
      <main id={MAIN_CONTENT_ID} tabIndex={-1} />
    </>
  );
}

export default App;
