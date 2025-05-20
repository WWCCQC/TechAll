// ฟังก์ชัน debounce สำหรับการค้นหา
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Search function with debounce
const debouncedSearch = debounce(function() {
    searchData();
}, 300); // รอ 300ms หลังจากหยุดพิมพ์

// Search function
function searchData() {
    searchTerm = searchInputElement.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        displayData = [...allData];
    } else {
        displayData = allData.filter(row => {
            // Search in all columns
            return Object.values(row).some(value => 
                value && value.toString().toLowerCase().includes(searchTerm)
            );
        });
    }
    
    // อัปเดตการ์ดข้อมูลสรุปใหม่หลังการค้นหา
    createDashboardSummary(displayData);
    
    // Apply current sorting if any
    if (currentSortColumn) {
        sortTable(currentSortColumn);
        return; // sortTable will reset page and render
    }
    
    currentPage = 1; // Reset to first page
    renderTable();
}

// Pagination functions
function getPaginatedData() {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return displayData.slice(startIndex, startIndex + rowsPerPage);
}

function getTotalPages() {
    return Math.ceil(displayData.length / rowsPerPage);
}

function renderPagination() {
    const totalPages = getTotalPages();
    
    // Clear pagination
    paginationElement.innerHTML = '';
    
    // Previous button
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '&laquo;';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });
    paginationElement.appendChild(prevButton);
    
    // Page buttons
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // First page button if not visible
    if (startPage > 1) {
        const firstButton = document.createElement('button');
        firstButton.textContent = '1';
        firstButton.addEventListener('click', () => {
            currentPage = 1;
            renderTable();
        });
        paginationElement.appendChild(firstButton);
        
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.style.padding = '0 8px';
            paginationElement.appendChild(ellipsis);
        }
    }
    
    // Page buttons
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = currentPage === i ? 'active' : '';
        pageButton.addEventListener('click', () => {
            currentPage = i;
            renderTable();
        });
        paginationElement.appendChild(pageButton);
    }
    
    // Last page button if not visible
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.style.padding = '0 8px';
            paginationElement.appendChild(ellipsis);
        }
        
        const lastButton = document.createElement('button');
        lastButton.textContent = totalPages;
        lastButton.addEventListener('click', () => {
            currentPage = totalPages;
            renderTable();
        });
        paginationElement.appendChild(lastButton);
    }
    
    // Next button
    const nextButton = document.createElement('button');
    nextButton.innerHTML = '&raquo;';
    nextButton.disabled = currentPage === totalPages || totalPages === 0;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    });
    paginationElement.appendChild(nextButton);
}

// Create and render data table with pagination (ปรับปรุงประสิทธิภาพ)
function renderTable() {
    const paginatedData = getPaginatedData();
    
    if (paginatedData.length === 0) {
        dataTableElement.innerHTML = '<tr><td colspan="100%" style="text-align: center;">ไม่พบข้อมูล</td></tr>';
        paginationElement.innerHTML = '';
        return;
    }
    
    // Get the column names
    const columns = Object.keys(paginatedData[0]);
    
    // Function to format column header with line breaks
    function formatColumnHeader(column) {
        // ไม่ต้องแปลงชื่อคอลัมน์ แค่ตัดคำตามความเหมาะสม
        
        // เพิ่มการตัดบรรทัดตามเครื่องหมายพิเศษหรือตำแหน่งที่เหมาะสม
        if (column.includes(' of ')) {
            return column.replace(' of ', '<br>of<br>');
        } else if (column.includes('_')) {
            return column.replace('_', '<br>');
        } else if (column.includes(' ')) {
            return column.replace(' ', '<br>');
        } else if (column.length > 8) {
            // ถ้าคำยาวเกินไป ให้ตัดคำครึ่งกลาง
            const middle = Math.floor(column.length / 2);
            return column.substring(0, middle) + '<br>' + column.substring(middle);
        }
        return column;
    }
    
    // Define column sizes based on the column name
    const columnSizes = {
        'Area': 'col-sm',
        'Provider': 'col-md',
        'CTM': 'col-sm',
        'RSM': 'col-md',
        'Type of Provider Group': 'col-lg',
        'Type of work': 'col-md',
        'ประเภทการรับงาน': 'col-md',
        'Group': 'col-sm',
        'Province': 'col-sm',
        'Depot_Name': 'col-md',
        'Depot_Code': 'col-sm',
        'จำนวนกองงาน': 'col-sm',
        'จำนวนช่าง': 'col-sm',
        'Tech_Name': 'col-md',
        'Tech_Surename': 'col-md',
        'Tech_ID': 'col-sm',
        'Register_Date': 'col-sm',
        'Expire_Date': 'col-sm',
        'บัตรหมดอายุ(วัน)': 'col-sm',
        'Status': 'col-sm'
    };
    
    // สร้าง table header และ body แยกกันเพื่อลดการ reflow
    let tableHeader = '<thead><tr>';
    let tableBody = '<tbody>';
    
    // Create table header
    columns.forEach(column => {
        const colSize = columnSizes[column] || 'col-md';
        const sortingClass = column === currentSortColumn 
            ? `sorting-${currentSortDirection}` 
            : 'sorting';
        tableHeader += `<th class="${colSize} ${sortingClass}" data-column="${column}">${formatColumnHeader(column)}</th>`;
    });
    tableHeader += '</tr></thead>';
    
    // Create table rows - ใช้ DocumentFragment เพื่อประสิทธิภาพที่ดีขึ้น
    const fragment = document.createDocumentFragment();
    const tempTable = document.createElement('table');
    
    // Create table rows
    paginatedData.forEach(row => {
        let rowHtml = '<tr>';
        columns.forEach(column => {
            const cellValue = row[column] || '';
            // Add data attribute to store full text for tooltip
            rowHtml += `<td class="truncate" data-full-text="${cellValue}">${cellValue}</td>`;
        });
        rowHtml += '</tr>';
        tableBody += rowHtml;
    });
    
    tableBody += '</tbody>';
    
    // อัพเดท DOM เพียงครั้งเดียว
    dataTableElement.innerHTML = tableHeader + tableBody;
    
    // Add sorting event listeners
    document.querySelectorAll('#data-table th').forEach(headerCell => {
        headerCell.addEventListener('click', () => {
            const column = headerCell.getAttribute('data-column');
            sortTable(column);
        });
    });
    
    // Render pagination
    renderPagination();
}

// Sort function
function sortTable(column) {
    // Toggle sort direction if clicking the same column
    if (column === currentSortColumn) {
        currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        currentSortColumn = column;
        currentSortDirection = 'asc';
    }
    
    // Sort the data
    displayData.sort((a, b) => {
        const valueA = a[column] || '';
        const valueB = b[column] || '';
        
        // Check if values are numbers
        const numA = parseFloat(valueA);
        const numB = parseFloat(valueB);
        
        if (!isNaN(numA) && !isNaN(numB)) {
            // Numeric sorting
            return currentSortDirection === 'asc' ? numA - numB : numB - numA;
        } else {
            // String sorting
            const stringA = valueA.toString().toLowerCase();
            const stringB = valueB.toString().toLowerCase();
            
            if (stringA < stringB) {
                return currentSortDirection === 'asc' ? -1 : 1;
            }
            if (stringA > stringB) {
                return currentSortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        }
    });
    
    // Reset to first page and re-render
    currentPage = 1;
    renderTable();
} 