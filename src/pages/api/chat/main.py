from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from langchain.llms import OpenAI
from langchain import PromptTemplate, LLMChain

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

davinci = OpenAI(model_name='text-davinci-003',
                 openai_api_key='OPENAI_API_KEY')

template = """Answer the question based on the context and chat history below. If the
question cannot be answered using the context and chat history provided, answer
with "I don't know".

Context: {context}

Chat History: {chat_history}

Question: {question}

Answer: """


class ChatRequest(BaseModel):
    context: str
    query: str


@app.post("/api/chat")
async def handler(request: Request, chat_request: ChatRequest):
    context = chat_request.context
    query = chat_request.query
    # return 'hello to you too'

    prompt = PromptTemplate(
        template=template,
        input_variables=['question', 'context', 'chat_history']
    )

    llm_chain = LLMChain(
        prompt=prompt,
        llm=davinci,
    )

    chat_history = []

    answer = llm_chain.run(
        {'question': query, 'context': context, 'chat_history': chat_history})

    return answer
