import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { Home } from "./pages";
import { Route, Routes } from "react-router-dom";
import CategoryDetail from "./pages/CategoryDetail";
import ScrollToTop from "./utils/ScrollToTop";
import FoodDetail from "./pages/FoodDetail";
import Profile from "./pages/Profile";
import Chatbot from "./pages/Ogrobot/Chatbot";
import Login from "./pages/Login";
import Signup from "./pages/Signup";


import "./index.css";
import Quiz from "./pages/Quiz";
import Dashboard from "./pages/Dashboard";
import ChatBubble from "./components/ChatBubble";
import ImageUploader from "./pages/Ogrobot/ImageUploader";
import Summary from "./pages/Summary";
import Translator from "./pages/Translator";
import Achat from "./pages/Ogrobot/Achat";
import TextEditor from "./pages/TextEditor";
import FetchPdfLinks from "./pages/FetchPdfLinks";
import ShowPubPost from "./pages/ShowPubPost";
import ShowPdfContent from "./pages/ShowPdfContent";

const App = () => {
  return (
    <>
      <div className="relative">
        <div className="absolute top-0 z-[-2] bg-white bg-[radial-gradient(100%_70%_at_70%_0%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]"></div>
        <ScrollToTop />
        <Nav />
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:category_name/:sub_id" element={<CategoryDetail />} />
        <Route path="/detail/:id" element={<FoodDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chatbot" element={<Quiz />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/bub' element={<ChatBubble />} />
        <Route path='/img' element={<ImageUploader />} />
        <Route path='/summary' element={<Summary />} />
        <Route path='/trans' element={<Translator />} />
         <Route path='/achat' element={<Achat />} />
         <Route path='/texteditor' element={<TextEditor />} />
         <Route path='/fet' element={<FetchPdfLinks />} />
         <Route path='/fes' element={<ShowPubPost />} />
         <Route path='/showcontents' element={<ShowPdfContent />} />
        </Routes>
        
        <Footer />
      </div>
    </>
  );
};

export default App;
