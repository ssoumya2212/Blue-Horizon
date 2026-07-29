import * as fs from 'fs';
import * as path from 'path';
import * as ExcelJS from 'exceljs';

async function analyzeApk() {
    console.log('Starting APK Analysis...');
    
    // Create or open the existing excel report
    const reportPath = path.join(process.cwd(), 'reports', 'mobile-test-report.xlsx');
    const workbook = new ExcelJS.Workbook();
    
    if (fs.existsSync(reportPath)) {
        await workbook.xlsx.readFile(reportPath);
    }

    let securitySheet = workbook.getWorksheet('Security Findings');
    if (!securitySheet) {
        securitySheet = workbook.addWorksheet('Security Findings');
        securitySheet.columns = [
            { header: 'Finding Category', key: 'category', width: 30 },
            { header: 'Description', key: 'description', width: 80 },
            { header: 'Severity', key: 'severity', width: 15 }
        ];
    }

    const findings: Array<{ category: string, description: string, severity: string }> = [];

    // Analyze AndroidManifest.xml
    const manifestPath = path.join(process.cwd(), '../app/src/main/AndroidManifest.xml');
    if (fs.existsSync(manifestPath)) {
        const manifestContent = fs.readFileSync(manifestPath, 'utf8');
        
        // Check for android:debuggable
        if (manifestContent.includes('android:debuggable="true"')) {
            findings.push({
                category: 'Insecure Configuration',
                description: 'The application is debuggable (android:debuggable="true"). This is highly insecure for production.',
                severity: 'High'
            });
        }
        
        // Check for cleartext traffic
        if (manifestContent.includes('android:usesCleartextTraffic="true"')) {
            findings.push({
                category: 'Network Security',
                description: 'Cleartext traffic is allowed. This can lead to man-in-the-middle (MITM) attacks.',
                severity: 'High'
            });
        }

        // Check for risky permissions
        const riskyPermissions = [
            'READ_EXTERNAL_STORAGE',
            'WRITE_EXTERNAL_STORAGE',
            'ACCESS_FINE_LOCATION',
            'READ_CONTACTS',
            'CAMERA'
        ];

        riskyPermissions.forEach(perm => {
            if (manifestContent.includes(`android.permission.${perm}`)) {
                findings.push({
                    category: 'Permission Analysis',
                    description: `Application requests risky permission: ${perm}`,
                    severity: 'Medium'
                });
            }
        });
    } else {
        findings.push({
            category: 'Analysis Error',
            description: 'AndroidManifest.xml not found at expected path.',
            severity: 'Low'
        });
    }

    // Add findings to sheet
    findings.forEach(finding => {
        securitySheet!.addRow(finding);
    });

    const reportDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
    }

    await workbook.xlsx.writeFile(reportPath);
    console.log(`Security analysis completed. ${findings.length} findings recorded.`);
}

analyzeApk().catch(console.error);
