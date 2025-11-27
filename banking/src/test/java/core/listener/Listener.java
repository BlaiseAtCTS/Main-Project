package core.listener;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;
import lombok.Getter;
import org.testng.ITestContext;
import org.testng.ITestListener;
import org.testng.ITestResult;

public class Listener implements ITestListener {
    private static ExtentSparkReporter reporter;
    private static ExtentReports reports;
    ThreadLocal<ExtentTest> test = new ThreadLocal<>();

    @Override // when test runner starts
    public void onStart(ITestContext context) {
        reporter = new ExtentSparkReporter(System.getProperty("user.dir")+"/reports/extent_report.html");
        reports = new ExtentReports();
        reports.attachReporter(reporter);
    }

    @Override
    public void onFinish(ITestContext context) {
        System.out.println("Inside onFinish ");
        reports.flush();
    }

    @Override // for each scenario
    public void onTestStart(ITestResult result) {
        String browserName = result.getTestContext().getCurrentXmlTest().getParameter("browser");
        test.set(reports.createTest("["+browserName+"] "+(result.getParameters())[0].toString()));
    }

    @Override
    public void onTestSuccess(ITestResult result) {
        test.get().pass("SUCCESS");
    }

    @Override
    public void onTestFailure(ITestResult result) {
        test.get().fail("FAILED");
    }

    @Override
    public void onTestSkipped(ITestResult result) {
        test.get().skip("SKIPPED");
    }
}
