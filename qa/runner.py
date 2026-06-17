import subprocess
import sys
import os

def main():
    print("==================================================")
    print(" SUPPLY CHAIN OS - QA AUTOMATION FRAMEWORK RUNNER ")
    print("==================================================")
    
    qa_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(qa_dir)
    reports_dir = os.path.join(qa_dir, 'reports')
    
    os.makedirs(reports_dir, exist_ok=True)
    report_path = os.path.join(reports_dir, 'test_report.html')
    
    print(f"\n[INFO] Starting Test Execution...")
    print(f"[INFO] Report will be generated at: {report_path}\n")
    
    # We must add qa/ to PYTHONPATH so 'config.settings' can be resolved from within tests
    env = os.environ.copy()
    env["PYTHONPATH"] = qa_dir
    
    # Construct the pytest command
    # --html generates the report, --self-contained-html embeds assets (CSS/images)
    # -v for verbose output
    cmd = [
        sys.executable, "-m", "pytest",
        os.path.join(qa_dir, 'tests'),
        "-v",
        f"--html={report_path}",
        "--self-contained-html"
    ]
    
    # Run the tests
    result = subprocess.run(cmd, env=env)
    
    print("\n==================================================")
    if result.returncode == 0:
        print(" SUCCESS: All tests passed! (100% Success Rate)")
    else:
        print(" WARNING: Some tests failed. Please review the HTML report.")
    print("==================================================")
    print(f"Report Location: file:///{report_path.replace(os.sep, '/')}")

if __name__ == "__main__":
    main()
