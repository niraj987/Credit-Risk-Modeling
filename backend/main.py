import sys
import os
from typing import Dict, Any, Optional

# Add parent directory to sys.path so credit_agents can be imported
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from credit_agents.workflow import run_underwriting_pipeline
from credit_agents.rag.policy_retriever import PolicyRAGRetriever
from backend.db import init_db, save_application_record, get_recent_applications, get_application_by_id

# Initialize SQLite database
init_db()

# Initialize RAG retriever
rag_retriever = PolicyRAGRetriever()

app = FastAPI(
    title="FinRisk AI - Multi-Agent Credit Risk API",
    description="Enterprise Multi-Agent Credit Underwriting & Basel III/IV RAG Engine",
    version="2.0.0"
)

# Enable CORS for local Vite development and production deployments (Vercel/Render)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ApplicantRequest(BaseModel):
    Age: int = Field(default=35, ge=18, le=95)
    Income: float = Field(default=65000.0, ge=5000.0)
    LoanAmount: float = Field(default=15000.0, ge=500.0)
    CreditScore: int = Field(default=650, ge=300, le=850)
    MonthsEmployed: int = Field(default=48, ge=0)
    NumCreditLines: int = Field(default=3, ge=1, le=20)
    InterestRate: float = Field(default=11.5, ge=1.0, le=40.0)
    LoanTerm: int = Field(default=36)
    DTIRatio: float = Field(default=0.28, ge=0.01, le=1.2)
    Education: str = Field(default="Bachelor's")
    EmploymentType: str = Field(default="Full-time")
    MaritalStatus: str = Field(default="Single")
    HasMortgage: str = Field(default="No")
    HasDependents: str = Field(default="No")
    LoanPurpose: str = Field(default="Auto")
    HasCoSigner: str = Field(default="No")


class RAGSearchRequest(BaseModel):
    query: str
    top_k: int = 3
    filter_category: Optional[str] = None


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "FinRisk AI Multi-Agent Underwriting Engine",
        "version": "2.0.0",
        "rag_indexed_chunks": len(rag_retriever.chunks)
    }


@app.post("/api/underwrite")
def underwrite_applicant(request: ApplicantRequest):
    try:
        applicant_dict = request.model_dump()
        result_state = run_underwriting_pipeline(applicant_dict)
        app_id = save_application_record(result_state)
        
        return {
            "success": True,
            "application_id": app_id,
            "data": result_state
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Multi-agent underwriting failure: {str(e)}")


@app.post("/api/rag/search")
def search_regulatory_knowledge_base(request: RAGSearchRequest):
    try:
        hits = rag_retriever.search(
            query=request.query, 
            top_k=request.top_k, 
            filter_category=request.filter_category
        )
        return {
            "query": request.query,
            "count": len(hits),
            "results": [
                {
                    "chunk_id": h.chunk_id,
                    "source_doc": h.source_doc,
                    "title": h.title,
                    "content": h.content,
                    "score": h.score,
                    "regulatory_citations": h.regulatory_citations
                } for h in hits
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"RAG search error: {str(e)}")


@app.get("/api/history")
def list_history(limit: int = 15):
    try:
        records = get_recent_applications(limit=limit)
        return {"count": len(records), "records": records}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database query error: {str(e)}")


@app.get("/api/history/{app_id}")
def get_history_detail(app_id: str):
    record = get_application_by_id(app_id)
    if not record:
        raise HTTPException(status_code=404, detail="Application record not found")
    return record


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
