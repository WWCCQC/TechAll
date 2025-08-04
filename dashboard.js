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
    // นับจำนวนข้อมูลที่มีคำว่า "Installation" ในคอลัมน์ Type of work และมีคำว่า "หัวหน้า" หรือ "ลูกน้อง" ในคอลัมน์สถานะกองงาน
    const installCount = data.filter(row => {
        const workValue = row['Type of work'];
        const statusValue = row['สถานะกองงาน'];
        return workValue && 
               workValue.toString().includes('Installation') && 
               statusValue && 
               (statusValue.toString().includes('หัวหน้า') || statusValue.toString().includes('ลูกน้อง'));
    }).length;
    
    return installCount;
}

// สร้างการ์ดสำหรับแสดงจำนวนช่างติดตั้ง
function createInstallTechsCard(data) {
    const installCount = countInstallTechsInData(data);
    
    // นับจำนวนกองงานช่างติดตั้ง (นับเฉพาะที่มีคำว่า "หัวหน้า" ในคอลัมน์ "สถานะกองงาน")
    const installGroupCount = data.filter(row => {
        const typeValue = row['Type of work'];
        const statusValue = row['สถานะกองงาน'];
        return typeValue && 
              typeValue.toString().includes('Installation') && 
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
    // นับจำนวนข้อมูลที่มีคำว่า "Repair" ในคอลัมน์ Type of work และมีคำว่า "หัวหน้า" หรือ "ลูกน้อง" ในคอลัมน์สถานะกองงาน
    const repairCount = data.filter(row => {
        const workValue = row['Type of work'];
        const statusValue = row['สถานะกองงาน'];
        return workValue && 
               workValue.toString().includes('Repair') && 
               statusValue && 
               (statusValue.toString().includes('หัวหน้า') || statusValue.toString().includes('ลูกน้อง'));
    }).length;
    
    return repairCount;
}

// สร้างการ์ดสำหรับแสดงจำนวนช่างซ่อม
function createRepairTechsCard(data) {
    const repairCount = countRepairTechsInData(data);
    
    // นับจำนวนกองงานช่างซ่อม (นับเฉพาะที่มีคำว่า "หัวหน้า" ในคอลัมน์ "สถานะกองงาน")
    const repairGroupCount = data.filter(row => {
        const typeValue = row['Type of work'];
        const statusValue = row['สถานะกองงาน'];
        return typeValue && 
              typeValue.toString().includes('Repair') && 
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

    // นับจำนวนหัวหน้าตาม RSM และ Type of work
    const installationCounts = rsmList.map(rsm => {
        return data.filter(row => 
            row['RSM'] === rsm && 
            row['สถานะกองงาน'] && 
            row['สถานะกองงาน'].includes('หัวหน้า') &&
            row['Type of work'] && 
            row['Type of work'].includes('Installation')
        ).length;
    });

    const repairCounts = rsmList.map(rsm => {
        return data.filter(row => 
            row['RSM'] === rsm && 
            row['สถานะกองงาน'] && 
            row['สถานะกองงาน'].includes('หัวหน้า') &&
            row['Type of work'] && 
            row['Type of work'].includes('Repair')
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
            datasets: [
                {
                    label: 'ช่างติดตั้ง',
                    data: installationCounts,
                    backgroundColor: 'rgba(52, 152, 219, 0.8)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 1
                },
                {
                    label: 'ช่างซ่อม',
                    data: repairCounts,
                    backgroundColor: 'rgba(231, 76, 60, 0.8)',
                    borderColor: 'rgba(231, 76, 60, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'จำนวนกองงานแยกตาม RSM และประเภทงาน',
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
                },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        afterBody: function(context) {
                            const total = context[0].parsed.y + context[1].parsed.y;
                            return `รวม: ${total} กองงาน`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true,
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
                
                // แสดงจำนวนของแต่ละประเภทในกราฟก่อน
                chart.data.datasets.forEach(function(dataset, i) {
                    var meta = chart.getDatasetMeta(i);
                    meta.data.forEach(function(bar, index) {
                        var data = dataset.data[index];
                        if (data > 0) {
                            // คำนวณตำแหน่งกลางของแต่ละส่วนในแท่งกราฟ
                            var yPosition;
                            if (i === 0) {
                                // สำหรับช่างติดตั้ง (ส่วนล่าง) - ตรงกลางของแท่งส่วนล่าง
                                yPosition = bar.y - (bar.height / 2);
                            } else {
                                // สำหรับช่างซ่อม (ส่วนบน) - ตรงกลางของแท่งส่วนบน
                                var bottomBarHeight = chart.getDatasetMeta(0).data[index].height;
                                yPosition = bar.y - bottomBarHeight - (bar.height / 2);
                            }
                            
                            ctx.fillStyle = '#FFFFFF';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.font = 'bold 12px Arial';
                            ctx.fillText(data, bar.x, yPosition);
                        }
                    });
                });
                
                // แสดงจำนวนรวมเหนือกราฟหลังจากแสดงจำนวนในแท่ง
                chart.data.labels.forEach(function(label, index) {
                    const total = chart.data.datasets.reduce((sum, dataset) => sum + dataset.data[index], 0);
                    const bar = chart.getDatasetMeta(0).data[index];
                    
                    // คำนวณตำแหน่งเหนือสุดของแท่งกราฟทั้งสองส่วน
                    const bottomBarHeight = chart.getDatasetMeta(0).data[index].height;
                    const topBarHeight = chart.getDatasetMeta(1).data[index].height;
                    const totalBarHeight = bottomBarHeight + topBarHeight;
                    
                    ctx.fillStyle = '#000000';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                    ctx.font = 'bold 14px Arial';
                    ctx.fillText(total, bar.x, bar.y - totalBarHeight - 5);
                });
            }
        }]
    });
} 