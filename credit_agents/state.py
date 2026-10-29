from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from typing_extensions import TypedDict


class ApplicantProfile(BaseModel):
    """Normalized Applicant Profile representation."""
    Age: int = Field(default=35, ge=18, le=100)
    Income: float = Field(default=65000.0, ge=5000.0)
    LoanAmount: float = Field(default=15000.0, ge=500.0)
    CreditScore: int = Field(default=650, ge=300, le=850)
    MonthsEmployed: int = Field(default=48, ge=0)
    NumCreditLines: int = Field(default=3, ge=0)
    InterestRate: float = Field(default=11.5, ge=0.5, le=40.0)
    LoanTerm: int = Field(default=36, ge=12, le=84)
    DTIRatio: float = Field(default=0.25, ge=0.0, le=1.5)
    Education: str = Field(default="Bachelor's")
    EmploymentType: str = Field(default="Full-time")
    MaritalStatus: str = Field(default="Single")
    HasMortgage: str = Field(default="No")
    HasDependents: str = Field(default="No")
    LoanPurpose: str = Field(default="Auto")
    HasCoSigner: str = Field(default="No")


class AgentLogEntry(TypedDict):
    timestamp: str
    agent_name: str
    layer: int
    status: str
    summary: str
    details: Dict[str, Any]


class CreditUnderwritingState(TypedDict):
    """
    Unified LangGraph State tracking multi-agent financial underwriting layers.
    """
    applicant_data: Dict[str, Any]
    fraud_kyc_findings: Dict[str, Any]
    ml_risk_assessment: Dict[str, Any]
    rag_regulatory_context: Dict[str, Any]
    compliance_bias_audit: Dict[str, Any]
    counterfactual_recommendations: List[Dict[str, Any]]
    credit_committee_synthesis: Dict[str, Any]
    agent_logs: List[AgentLogEntry]
    errors: List[str]
