# BitFest 2025 - Final

# ![ai](https://github.com/user-attachments/assets/428bf4ff-fbb2-4a97-854e-16812c3eb53b)


## Technology

```
Frontend: Reactjs
Backend : FastAPI,
Database: Sqlite

```



## Installation

clone the project:  

```bash
  git clone https://github.com/ShifatJahanShifa/BitFest-Final.git
```

## Run Locally

```bash
   cd Backend
   npm install
   // run 
```






## Authors

- [@ShifatJahanShifa](https://www.github.com/ShifatJahanShifa)
- [@AfiaLubaina](https://www.github.com/afia-lubaina)
- [@EhsanUddoula](https://www.github.com/EhsanUddoula)


## **Route**: `/auth/register`  
**Method**: POST 

**Summary**: Registers a new user and generates a JWT token.  
**Sample Payload**:
```json
  {
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securepassword",
  "role": "user"
  }
```

**Sample Response**:
```json
  {
  "access_token":   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
```

## **Route**: `/auth/login`  
**Method**: POST  

**Summary**: Authenticates a user and generates a JWT token.
**Sample Payload**:
```json
  {
  "email": "john.doe@example.com",
  "password": "securepassword"
  }
```

**Sample Response**:
```json
  {
  "access_token":   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
```

## **Route**: `/user/update`  
**Method**: PUT  

**Summary**: Updates the details of the authenticated user, including their profile picture (optional).
**Sample Payload**:
**Form data**:
```vbnet
  name: "Updated Name"  
  email: "updated.email@example.com"  
  password: "newpassword123"  
  pfp: (Upload File - Optional, e.g., "profile.jpg")
```

**Sample Response**:
```json
  {
  "message": "User updated successfully",
  "user": {
    "id": 1,
    "name": "Updated Name",
    "email": "updated.email@example.com",
    "pfp": "uploads/profiles/1_profile.jpg"
    }
  }
```

## **Route**: `/user/all`  
**Method**: GET 

**Summary**: Fetches all users in the system (restricted to admin users only).

**Sample Response**:
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "USER",
    "pfp": "uploads/profiles/1_profile.jpg"
  },
  {
    "id": 2,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "ADMIN",
    "pfp": null
  }
]
```

## **Route**: `/qna/initialize-rag`  
**Method**: POST  

**Summary**: Initializes the RAG (Retrieve and Generate) system for the authenticated user. This loads user-specific PDFs, processes them into text chunks, and creates a FAISS vector store.

**Sample Response**:
```json
  {
  "message": "RAG system initialized successfully."
  }
```
## **Route**: `/qna/ask-question`  
**Method**: POST  

**Summary**: Processes a user query based on the pre-loaded FAISS vector store and returns an answer using relevant documents.

**Sample Payload**:
```json
  {
  "question": "বাংলাদেশের প্রথম রাষ্ট্রপতি কে ছিলেন?"
  }
```

**Sample Response**:
```json
  {
  "response": "বাংলাদেশের প্রথম রাষ্ট্রপতি শেখ মুজিবুর রহমান।"
  }

```

## **Route**: `/translation/`  
**Method**: POST 

**Summary**: Creates a new translation system improvement entry.

**Sample Response**:
```json
{
  "message": "Data added successfully",
  "data": {
    "id": 1,
    "user_id": 123,
    "banglish": "apni kemon achhen?",
    "bangla": "আপনি কেমন আছেন?"
  }
}
```

## **Route**: `/translation/{data_id}`  
**Method**: PUT 

**Summary**: Updates an existing translation system improvement entry. 

**Headers**:
Authorization: Bearer <access_token>

**Sample Payload**:
```json
{
  "banglish": "apnar naam ki?",
  "bangla": "আপনার নাম কী?"
}

```

**Sample Response**:
```json
{
  "message": "Data updated successfully",
  "data": {
    "id": 1,
    "user_id": 123,
    "banglish": "apnar naam ki?",
    "bangla": "আপনার নাম কী?"
  }
}
```

## **Route**: `/translation/{data_id}`  
**Method**: DELETE

**Summary**: Deletes a translation system improvement entry.

**Headers**:
Authorization: Bearer <access_token>

**Sample Response**:
```json
{
  "message": "Data deleted successfully"
}
```

## **Route**: `/translation/system-improvement`  
**Method**: GET

**Summary**:  Retrieves all system improvement data.

**Headers**:
Authorization: Bearer <access_token>

**Sample Response**:
```json
[
  {
    "id": 1,
    "user_id": 123,
    "banglish": "apni kemon achhen?",
    "bangla": "আপনি কেমন আছেন?"
  },
  {
    "id": 2,
    "user_id": 124,
    "banglish": "ki khobor?",
    "bangla": "কি খবর?"
  }
]
```

## **Route**: `/chat/`  
**Method**: POST

**Summary**:  Interact with the chatbot and receive a response based on previous context.

**Headers**:
Authorization: Bearer <access_token>

**Sample Response**:
```json
{
  "response": "চ্যাটবটের উত্তর বাংলাতে থাকবে।"
}
```

## **Route**: `/chat/`  
**Method**: GET

**Summary**:  Retrieve the chat history for the current user.

**Headers**:
Authorization: Bearer <access_token>

**Sample Response**:
```json
{
  "chat_history": [
    {
      "message": "আপনি কেমন আছেন?",
      "response": "আমি ভালো আছি। আপনি?",
      "timestamp": "2025-01-04T10:00:00"
    },
    {
      "message": "আমার একটি প্রশ্ন আছে।",
      "response": "জিজ্ঞাসা করুন।",
      "timestamp": "2025-01-04T10:05:00"
    }
  ]
}

```

## **Route**: `/content/generate-pdf`  
**Method**: GET

**Summary**:  Generates a PDF from Bangla text, adds a title and caption using an LLM, and saves metadata in the database.

**Headers**:
Authorization: Bearer <access_token>

**Sample Response**:
```json
{
    "message": "PDF generated and content saved successfully.",
    "content": {
        "id": 1,
        "title": "Generated Title",
        "caption": "Generated Caption",
        "link": "pdfs/unique_file_id.pdf",
        "public": true
    }
}
```

## **Route**: `/content/update/{content_id}`  
**Method**: PUT

**Summary**: Updates the metadata of an existing PDF (e.g., toggling public/private status).

**Headers**:
Authorization: Bearer <access_token>

**Sample Response**:
```json
{
    "message": "Content updated successfully.",
    "content": {
        "id": 1,
        "title": "Generated Title",
        "caption": "Generated Caption",
        "link": "pdfs/unique_file_id.pdf",
        "public": true,
        "updated_at": "2025-01-04T12:00:00Z"
    }
}
```

## **Route**: `/content/delete-pdf/{content_id}`  
**Method**: DELETE

**Summary**: Deletes a PDF and its associated metadata from the database.

**Headers**:
Authorization: Bearer <access_token>

**Sample Response**:
```json
{
    "message": "PDF and content deleted successfully"
}
```

## **Route**: `/content/get-contents`  
**Method**: GET

**Summary**: Gets PDFs

**Headers**:
Authorization: Bearer <access_token>

**Sample Response**:
```
200 OK: List of public contents.
```

## **Route**: `/content/search`  
**Method**: GET

**Summary**: Searches for content based on a query, optionally filtered by username or content title.

**Headers**:
Authorization: Bearer <access_token>

**Sample Response**:
```
200 OK: List of matching contents.
200 OK: No results found message if none match.
500 Internal Server Error: Error details.
```

## **Route**: `/content/banglish-to-bangla/`  
**Method**: POST

**Summary**: Converts Banglish text (written in English script) to Bangla.

**Headers**:
Authorization: Bearer <access_token>

**Sample Response**:
```
200 OK: Translated Bangla text.
500 Internal Server Error: Error details.
```

## **Route**: `/content/get-pdf-content/`  
**Method**: POST

**Summary**: Extracts and retrieves text content from a PDF file.

**Headers**:
Authorization: Bearer <access_token>

**Sample Response**:
```
200 OK: Extracted text from the PDF.
404 Not Found: File not found.
500 Internal Server Error: Error extracting text.
```









