import json

with open("credit_risk_modeling.py", "r", encoding="utf-8") as f:
    lines = f.readlines()

cells = []
current_cell_type = "code"
current_cell_lines = []

for line in lines:
    if line.startswith("# %%"):
        if current_cell_lines:
            cells.append({
                "cell_type": current_cell_type,
                "metadata": {},
                "source": "".join(current_cell_lines)
            })
            current_cell_lines = []
        if "[markdown]" in line:
            current_cell_type = "markdown"
        else:
            current_cell_type = "code"
    else:
        # Strip leading "# " for markdown cells
        if current_cell_type == "markdown":
            if line.startswith("# "):
                line = line[2:]
            elif line.startswith("#"):
                line = line[1:]
        current_cell_lines.append(line)

if current_cell_lines:
    cells.append({
        "cell_type": current_cell_type,
        "metadata": {},
        "source": "".join(current_cell_lines)
    })

notebook = {
    "cells": cells,
    "metadata": {
        "kernelspec": {
            "display_name": "Python 3",
            "language": "python",
            "name": "python3"
        },
        "language_info": {
            "name": "python",
            "version": "3.11"
        }
    },
    "nbformat": 4,
    "nbformat_minor": 4
}

with open("credit_risk_modeling.ipynb", "w", encoding="utf-8") as f:
    json.dump(notebook, f, indent=4)
