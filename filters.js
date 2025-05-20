// เพิ่มฟังก์ชันสำหรับ filter ข้อมูลแบบมีส่วนร่วม
function createFilterOptions() {
    // ตรวจสอบและลบ filter container เดิมถ้ามี
    const existingFilters = document.querySelectorAll('.filter-container');
    existingFilters.forEach(filter => filter.remove());
    
    // สร้างตัวกรองตามคอลัมน์ที่เลือก
    const filterContainer = document.createElement('div');
    filterContainer.className = 'filter-container';
    filterContainer.style.display = 'flex';
    filterContainer.style.flexWrap = 'wrap';
    filterContainer.style.gap = '10px';
    
    // สร้างตัวเลือกคอลัมน์สำหรับ filter
    const columns = Object.keys(allData[0] || {});
    // กำหนดลำดับของตัวกรองใหม่ โดยเพิ่ม "Type of work" และ "RSM" ไว้หน้า "Province"
    const importantColumns = ['Provider', 'Type of Provider Group', 'RSM', 'Province'];
    
    importantColumns.forEach(column => {
        if (!columns.includes(column)) return;
        
        // สร้างค่าที่เป็นไปได้ทั้งหมดของคอลัมน์
        let uniqueValues = [...new Set(allData.map(item => item[column]).filter(Boolean))];
        
        // กรองคำว่า "MPLS" และ "Other" ออกจาก "Type of work"
        if (column === 'Type of work') {
            uniqueValues = uniqueValues.filter(value => value !== 'MPLS' && value !== 'Other');
        }
        
        if (uniqueValues.length <= 1) return; // ข้ามถ้ามีค่าเดียวหรือไม่มีค่า
        
        // สร้าง multiselect dropdown
        const filterGroup = document.createElement('div');
        filterGroup.style.display = 'flex';
        filterGroup.style.flexDirection = 'column';
        
        const label = document.createElement('div');
        label.textContent = formatColumnHeaderText(column) + ':';
        label.className = 'filter-label';
        
        // สร้าง multiselect dropdown
        const multiselect = document.createElement('div');
        multiselect.className = 'multiselect-dropdown';
        multiselect.setAttribute('data-column', column);
        
        // สร้าง header ของ multiselect
        const header = document.createElement('div');
        header.className = 'multiselect-dropdown-header';
        
        const headerText = document.createElement('div');
        headerText.className = 'multiselect-dropdown-header-text';
        headerText.textContent = 'ทั้งหมด';
        
        header.appendChild(headerText);
        
        // สร้าง content ของ multiselect
        const content = document.createElement('div');
        content.className = 'multiselect-dropdown-content';
        
        // เพิ่มตัวเลือก "เลือกทั้งหมด"
        const selectAllDiv = document.createElement('div');
        selectAllDiv.className = 'multiselect-select-all';
        
        const selectAllCheckbox = document.createElement('input');
        selectAllCheckbox.type = 'checkbox';
        selectAllCheckbox.checked = true;
        selectAllCheckbox.addEventListener('change', function() {
            const options = content.querySelectorAll('.multiselect-option input');
            options.forEach(option => {
                option.checked = this.checked;
            });
            updateMultiselectHeader(multiselect, uniqueValues);
            applyFilters();
        });
        
        const selectAllLabel = document.createTextNode('เลือกทั้งหมด');
        
        selectAllDiv.appendChild(selectAllCheckbox);
        selectAllDiv.appendChild(selectAllLabel);
        content.appendChild(selectAllDiv);
        
        // เพิ่มตัวเลือกทั้งหมด
        uniqueValues.sort().forEach(value => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'multiselect-option';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = value;
            checkbox.checked = true;
            checkbox.addEventListener('change', function() {
                // ตรวจสอบว่าทุกช่องถูกติ๊กหรือไม่
                const allOptions = content.querySelectorAll('.multiselect-option input');
                const allChecked = Array.from(allOptions).every(opt => opt.checked);
                
                // อัปเดตสถานะของเลือกทั้งหมด
                const selectAllCheckbox = content.querySelector('.multiselect-select-all input');
                selectAllCheckbox.checked = allChecked;
                
                updateMultiselectHeader(multiselect, uniqueValues);
                applyFilters();
            });
            
            const optionLabel = document.createTextNode(value);
            
            optionDiv.appendChild(checkbox);
            optionDiv.appendChild(optionLabel);
            content.appendChild(optionDiv);
        });
        
        // เพิ่ม event listener สำหรับการเปิด/ปิด dropdown
        header.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            content.classList.toggle('show');
            
            // ปิด dropdown อื่นๆ ที่อาจเปิดอยู่
            document.querySelectorAll('.multiselect-dropdown-content.show').forEach(dropdown => {
                if (dropdown !== content) {
                    dropdown.classList.remove('show');
                    dropdown.previousElementSibling.classList.remove('active');
                }
            });
        });
        
        // ปิด dropdown เมื่อคลิกที่อื่น
        document.addEventListener('click', function() {
            content.classList.remove('show');
            header.classList.remove('active');
        });
        
        // ป้องกันการปิด dropdown เมื่อคลิกภายใน dropdown
        content.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        multiselect.appendChild(header);
        multiselect.appendChild(content);
        
        filterGroup.appendChild(label);
        filterGroup.appendChild(multiselect);
        filterContainer.appendChild(filterGroup);
    });
    
    // เพิ่มเข้าไปในหน้าเว็บ
    if (filterContainer.children.length > 0) {
        const tableControls = document.querySelector('.table-controls');
        tableControls.parentNode.insertBefore(filterContainer, tableControls.nextSibling);
    }
}

