document.addEventListener('DOMContentLoaded', function() {

// lager tabell
const tbody = document.getElementById('scoreTableBody');
const numPlayers = 5;
const numRounds = 5;

for (let round = 1; round <= numRounds; round++) {
    const row = document.createElement('tr');
    // runder
    const roundCell = document.createElement('td');
    roundCell.textContent = round;
    roundCell.className = "font-bold bg-base-300 w-16";
    row.appendChild(roundCell);
    // spillere
    for (let player = 1; player <= numPlayers; player++) {
        const cell = document.createElement('td');
        cell.contentEditable = "true";
        cell.inputMode = "numeric";
        cell.pattern = "[0-9]*";
        cell.className = `row${round}`;
        row.appendChild(cell);
    }
    tbody.appendChild(row);
}

const sumRow = document.createElement('tr');
const sumLabel = document.createElement('td');
sumLabel.textContent = 'Sum';
sumRow.appendChild(sumLabel);

for (let player = 1; player <= numPlayers; player++) {
    const sumCell = document.createElement('td');
    sumCell.contentEditable = "true";
    sumCell.className = "sum bg-base-200";
    sumRow.appendChild(sumCell);
}
tbody.appendChild(sumRow);

//validering 
tbody.addEventListener('input', function(e) {
    // sjekk at tall ender på 0 eller 5, marker celle rød hvis ikke
    const cells = tbody.querySelectorAll('[contenteditable]');
    cells.forEach(cell => {
        const value = cell.textContent.trim();
        if (value && !value.endsWith('0') && !value.endsWith('5')) {
            cell.classList.add('bg-red-200'); //farge her
        } else {
            cell.classList.remove('bg-red-200');
        }
    });

    // marker spiller med lavest poeng - ignorer 0 poeng
    const sums = new Array(numPlayers).fill(0);
    const rows = tbody.querySelectorAll('tr:not(:last-child)');
    rows.forEach(row => {
        const cells = row.querySelectorAll('[contenteditable]');
        cells.forEach((cell, index) => {
            sums[index] += parseInt(cell.textContent) || 0;
        });
    });

    const sumCells = tbody.querySelectorAll('.sum');
    let minSum = Infinity;
    sumCells.forEach((cell, index) => {
        cell.textContent = sums[index];
        if (sums[index] > 0) {
            minSum = Math.min(minSum, sums[index]);
        }
    });

    sumCells.forEach(cell => {
        cell.classList.remove('bg-yellow-100');
        if (parseInt(cell.textContent) === minSum && minSum < Infinity) {
            cell.classList.add('bg-yellow-100');
        }
    });
})
});

//render regler på hovedside markdown 
fetch('regler/regler.md')
  .then(response => response.text())
  .then(text => {
    marked.setOptions({
      gfm: true,
      breaks: true,
      headerIds: true
    });
    document.getElementById('rules-content').innerHTML = marked.parse(text);
  });

// logo roterer med scroll
let rotation = 0;
let scrollLoc = window.pageYOffset;
const maxRotation = 20;

window.addEventListener("scroll", function() {
  let newPos = window.pageYOffset;
  let diff = newPos - scrollLoc;
  rotation += diff * 0.2;
  rotation = Math.max(-maxRotation, Math.min(maxRotation, rotation));
  scrollLoc = newPos;

  document.getElementById("logo").style.transform = `rotate(${rotation}deg)`;
});

// reset logo rotasjon
window.addEventListener("load", function() {
  rotation = 0;
  document.getElementById("logo").style.transform = `rotate(0deg)`;
});