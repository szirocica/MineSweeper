window.addEventListener("DOMContentLoaded", event => {
  const audio = document.querySelector("audio");
  audio.volume = 0.05;
  audio.play();
});

var minefield = document.getElementById("minefield");
var radio = document.getElementsByName("diff");
var neheseg;

// valtozo a jatekteruletnek
let game_area;
// mennyitol szamoljunk vissza
let time = 3;

generateMinefield();


function diff() {
  //nehesegi szint atallitasa
  var asd = 0;
  for (var i = 0; i < radio.length; i++) {
    if(radio[i].checked) {
      asd = radio[i].value;
      console.log(asd);
    }
  }
  return asd;
}

function generateMinefield() {

  //aknamezo generalasa

  //aknamezo tartalmanak torlese
  minefield.innerHTML = "";

  //nehezsegi szint
  neheseg = diff();

  //uj aknamezo generalasa
  for (var i = 0; i < neheseg; i++) {
    row = minefield.insertRow(i);
    for (var j = 0; j < neheseg; j++) {
      cell = row.insertCell(j);
      cell.onclick = function() {
        clickCell(this);
      };
      var mine = document.createAttribute("felderitetlen");       
      mine.value = "false";             
      cell.setAttributeNode(mine);
    }
  }
  //feltoltes aknakkal
  addMines();
}

function addMines() {
  //aknak random elhelyezese

  for (var i = 0; i < (neheseg*2); i++) {
    var row = Math.floor(Math.random() * neheseg);
    var col = Math.floor(Math.random() * neheseg);
    var cell = minefield.rows[row].cells[col];
    cell.setAttribute("felderitetlen","true"); 
  }
}

function revealMines() {
    //az aknak megjelolese pirossal
    for (var i = 0; i < neheseg; i++) {
      for(var j = 0; j < neheseg; j++) {
        var cell = minefield.rows[i].cells[j];
        if (cell.getAttribute("felderitetlen") == "true") {
          cell.className = "akna";
        }
      }
    }
}

function checkLevelCompletion() {
  //annak leellenorzese, h a jatekos minden aknak felderitett-e
  var levelComplete = true;
    for (var i = 0; i < neheseg; i++) {
      for(var j = 0; j < neheseg; j++) {
        if ((minefield.rows[i].cells[j].getAttribute("felderitetlen") == "false") && 
          (minefield.rows[i].cells[j].innerHTML == "")) levelComplete=false;
      }
  }
  if (levelComplete) {
    alert("Győztél!");
    revealMines();
  }
}

function clickCell(cell) {
  //a jatekos aknara lepett-e?
  if (cell.getAttribute("felderitetlen") == "true") {
    revealMines();
    alert("Vesztettél!");
  } else {
    cell.className = "clicked";
    //lehetseges aknak szamanak felfedese
    var mineCount = 0;
    var cellRow = cell.parentNode.rowIndex;
    var cellCol = cell.cellIndex;
    for (var i = Math.max(cellRow-1,0); i <= Math.min(cellRow + 1,9); i++) {
      for(var j = Math.max(cellCol-1,0); j <= Math.min(cellCol + 1,9); j++) {
        if (minefield.rows[i].cells[j].getAttribute("felderitetlen") == "true") mineCount++;
      }
    }
    cell.innerHTML = mineCount;
    if (mineCount == 0) { 
      //minden olyan egybefuggo mezo felfedése, amin nincs akna
      for (var i = Math.max(cellRow-1,0); i <= Math.min(cellRow + 1,9); i++) {
        for(var j = Math.max(cellCol-1,0); j <= Math.min(cellCol + 1,9); j++) {
          if (minefield.rows[i].cells[j].innerHTML == "") clickCell(minefield.rows[i].cells[j]);
        }
      }
    }
    checkLevelCompletion();
  }
}