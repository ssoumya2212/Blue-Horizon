import WDIOReporter from '@wdio/reporter';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';

export default class ExcelReporter extends WDIOReporter {
    private workbook: ExcelJS.Workbook;
    private summarySheet: ExcelJS.Worksheet;
    private parentSheet: ExcelJS.Worksheet;
    private driverSheet: ExcelJS.Worksheet;
    private adminSheet: ExcelJS.Worksheet;
    private defectSheet: ExcelJS.Worksheet;
    private securitySheet: ExcelJS.Worksheet;

    private results = {
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
        duration: 0
    };

    constructor(options: any) {
        super(options);
        this.workbook = new ExcelJS.Workbook();
        this.summarySheet = this.workbook.addWorksheet('Execution Summary');
        this.parentSheet = this.workbook.addWorksheet('Parent Tests');
        this.driverSheet = this.workbook.addWorksheet('Driver Tests');
        this.adminSheet = this.workbook.addWorksheet('Admin Tests');
        this.defectSheet = this.workbook.addWorksheet('Defects');
        this.securitySheet = this.workbook.addWorksheet('Security Findings');

        this.setupHeaders();
    }

    private setupHeaders() {
        this.summarySheet.columns = [
            { header: 'Metric', key: 'metric', width: 20 },
            { header: 'Value', key: 'value', width: 20 }
        ];

        const testColumns = [
            { header: 'Test Case', key: 'testcase', width: 50 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Duration (ms)', key: 'duration', width: 15 },
            { header: 'Error', key: 'error', width: 50 }
        ];

        this.parentSheet.columns = testColumns;
        this.driverSheet.columns = testColumns;
        this.adminSheet.columns = testColumns;

        this.defectSheet.columns = [
            { header: 'Test Case', key: 'testcase', width: 50 },
            { header: 'Error Message', key: 'error', width: 80 }
        ];

        this.securitySheet.columns = [
            { header: 'Finding Category', key: 'category', width: 30 },
            { header: 'Description', key: 'description', width: 80 },
            { header: 'Severity', key: 'severity', width: 15 }
        ];
    }

    onTestEnd(test: any) {
        this.results.total++;
        this.results.duration += test._duration;

        let targetSheet: ExcelJS.Worksheet;
        const testName = test.title.toLowerCase();
        if (testName.includes('parent')) targetSheet = this.parentSheet;
        else if (testName.includes('driver')) targetSheet = this.driverSheet;
        else if (testName.includes('admin')) targetSheet = this.adminSheet;
        else targetSheet = this.parentSheet; // Default to parent for generic tests

        const rowData = {
            testcase: test.title,
            status: test.state,
            duration: test._duration,
            error: test.error ? test.error.message : ''
        };

        targetSheet.addRow(rowData);

        if (test.state === 'passed') {
            this.results.passed++;
        } else if (test.state === 'failed') {
            this.results.failed++;
            this.defectSheet.addRow({
                testcase: test.title,
                error: test.error ? test.error.message : 'Unknown Error'
            });
        } else if (test.state === 'skipped') {
            this.results.skipped++;
        }
    }

    async onRunnerEnd() {
        this.summarySheet.addRows([
            { metric: 'Total Tests', value: this.results.total },
            { metric: 'Passed', value: this.results.passed },
            { metric: 'Failed', value: this.results.failed },
            { metric: 'Skipped', value: this.results.skipped },
            { metric: 'Total Duration (ms)', value: this.results.duration }
        ]);

        const reportDir = path.join(process.cwd(), 'reports');
        if (!fs.existsSync(reportDir)) {
            fs.mkdirSync(reportDir, { recursive: true });
        }

        await this.workbook.xlsx.writeFile(path.join(reportDir, 'mobile-test-report.xlsx'));
    }
}
