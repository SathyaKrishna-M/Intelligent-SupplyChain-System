# Architecture Scorecard

| Category | Score | Notes |
|----------|-------|-------|
| Maintainability | 6/10 | Heavy reliance on raw `txt` file arrays makes data migrations impossible. Clean service separation helps. |
| Scalability | 3/10 | Ephemeral file storage and in-memory lists block horizontal scaling (cannot run 2 instances). |
| Complexity | 7/10 | Over-engineered for a file-based app, but excellent for academic grading. |
| Readability | 8/10 | Code is well-structured, uses standard naming conventions, and lacks magic numbers. |
| Demo Value | 10/10 | React Cytoscape and Recharts create an incredible visual frontend. |
| Faculty Evaluation Value | 10/10 | Dense usage of theoretical DSAs (Graphs, Trees) heavily pads academic grading rubrics. |
