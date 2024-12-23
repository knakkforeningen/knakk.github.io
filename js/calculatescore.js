document.addEventListener('DOMContentLoaded', function() {    
    const scoreTable = document.getElementById('scoreTable');
    
    //kalkulator
    scoreTable.addEventListener('input', function(e) {
    const target = e.target;
    const cellIndex = Array.from(target.parentElement.children).indexOf(target);
    const columnIndex = cellIndex - 1;
    const rows = Array.from(scoreTable.rows);

    if (target.tagName === 'TD' && columnIndex >= 0) {
        for (let i = 1; i < rows.length - 1; i++) {
            const cellValue = parseFloat(rows[i].cells[cellIndex].textContent.trim()) || 0;
            if (!isNaN(cellValue)) {
                localStorage.setItem(`cellValue${i}-${columnIndex}`, cellValue); //cache it 
            }
        }

        let sum = 0;
        for (let i = 1; i < rows.length - 1; i++) {
            const savedCellValue = parseFloat(localStorage.getItem(`cellValue${i}-${columnIndex}`)) || 0;
            sum += savedCellValue;
        }
        rows[rows.length - 1].cells[cellIndex].textContent = sum;
        localStorage.setItem(`columnSum${columnIndex}`, sum); 
    }
});

// viser lokal cache data
window.addEventListener('load', function() {
    for (let i = 1; i < scoreTable.rows[0].cells.length; i++) {
        let sum = 0;
        for (let j = 1; j < scoreTable.rows.length - 1; j++) {
            const savedCellValue = parseFloat(localStorage.getItem(`cellValue${j}-${i - 1}`)) || 0;
            scoreTable.rows[j].cells[i].textContent = savedCellValue;
            sum += savedCellValue;
        }
        scoreTable.rows[scoreTable.rows.length - 1].cells[i].textContent = sum;
        localStorage.setItem(`columnSum${i - 1}`, sum);
    }
});
document.getElementById('clearFormButton').addEventListener('click', function() {
    location.reload();
});
});

// tøm cache ved refresh side  
window.addEventListener('beforeunload', function() {
    localStorage.clear();
});
// Tøm knapp
const clearButton = document.createElement('button');
clearButton.textContent = 'Clear Form';
document.body.appendChild(clearButton);