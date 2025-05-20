// เพิ่มการโหลดข้อมูลแบบ lazy loading
function setupLazyLoading() {
    // ตรวจสอบว่าเบราว์เซอร์รองรับ Intersection Observer หรือไม่
    if ('IntersectionObserver' in window) {
        const tableContainer = document.getElementById('table-container');
        
        // สร้าง observer เพื่อดักจับเมื่อตารางปรากฏในหน้าจอ
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // เมื่อตารางปรากฏในหน้าจอ ให้ทำการโหลดข้อมูล
                    renderTable();
                    // ยกเลิกการดักจับหลังจากโหลดเสร็จ
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '100px', // โหลดล่วงหน้าเมื่อใกล้จะเห็นตาราง 100px
            threshold: 0.1 // โหลดเมื่อตารางปรากฏอย่างน้อย 10%
        });
        
        // เริ่มดักจับตาราง
        observer.observe(tableContainer);
    } else {
        // ถ้าเบราว์เซอร์ไม่รองรับ Intersection Observer ให้โหลดตารางตามปกติ
        renderTable();
    }
}

// ปรับปรุงฟังก์ชัน processData ให้ใช้ lazy loading
function processData(csvText) {
    Papa.parse(csvText, {
        header: true,
        complete: function(results) {
            const data = results.data;
            const columnsToKeep = [0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 16, 17, 18, 19, 22, 24, 25, 27, 31];
            const filteredData = filterColumns(data, columnsToKeep);
            
            // กรอง "MPLS" และ "Other" ออกจากคอลัมน์ "Type of work"
            filteredData.forEach(row => {
                if (row['Type of work'] === 'MPLS' || row['Type of work'] === 'Other') {
                    row['Type of work'] = '';
                }
            });
            
            allData = filteredData;
            displayData = [...allData];
            
            loadingElement.style.display = 'none';
            document.getElementById('dashboard').style.display = 'flex';
            document.getElementById('chart-container').style.display = 'block';
            tableContainerElement.style.display = 'block';
            
            createDashboardSummary(filteredData);
            createRSMChart(filteredData);
            createFilterOptions();
            setupLazyLoading();
        },
        error: function(error) {
            showError("Error parsing CSV: " + error.message);
        }
    });
}

// Filter columns from data
function filterColumns(data, columnsToKeep) {
    if (data.length === 0) return [];
    
    // Get all column names
    const allColumns = Object.keys(data[0]);
    
    // Define the columns to keep (by their indices - 0-based for JavaScript)
    // A,B,D,E,F,G,H,I,J,K,L,N,P,Q,R,S,T,W,Y,Z,AB,AF
    // เลือกตามอักษร: A=0, B=1, D=3, E=4, F=5, G=6, H=7, I=8, J=9, K=10, L=11, N=13, P=15, Q=16, R=17, S=18, T=19, W=22, Y=24, Z=25, AB=27, AF=31
    const selectedColumnIndices = [0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 16, 17, 18, 19, 22, 24, 25, 27, 31];
    
    // Create a filtered subset of columns to keep
    const selectedColumns = selectedColumnIndices.map(index => {
        // Make sure index is within bounds
        if (index < allColumns.length) {
            return allColumns[index];
        }
        return null;
    }).filter(col => col !== null);
    
    // Get column B name (index 1) and column I name (index 8)
    const columnBName = allColumns[1];
    const columnIName = allColumns[8]; // Column I
    
    // Create new data array with only the selected columns AND filtered rows
    return data
        .filter(row => {
            // กรองเงื่อนไขเดิม: (row[columnBName] === "WW-Provider" || row[columnBName] === "เถ้าแก่เทค") และ row[columnIName] !== "TVG"
            const basicCondition = (row[columnBName] === "WW-Provider" || row[columnBName] === "เถ้าแก่เทค") && row[columnIName] !== "TVG";
            
            // เพิ่มเงื่อนไขสำหรับกรอง Type of work 
            // ตรวจสอบว่ามีคอลัมน์ที่เป็น Type of work หรือไม่
            const columnTypeOfWork = selectedColumns.find(col => col === 'Type of work');
            
            // ถ้ามีคอลัมน์ Type of work ให้กรองแถวที่มีค่า MPLS หรือ Other ออก
            if (columnTypeOfWork && (row[columnTypeOfWork] === 'MPLS' || row[columnTypeOfWork] === 'Other')) {
                return false; // ไม่นำแถวนี้มาใช้
            }
            
            return basicCondition; // ใช้เงื่อนไขเดิม
        })
        .map(row => {
            const newRow = {};
            selectedColumns.forEach(col => {
                if (col === 'Type of work' && (row[col] === 'MPLS' || row[col] === 'Other')) {
                    newRow[col] = ''; // กำหนดให้เป็นค่าว่าง
                } else {
                    newRow[col] = row[col];
                }
            });
            return newRow;
        });
} 