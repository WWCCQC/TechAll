// CSV URL
const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSYKfT03Rf95K3lXJf1n20H2aLietUGI0wjFdC21AusbFEVcsT61-BR4v_s3Na9YLcpCIxyWuyOW-uF/pub?gid=813367910&single=true&output=csv";

// Elements
const loadingElement = document.getElementById('loading');
const tableContainerElement = document.getElementById('table-container');
const dataTableElement = document.getElementById('data-table');
const errorMessageElement = document.getElementById('error-message');
const thaiDateElement = document.getElementById('thai-date');
const dashboardElement = document.getElementById('dashboard');
const paginationElement = document.getElementById('pagination');
const searchInputElement = document.getElementById('search-input');
const searchButtonElement = document.getElementById('search-button');
const rowsSelectElement = document.getElementById('rows-select');
const downloadExcelElement = document.getElementById('download-excel');

// Data state
let allData = []; // Original filtered data
let displayData = []; // Data after search filter
let currentPage = 1;
let rowsPerPage = 25; // Default
let searchTerm = '';
let currentSortColumn = ''; // คอลัมน์ที่ใช้เรียงลำดับปัจจุบัน
let currentSortDirection = 'asc'; // ทิศทางการเรียงลำดับปัจจุบัน (asc หรือ desc)
let csvCache = null; // สำหรับเก็บข้อมูล CSV ในหน่วยความจำ
let lastFetchTime = 0; // เวลาที่ดึงข้อมูลครั้งล่าสุด
const CACHE_DURATION = 5 * 60 * 1000; // 5 นาที (เป็นมิลลิวินาที)
let rsmChart = null; // สำหรับเก็บอ็อบเจ็กต์ Chart

// Thai date formatter
function formatThaiDate() {
    const now = new Date();
    const thaiMonths = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    const day = now.getDate();
    const month = thaiMonths[now.getMonth()];
    const year = now.getFullYear() + 543; // Convert to Buddhist Era
    
    // Add time
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    return `วันที่ ${day} ${month} พ.ศ. ${year} เวลา ${hours}:${minutes}:${seconds} น.`;
}

// Update Thai date
function updateThaiDate() {
    thaiDateElement.textContent = formatThaiDate();
}

// Main function to fetch and process data
async function fetchDataAndVisualize() {
    try {
        // Update Thai date
        updateThaiDate();
        
        // Start real-time clock update (ลดเป็น 5 วินาทีต่อครั้ง)
        setInterval(updateThaiDate, 5000);
        
        const now = Date.now();
        
        // ตรวจสอบแคช ถ้ามีและยังไม่หมดอายุให้ใช้แคช
        if (csvCache && (now - lastFetchTime < CACHE_DURATION)) {
            processData(csvCache);
            return;
        }
        
        // Fetch CSV data
        const response = await fetch(csvUrl);
        const csvText = await response.text();
        
        // บันทึกลงแคช
        csvCache = csvText;
        lastFetchTime = now;
        
        // ประมวลผลข้อมูล
        processData(csvText);
    } catch (error) {
        showError("Error fetching data: " + error.message);
    }
}

// Show error message
function showError(message) {
    loadingElement.style.display = 'none';
    errorMessageElement.textContent = message;
    errorMessageElement.style.display = 'block';
}

// Initialize
window.addEventListener('DOMContentLoaded', fetchDataAndVisualize); 