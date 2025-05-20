// นับจำนวนหัวหน้าจากคอลัมน์สถานะกองงาน
function countLeadersInData(data) {
    // ใช้คอลัมน์สถานะกองงาน
    const columnName = 'สถานะกองงาน';
    
    // นับจำนวนข้อมูลที่มีคำว่า "หัวหน้า"
    const leadersCount = data.filter(row => {
        const value = row[columnName];
        return value && value.toString().includes('หัวหน้า');
    }).length;
    
    // คืนค่าจำนวนที่นับได้
    return leadersCount;
}

// สร้างการ์ดสำหรับแสดงจำนวนหัวหน้า
function createLeadersCard(data) {
    const leadersCount = countLeadersInData(data);
    
    // สร้างการ์ด
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
    <i class="fas fa-building card-icon"></i>
    <h3>จำนวนช่าง<br>(กองงาน)</h3>
    <div class="count-number">${leadersCount.toLocaleString()}</div>
    `;
    
    dashboardElement.appendChild(card);
}

// นับจำนวนช่าง
function countTechsInData(data) {
    // นับจำนวนข้อมูลทั้งหมด
    return data.length;
}

// สร้างการ์ดสำหรับแสดงจำนวนช่าง(คน)
function createTechsCard(data) {
    const techsCount = countTechsInData(data);
    
    // สร้างการ์ด
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
    <i class="fas fa-users card-icon"></i>
    <h3>จำนวนช่าง<br>(คน)</h3>
    <div class="count-number">${techsCount.toLocaleString()}</div>
    `;
    
    dashboardElement.appendChild(card);
}

// นับจำนวนช่างติดตั้ง
function countInstallTechsInData(data) {
    // นับจำนวนข้อมูลที่มีคำว่า "Install" หรือ "Install-Repair" ในคอลัมน์ Type of Provider Group
    const installCount = data.filter(row => {
        const value = row['Type of Provider Group'];
        return value && (value.toString().includes('Install') || value.toString().includes('Install-Repair'));
    }).length;
    
    return installCount;
}

// สร้างการ์ดสำหรับแสดงจำนวนช่างติดตั้ง
function createInstallTechsCard(data) {
    const installCount = countInstallTechsInData(data);
    
    // นับจำนวนกองงานช่างติดตั้ง (นับเฉพาะที่มีคำว่า "หัวหน้า" ในคอลัมน์ "สถานะกองงาน")
    const installGroupCount = data.filter(row => {
        const typeValue = row['Type of Provider Group'];
        const statusValue = row['สถานะกองงาน'];
        return typeValue && 
              (typeValue.toString().includes('Install') || typeValue.toString().includes('Install-Repair')) && 
              statusValue && 
              statusValue.toString().includes('หัวหน้า');
    }).length;
    
    // สร้างการ์ด
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
    <i class="fas fa-tools card-icon"></i>
    <h3>ช่างติดตั้ง</h3>
    <div class="card-detail-line">
        <span class="card-detail-value">${installGroupCount.toLocaleString()}</span>
        <span class="card-detail-label">กองงาน</span>
    </div>
    <div class="card-detail-line">
        <span class="card-detail-value">${installCount.toLocaleString()}</span>
        <span class="card-detail-label">คน</span>
    </div>
    `;
    
    dashboardElement.appendChild(card);
}

// นับจำนวนช่างซ่อม
function countRepairTechsInData(data) {
    // นับจำนวนข้อมูลที่มีคำว่า "Repair" ในคอลัมน์ Type of Provider Group
    const repairCount = data.filter(row => {
        const value = row['Type of Provider Group'];
        return value && (value.toString().includes('Repair') || value.toString().includes('Repair Only'));
    }).length;
    
    return repairCount;
}

// สร้างการ์ดสำหรับแสดงจำนวนช่างซ่อม
function createRepairTechsCard(data) {
    const repairCount = countRepairTechsInData(data);
    
    // นับจำนวนกองงานช่างซ่อม (นับเฉพาะที่มีคำว่า "หัวหน้า" ในคอลัมน์ "สถานะกองงาน")
    const repairGroupCount = data.filter(row => {
        const typeValue = row['Type of Provider Group'];
        const statusValue = row['สถานะกองงาน'];
        return typeValue && 
              (typeValue.toString().includes('Repair') || typeValue.toString().includes('Repair Only')) && 
              statusValue && 
              statusValue.toString().includes('หัวหน้า');
    }).length;
    
    // สร้างการ์ด
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
    <i class="fas fa-wrench card-icon"></i>
    <h3>ช่างซ่อม</h3>
    <div class="card-detail-line">
        <span class="card-detail-value">${repairGroupCount.toLocaleString()}</span>
        <span class="card-detail-label">กองงาน</span>
    </div>
    <div class="card-detail-line">
        <span class="card-detail-value">${repairCount.toLocaleString()}</span>
        <span class="card-detail-label">คน</span>
    </div>
    `;
    
    dashboardElement.appendChild(card);
}

// Create dashboard summary cards for specific columns
function createDashboardSummary(data) {
    if (data.length === 0) return;
    
    // Clear dashboard
    dashboardElement.innerHTML = '';
    
    // Create card for จำนวนหัวหน้าจากคอลัมน์สถานะกองงาน
    createLeadersCard(data);
    
    // Create card for จำนวนช่าง(คน)
    createTechsCard(data);
    
    // Create card for ช่างติดตั้ง
    createInstallTechsCard(data);
    
    // Create card for ช่างซ่อม
    createRepairTechsCard(data);
}

// เพิ่มฟังก์ชันสำหรับสร้างและอัปเดตกราฟ RSM
function createRSMChart(data) {
    const rsmList = [
        'RSM1_BMA-West',
        'RSM2_BMA-East',
        'RSM3_UPC-East',
        'RSM4_UPC-NOR',
        'RSM5_UPC-NOE1',
        'RSM6_UPC-NOE2',
        'RSM7_UPC-CEW',
        'RSM8_UPC-SOU'
    ];

    // นับจำนวนหัวหน้าในแต่ละ RSM
    const rsmCounts = rsmList.map(rsm => {
        return data.filter(row => 
            row['RSM'] === rsm && 
            row['สถานะกองงาน'] && 
            row['สถานะกองงาน'].includes('หัวหน้า')
        ).length;
    });

    // ถ้ามีกราฟอยู่แล้ว ให้ทำลายก่อนสร้างใหม่
    if (rsmChart) {
        rsmChart.destroy();
    }

    // สร้างกราฟใหม่
    const ctx = document.getElementById('rsmChart').getContext('2d');
    rsmChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: rsmList.map(rsm => rsm.split('_')[0]), // แสดงเฉพาะส่วนหน้า _
            datasets: [{
                label: 'จำนวนกองงาน',
                data: rsmCounts,
                backgroundColor: 'rgba(74, 111, 165, 0.8)',
                borderColor: 'rgba(74, 111, 165, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'จำนวนกองงานแยกตาม RSM',
                    font: {
                        size: 16
                    },
                    padding: {
                        top: 10,
                        bottom: 15
                    }
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            layout: {
                padding: {
                    top: 20
                }
            }
        },
        plugins: [{
            afterDraw: function(chart) {
                var ctx = chart.ctx;
                chart.data.datasets.forEach(function(dataset, i) {
                    var meta = chart.getDatasetMeta(i);
                    meta.data.forEach(function(bar, index) {
                        var data = dataset.data[index];
                        ctx.fillStyle = '#000000';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'bottom';
                        ctx.font = '12px Arial';
                        ctx.fillText(data, bar.x, bar.y - 5);
                    });
                });
            }
        }]
    });
} 