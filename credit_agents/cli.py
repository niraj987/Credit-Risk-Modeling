import argparse
import json
import sys
from pprint import pprint
from .workflow import run_underwriting_pipeline
from .ml.trainer import train_and_export_model
from .rag.policy_retriever import PolicyRAGRetriever


def main():
    parser = argparse.ArgumentParser(description="Multi-Agent Credit Risk & Financial Intelligence CLI")
    subparsers = parser.add_subparsers(dest="command", help="Available subcommands")

    # Command: run
    run_parser = subparsers.add_parser("run", help="Run multi-agent underwriting on an applicant profile")
    run_parser.add_argument("--score", type=int, default=650, help="Credit score (300-850)")
    run_parser.add_argument("--income", type=float, default=65000.0, help="Annual income ($)")
    run_parser.add_argument("--loan", type=float, default=15000.0, help="Loan amount ($)")
    run_parser.add_argument("--dti", type=float, default=0.28, help="Debt-to-Income ratio (0.0 - 1.0)")
    run_parser.add_argument("--employed", type=int, default=48, help="Months employed")
    run_parser.add_argument("--cosigner", type=str, default="No", choices=["Yes", "No"], help="Has co-signer")

    # Command: train
    train_parser = subparsers.add_parser("train", help="Train/retrain LightGBM credit default risk model")
    train_parser.add_argument("--data", type=str, default="Loan_default.csv", help="Path to CSV dataset")
    train_parser.add_argument("--out", type=str, default="lgb_model.pkl", help="Output model path")

    # Command: rag
    rag_parser = subparsers.add_parser("rag", help="Query regulatory RAG policy knowledge base")
    rag_parser.add_argument("query", type=str, help="Search query (e.g. 'adverse action reasons ECOA')")

    args = parser.parse_args()

    if args.command == "train":
        print(f"[*] Training credit risk model from {args.data}...")
        model, metrics = train_and_export_model(csv_path=args.data, model_output_path=args.out)
        print("[+] Model training complete!")
        print(json.dumps(metrics, indent=2))

    elif args.command == "rag":
        retriever = PolicyRAGRetriever()
        hits = retriever.search(args.query, top_k=3)
        print(f"\n[+] RAG Search Results for '{args.query}':\n")
        for i, hit in enumerate(hits, 1):
            print(f"--- Hit {i}: {hit.title} ({hit.source_doc}) [Score: {hit.score}] ---")
            print(hit.content.strip())
            if hit.regulatory_citations:
                print(f"Citations: {', '.join(hit.regulatory_citations)}")
            print()

    elif args.command == "run" or args.command is None:
        applicant = {
            "Age": 34,
            "Income": getattr(args, "income", 65000.0),
            "LoanAmount": getattr(args, "loan", 15000.0),
            "CreditScore": getattr(args, "score", 650),
            "MonthsEmployed": getattr(args, "employed", 48),
            "NumCreditLines": 3,
            "InterestRate": 11.5,
            "LoanTerm": 36,
            "DTIRatio": getattr(args, "dti", 0.28),
            "Education": "Bachelor's",
            "EmploymentType": "Full-time",
            "MaritalStatus": "Single",
            "HasMortgage": "No",
            "HasDependents": "No",
            "LoanPurpose": "Auto",
            "HasCoSigner": getattr(args, "cosigner", "No")
        }

        print("\n========================================================")
        print("   MULTI-AGENT CREDIT UNDERWRITING COMMITTEE SYSTEM     ")
        print("========================================================\n")
        print(f"[*] Dispatching Applicant: Score={applicant['CreditScore']}, Income=${applicant['Income']:,.0f}, Loan=${applicant['LoanAmount']:,.0f}, DTI={applicant['DTIRatio']:.1%}")
        
        result = run_underwriting_pipeline(applicant)
        
        print("\n[+] AGENT AUDIT LOGS:")
        for log in result["agent_logs"]:
            print(f"  [Layer {log['layer']}: {log['agent_name']}] -> Status: {log['status']}")
            print(f"    Summary: {log['summary']}")

        print("\n" + result["credit_committee_synthesis"]["credit_memo"])


if __name__ == "__main__":
    main()
