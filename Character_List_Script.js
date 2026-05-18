let Characters = [];

async function loadCharacters() {
    const response = await fetch('Character_List.csv');
    const data = await response.text();
    const lines = data.trim().split('\n');
    Characters = lines.map(line => {
        const cols = line.replace('\r', '').split(';');
        return [
            cols[0],
            cols[1],
            cols[2],
            cols[3],
            cols[4],
            cols[5],
            parseFloat(cols[6]),
            parseInt(cols[7]) || 0
        ];
    });
}

window.onload = loadCharacters;

let dataNames = [
    ["4", "5"], 
    ["Anemo", "Geo", "Electro", "Dendro", "Hydro", "Pyro", "Cryo"], 
    ["Sword", "Claymore", "Polearm", "Bow", "Catalyst"], 
    ["Mondstadt", "Liyue", "Inazuma", "Sumeru", "Fontaine", "Natlan", "Nod-Krai", "Snezhnaya", "Outlander"]
];

let dataButtons = [
    [0, 0],                     // 4 star, 5 star
    [0, 0, 0, 0, 0, 0, 0],      // Anemo, Geo, Electro, Dendro, Hydro, Pyro, Cryo
    [0, 0, 0, 0, 0],            // Sword, Claymore, Polearm, Bow, Catalyst
    [0, 0, 0, 0, 0, 0, 0, 0, 0] // Mondstadt, Liyue, Inazuma, Sumeru, Fontaine, Natlan, Nod-Krai, Snezhnaya, Outlander
];

let dataButtonsVersion = [];

let bestCharacters = [];

function askYesNo(thing, id, btn){
    dataButtons[thing][id]++;
    if(dataButtons[thing][id] > 2) dataButtons[thing][id] = 0;
    changeColor(dataButtons[thing][id], thing, btn.alt)
    PrintTable();
}
function changeColor(color, thing, alt){
    for (let i = 1; i < document.getElementById("ToMuchButtons").rows.length; i++){
        let cellData = document.getElementById("ToMuchButtons").rows[i].cells[thing];
        if (cellData.firstChild.alt == alt){
            switch(color){
                case 0:
                    cellData.style.backgroundColor = null;
                    break;
                case 1:
                    cellData.style.backgroundColor = "rgb(48, 193, 48)";
                    break;
                case 2:
                    cellData.style.backgroundColor = "rgb(255, 60, 60)";
                    break;
            }
        }
    }
}

function checkMinMaxVersion(index){
    let up = [];
    let down = [];
    let equale = [];
    for (let i = 0; i < dataButtonsVersion.length; i++){
        let version = parseFloat(document.getElementById("ToMuchButtons").rows[i+1].cells[4].innerText);
        switch(dataButtonsVersion[i]){
            case 0:
                break;
            case 1:
                up.push(version);
                break
            case 2:
                down.push(version);
                break;
            case 3:
                equale.push(version);
                break;
        }
    }

    if(equale.length > 0){
        return Characters[index][6] == Math.min(...equale);
    }
    if(up.length > 0 && down.length >0){
        return Characters[index][6] > Math.max(...up) && Characters[index][6] < Math.min(...down);
    }
    if(up.length > 0){
        return Characters[index][6] > Math.max(...up);
    }
    if(down.length >0){
        return Characters[index][6] < Math.min(...down);
    }
}

function versionUpDownEquale(btn){
    let id = btn.id;
    dataButtonsVersion[id]++;
    if(dataButtonsVersion[id] > 3) dataButtonsVersion[id] = 0;
    switch(dataButtonsVersion[id]){
        case 0:
            btn.style.backgroundImage = "none";
            break;
        case 1:
            btn.style.backgroundImage = "url('images/UI_Icons/Up_icon.png')";
            break;
        case 2:
            btn.style.backgroundImage = "url('images/UI_Icons/Down_icon.png')";
            break;
        case 3:
            btn.style.backgroundImage = "url('images/UI_Icons/Equal_icon.png')";
            break;
    }
    PrintTable();
}

function getCharacterScore(char, filtered){
    const weights = {element: 4,weapon: 3,region: 2};
    let score = 0;

    for(let i = 0; i < filtered.length; i++){
        let other = filtered[i];

        if(char === other) continue;

        if(char[3] === other[3]) score += weights.element;
        if(char[4] === other[4]) score += weights.weapon;
        if(char[5] === other[5]) score += weights.region;
    }
    // let totalGames = sumColumn(7);
    // let confidence = Math.min(totalGames / 100, 1);
    // let finalScore = Math.round((score *(1 - confidence * 0.2) + char[7] * confidence * 0.2) * 100) / 100;
    // console.log(`Character: ${char[1]}, Score: ${finalScore}`);
    return score;
}

