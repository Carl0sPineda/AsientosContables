import { Toaster } from "sonner";
import Home from "@/pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import FilterTotalByCategory from "./components/FilterTotalByCategory";

const App = () => {
  return (
    <>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-26">
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/filters" element={<FilterTotalByCategory />} />
          </Routes>
        </Router>
      </div>
      <Toaster position="bottom-right" />
    </>
  );
};

export default App;
