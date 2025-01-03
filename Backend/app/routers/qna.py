from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import CharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
from pathlib import Path
from sqlalchemy import select
import os
from dotenv import load_dotenv
from ..oauth2 import get_current_user

from ..tables import Content, User  # Make sure to import your models
from ..database import get_db # Import your dependencies

# Initialize the router
router = APIRouter(
    prefix="/qna",
    tags=["PDF-QNA"]
)

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

# Load API key from environment
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Utility function to load PDFs for the current user based on user_id
def load_pdfs_from_db(db, user_id):
    try:
        # Query database for user-specific PDF links
        pdf_links = db.query(Content.link).filter(Content.user_id == user_id).all()

        documents = []
        for link in pdf_links:
            # Load the PDF
            pdf_path = Path(link[0])  # link is a tuple, so use link[0]
            loader = PyPDFLoader(str(pdf_path))
            pdf_documents = loader.load()  # Returns a list of Document objects
            documents.extend(pdf_documents)

        return documents
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading PDFs: {str(e)}")


# Function to extract and chunk text from PDFs
def extract_and_chunk_text_from_pdfs(pdf_files: list[str]) -> list[str]:
    all_text = ""
    for pdf_path in pdf_files:
        try:
            # Using PyPDFLoader to load and extract text from PDF
            loader = PyPDFLoader(str(pdf_path))
            document = loader.load()
            all_text += "\n".join([page.page_content for page in document]) + "\n"
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error reading PDF: {str(e)}")

    if not all_text.strip():
        raise HTTPException(status_code=400, detail="No valid text extracted from PDFs.")

    # Split text into manageable chunks
    splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.split_text(all_text)

    return chunks

# Function to create a vector store
def create_vector_store_from_chunks(chunks: list[str]):
    embeddings = OpenAIEmbeddings(api_key=OPENAI_API_KEY)
    # Create FAISS index for the extracted text
    db = FAISS.from_documents(chunks, embeddings)
    db.save_local("faiss_index")

# Function to load the QA chain
def load_conversational_chain():
    prompt_template = """
    তোমার কাজ হলো ব্যবহারকারীর প্রশ্নের উত্তর দেওয়া। নিচে প্রাসঙ্গিক তথ্য দেওয়া আছে যা বাংলা ভাষায় থাকবে। 
    প্রশ্নগুলো বাংলা বা ইংরেজি অক্ষরে বাংলায় লেখা হতে পারে। 
    উত্তর সর্বদা বাংলা ভাষায় দিতে হবে। যদি প্রশ্নের উত্তর প্রাসঙ্গিক তথ্যের মধ্যে না থাকে, তাহলে বলো "প্রাসঙ্গিক তথ্যের মধ্যে উত্তরটি নেই।"

    প্রাসঙ্গিক তথ্য:\n{context}\n
    প্রশ্ন:\n{question}\n

    উত্তর:
    """
    model = ChatOpenAI(api_key=OPENAI_API_KEY, temperature=0.3)
    prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
    return load_qa_chain(model, chain_type="stuff", prompt=prompt)


# API Endpoints

# Endpoint to initialize the RAG (Retrieve and Answer) system for the user
@router.post("/initialize-rag")
async def initialize_rag(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    try:
        # Load PDFs for the current user
        documents = load_pdfs_from_db(db, current_user["user_id"])

        # Split the documents into chunks
        text_splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        chunks = text_splitter.split_documents(documents)

        # Create a vector store
        vector_store = FAISS.from_documents(chunks, OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY))

        # Save the FAISS index to the local directory
        vector_store.save_local("faiss_index")

        return {"message": "RAG system initialized successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error initializing RAG system: {str(e)}")



# Endpoint for asking a question based on stored documents
@router.post("/ask-question")
async def ask_question(
    question: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    try:
        embeddings = OpenAIEmbeddings(api_key=OPENAI_API_KEY)

        # Load the FAISS index (the vector store) from the local directory
        db = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)

        # Retrieve relevant documents based on the question
        docs = db.as_retriever().get_relevant_documents(question)
        if not docs:
            return {"response": "No relevant context found in the vector store."}

        # Load conversational chain and invoke it with retrieved documents
        chain = load_conversational_chain()
        response = chain.invoke({"input_documents": docs, "question": question})

        return {"response": response["output_text"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing question: {str(e)}")