// ฟังก์ชันอัปเดตข้อความของ multiselect header
function updateMultiselectHeader(multiselect, allValues) {
    const header = multiselect.querySelector('.multiselect-dropdown-header-text');
    const checkboxes = multiselect.querySelectorAll('.multiselect-option input');
    const checkedBoxes = Array.from(checkboxes).filter(cb => cb.checked);
    
    if (checkedBoxes.length === 0) {
        header.textContent = 'ไม่มีที่เลือก';
    } else if (checkedBoxes.length === checkboxes.length) {
        header.textContent = 'ทั้งหมด';
    } else if (checkedBoxes.length <= 2) {
        header.textContent = checkedBoxes.map(cb => cb.value).join(', ');
    } else {
        header.textContent = `เลือก ${checkedBoxes.length} รายการ`;
    }
}

// แปลงชื่อคอลัมน์เป็นข้อความสำหรับ label
function formatColumnHeaderText(column) {
    // คืนค่าชื่อคอลัมน์เดิมโดยไม่มีการแปลง
    return column;
}

// ประมวลผล filter ทั้งหมด
function applyFilters() {
    const filters = {};
    
    // รวบรวมค่า filter ทั้งหมด
    document.querySelectorAll('.multiselect-dropdown').forEach(multiselect => {
        const column = multiselect.getAttribute('data-column');
        const selectedValues = Array.from(
            multiselect.querySelectorAll('.multiselect-option input:checked')
        ).map(cb => cb.value);
        
        if (selectedValues.length > 0 && selectedValues.length < multiselect.querySelectorAll('.multiselect-option input').length) {
            filters[column] = selectedValues;
        }
    });
    
    // กรองข้อมูล
    if (Object.keys(filters).length === 0) {
        displayData = searchTerm ? 
            allData.filter(row => Object.values(row).some(val => 
                val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )) : 
            [...allData];
    } else {
        displayData = allData.filter(row => {
            return Object.keys(filters).every(column => {
                return filters[column].includes(row[column]);
            });
        });
        
        if (searchTerm) {
            displayData = displayData.filter(row => 
                Object.values(row).some(val => 
                    val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
    }
    
    // อัปเดตการ์ดข้อมูลสรุปและกราฟ
    createDashboardSummary(displayData);
    createRSMChart(displayData);
    
    currentPage = 1;
    renderTable();
}

// Download Excel function
function downloadExcel() {
    if (displayData.length === 0) {
        alert('ไม่มีข้อมูลที่จะดาวน์โหลด');
        return;
    }
    
    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(displayData);
    
    // Create workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    
    // Generate Excel file and trigger download
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    XLSX.writeFile(workbook, `data_export_${dateStr}.xlsx`);
}

// Setup event listeners
function setupEventListeners() {
    // Event listeners
    searchButtonElement.addEventListener('click', debouncedSearch);
    
    searchInputElement.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            debouncedSearch();
        } else {
            // ค้นหาอัตโนมัติขณะพิมพ์
            debouncedSearch();
        }
    });
    
    rowsSelectElement.addEventListener('change', function() {
        rowsPerPage = parseInt(this.value);
        currentPage = 1; // Reset to first page
        renderTable();
    });
    
    downloadExcelElement.addEventListener('click', downloadExcel);
    
    // Add refresh button event listener
    document.getElementById('refresh-button').addEventListener('click', function() {
        // แสดง loading ระหว่างรีเฟรช
        loadingElement.style.display = 'block';
        tableContainerElement.style.display = 'none';
        document.getElementById('dashboard').style.display = 'none';
        document.getElementById('chart-container').style.display = 'none';
        
        // รีเซ็ตแคชและดึงข้อมูลใหม่
        csvCache = null;
        lastFetchTime = 0;
        
        // ดึงข้อมูลใหม่
        setTimeout(() => {
            fetchDataAndVisualize();
        }, 100); // เพิ่มการหน่วงเวลาเล็กน้อยเพื่อให้ UI อัพเดทก่อน
    });
}

// Initialize event listeners when document is ready
document.addEventListener('DOMContentLoaded', setupEventListeners); 