import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';

async function generateMockReport() {
    console.log('Generating Mock Test Execution Report...');
    
    const reportPath = path.join(process.cwd(), 'reports', 'mobile-test-report.xlsx');
    const workbook = new ExcelJS.Workbook();
    
    // Load existing workbook if it exists to preserve Security Findings
    if (fs.existsSync(reportPath)) {
        await workbook.xlsx.readFile(reportPath);
    }

    // Helper to get or create sheet
    const getOrCreateSheet = (name: string) => {
        let sheet = workbook.getWorksheet(name);
        if (!sheet) {
            sheet = workbook.addWorksheet(name);
        }
        return sheet;
    };

    const summarySheet = getOrCreateSheet('Execution Summary');
    const parentSheet = getOrCreateSheet('Parent Tests');
    const driverSheet = getOrCreateSheet('Driver Tests');
    const adminSheet = getOrCreateSheet('Admin Tests');
    const defectSheet = getOrCreateSheet('Defects');

    // Setup Columns
    summarySheet.columns = [
        { header: 'Metric', key: 'metric', width: 20 },
        { header: 'Value', key: 'value', width: 20 }
    ];

    const testColumns = [
        { header: 'Test Case', key: 'testcase', width: 50 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Duration (ms)', key: 'duration', width: 15 },
        { header: 'Error', key: 'error', width: 50 }
    ];

    parentSheet.columns = testColumns;
    driverSheet.columns = testColumns;
    adminSheet.columns = testColumns;

    defectSheet.columns = [
        { header: 'Test Case', key: 'testcase', width: 50 },
        { header: 'Error Message', key: 'error', width: 80 }
    ];

    // Clear existing rows if any (except header)
    [summarySheet, parentSheet, driverSheet, adminSheet, defectSheet].forEach(sheet => {
        sheet.spliceRows(2, sheet.rowCount);
    });

    // Populate Mock Data
    parentSheet.addRows([
        { testcase: 'should login with valid parent credentials', status: 'passed', duration: 4500, error: '' },
        { testcase: 'should show error message on invalid parent login', status: 'passed', duration: 3200, error: '' },
        { testcase: 'should logout parent successfully', status: 'failed', duration: 8100, error: 'Element ~logout-button not interactable' }
    ]);

    driverSheet.addRows([
        { testcase: 'should login with valid driver credentials', status: 'passed', duration: 4100, error: '' },
        { testcase: 'should show error message on invalid driver login', status: 'passed', duration: 2900, error: '' }
    ]);

    adminSheet.addRows([
        { testcase: 'should login with valid admin credentials', status: 'passed', duration: 3800, error: '' },
        { testcase: 'should show error message on invalid admin login', status: 'failed', duration: 5200, error: 'Expected text "Invalid credentials" but found "Network Error"' }
    ]);

    defectSheet.addRows([
        { testcase: 'should logout parent successfully', error: 'Element ~logout-button not interactable' },
        { testcase: 'should show error message on invalid admin login', error: 'Expected text "Invalid credentials" but found "Network Error"' }
    ]);

    summarySheet.addRows([
        { metric: 'Total Tests', value: 7 },
        { metric: 'Passed', value: 5 },
        { metric: 'Failed', value: 2 },
        { metric: 'Skipped', value: 0 },
        { metric: 'Total Duration (ms)', value: 31800 }
    ]);

    // Save
    await workbook.xlsx.writeFile(reportPath);
    console.log('Mock report generated successfully at:', reportPath);
}

generateMockReport().catch(console.error);
