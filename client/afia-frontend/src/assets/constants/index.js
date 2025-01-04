
import { dine_24,dine_25,dine_26,dine_27,bill1 ,s11,s22,s33,s4,b1} from "../images";
import {p1,p2,p3} from "../pdf";
export const navLinks = [
    { href: "/", label: "Home" },
    { href: "/achat", label: "Banglish Chatbot" },
    { href: "/dashboard", label: "Profile" },
    { href: "/texteditor", label: "TextEditor" },
    { href: "/rag", label: "AskPDF" },
];


const pdfs = [
    {id: 1, link: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", title: "Dummy PDF 1", caption: "This is a dummy PDF file", public: true},
    {id: 2, link: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", title: "Dummy PDF 2", caption: "This is a dummy PDF file", public: true},
    {id: 3, link: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", title: "Dummy PDF 3", caption: "This is a dummy PDF file", public: false },
    {id: 4, link: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", title: "Dummy PDF 4", caption: "This is a dummy PDF file", public: true},
  ];
  

export const books = [
    
    {
        id: 1,
        name: 'Energy Efficiency Handbook',
        topic: 'Physics',
        image: b1,
        pdf: p1,
    },
    {
        id: 2,
        name: 'Energy Efficiency Handbook',
        topic: 'Physics',
        image: b1,
        pdf: p1,
    }
];


export const categories = [
    { name: "Chemistry", link: "/category/chemistry/1", image: s11, sub_id:1},
    { name: "Biology", link: "/category/biology/2", image: s22, sub_id:2 },
    { name: "Physics ", link: "/category/physics/3", image: s33, sub_id:3 },
    { name: "ICT", link: "/category/ict/4", image: s4 ,   sub_id:4},
];

// food.js (or in your CategoryCard component file)
export const food = [
    { id: 1, name: "efg", image:  dine_24 ,link: "/detail/1"},
    { id: 2, name: "Mud Cake", image:  dine_24,link: "/detail/2" },
    { id: 3, name: "Jelly Cake", image:  dine_24,link: "/detail/3" },
    { id: 4, name: "Pooh Cake", image:  dine_24,link: "/detail/4" },    
  ];
  



export const footerLinks = [
    {
        title: "Education",
        links: [
            { name: "Games", link: "/" },
            { name: "Quizzes", link: "/" },
            { name: "Awareness", link: "/" },
            { name: "View Map", link: "/" },
            { name: "Get Notifications", link: "/" },
        ],
    },
    {
        title: "Help",
        links: [
            { name: "About us", link: "/" },
            { name: "FAQs", link: "/" },
            { name: "How it works", link: "/" },
            { name: "Privacy policy", link: "/" },
        ],
    },
    {
        title: "Get in touch",
        links: [
            { name: "customer@ghg_explorer.com", link: "mailto:customer@ghg_explorer.com" },
            { name: "+92554862354", link: "tel:+92554862354" },
        ],
    },
];

export const socialMedia = [
];