function getBestGuess(filtered){

    bestCharacters = [];
    let bestScore = -1;

    for(let i = 0; i < filtered.length; i++){

        let score =
            getCharacterScore(filtered[i], filtered);

        if(score > bestScore){
            bestScore = score;
            bestCharacters = [filtered[i]];
        }
        else if(score === bestScore){
            bestCharacters.push(filtered[i]);
        }
    }

    bestCharacters.sort((a, b) => a[6] - b[6]);
    
    let bestCharacter = bestCharacters[Math.floor(bestCharacters.length / 2)];

    if(bestCharacter == undefined){
        bestCharacter = ["", "No character found", "", "", "", "", "", ""];
        bestScore = 0;
    }

    document.getElementById("bestImage").src = "images/Characters_Icons/" + bestCharacter[1] + "_icon.webp";
    document.getElementById("bestName").innerText = bestCharacter[1];
    document.getElementById("bestScore").innerText = bestScore;
    document.getElementById("bestCount").innerText = filtered.length;

    document.getElementById("bestElement").innerText = "Element: " + bestCharacter[3];
    document.getElementById("bestWeapon").innerText = "Weapon: " + bestCharacter[4];
    document.getElementById("bestRegion").innerText = "Region: " + bestCharacter[5];
    document.getElementById("bestVersion").innerText = "Version: " + bestCharacter[6];
    document.getElementById("frequency").innerText = "Frequency: " + bestCharacter[7];
}

function PrintTable() {
    let filtered = [];
    var table = document.querySelector("#Trysss tbody");
    while (table.rows.length > 0) {
        table.deleteRow(0);
    }
    for(let i = 0; i < Characters.length; i++){
        let canPrint = true;
        for(let j = 0; j < dataButtons.length; j++){
            for(let k = 0; k < dataButtons[j].length; k++){
                if(dataButtons[j][k] == 2 && Characters[i][j+2] == dataNames[j][k]){
                    canPrint = false;
                }
                if(dataButtons[j][k] == 1 && Characters[i][j+2] != dataNames[j][k]){
                    canPrint = false;
                }
            }
        }
        if(checkMinMaxVersion(i) == false){
            canPrint = false;
        }
        if(canPrint){
            filtered.push(Characters[i]);
        }
    }
    createTable(filtered);
    getBestGuess(filtered);
}
function reset(){
    dataButtons = [
        [0, 0],                     // 4 star, 5 star
        [0, 0, 0, 0, 0, 0, 0],      // Anemo, Geo, Electro, Dendro, Hydro, Pyro, Cryo
        [0, 0, 0, 0, 0],            // Sword, Claymore, Polearm, Bow, Catalyst
        [0, 0, 0, 0, 0, 0, 0, 0, 0] // Mondstadt, Liyue, Inazuma, Sumeru, Fontaine, Natlan, Nod-Krai, Snezhnaya, Outlander
    ];
    dataButtonsVersion = [];

    if(bestCharacters.length > 0){
        Characters[bestCharacters[0][0]-1][7] += 1; 
    }

    getBestGuess([]);
    var charTable = document.getElementById("Trysss");
    while (charTable.rows.length > 1) {
        charTable.deleteRow(1);
    }
    var guessTable = document.getElementById("ToMuchButtons");
    while (guessTable.rows.length > 1){
        guessTable.deleteRow(1);
    }
}

function printAll(){
    let print = [];
    for(let i = 0; i < Characters.length; i++){
        print.push(Characters[i][1] + " - " + Characters[i][7]);
    }
    console.log(print);
}

function sumColumn(column){
    let sum = 0;
    for(let i = 0; i < Characters.length; i++){
        sum += Characters[i][column];
    }
    return sum;
}

function createTable(Charac){
    var table = document.querySelector("#Trysss tbody");

    for(let i = 0; i < Charac.length; i++){
        let row = table.insertRow();
        for(let j = 0; j < Charac[i].length-1; j++){
            let cell = row.insertCell();
            if (j == 0) {
                let img = document.createElement("img");
                img.src = "images/Characters_Icons/" + Charac[i][1] + "_icon.webp";
                img.alt = Charac[i][1];
                img.className = "imageSize";
                img.addEventListener("click", function() {
                    addImageToTable(Charac[i]);
                });
                cell.appendChild(img);
                continue;
            }
            cell.innerText = Charac[i][j];
        }
    }
}

function addImageToTable(character){
    if(document.getElementById("ToMuchButtons").rows.length > 5) return;
    let table = document.querySelector("#ToMuchButtons tbody");
    let row = table.insertRow();
    for(let i = 2; i < 7; i++){
        let cell = row.insertCell();
        if (i != 6){
            let img = document.createElement("img");
            img.src = "images/UI_Icons/" + character[i] + "_icon.png";
            img.alt = character[i];
            if(i == 2) img.className = "raritySize";
            else img.className = "imageSize";
            img.addEventListener("click", function() {
                askYesNo(i-2, dataNames[i-2].indexOf(character[i]), this);
            });
            cell.appendChild(img);
            changeColor(dataButtons[i-2][dataNames[i-2].indexOf(character[i])], i-2, character[i])
        }
        else{
            let btn = document.createElement("button");
            btn.id = document.getElementById("ToMuchButtons").rows.length-2;
            btn.className = "versionButton";
            btn.innerText = character[i];
            btn.style.backgroundImage = "images/UI_Icons/Up_icon.png";
            btn.addEventListener("click", function() {
                versionUpDownEquale(this);
            });
            cell.appendChild(btn);
            dataButtonsVersion.push(0);
        }
    }
}