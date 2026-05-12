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

let bestCharacters = [];

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("up").addEventListener("input", PrintTable);
    document.getElementById("down").addEventListener("input", PrintTable);
    document.getElementById("equale").addEventListener("input", PrintTable);
    document.getElementById("up").value = "";
    document.getElementById("down").value = "";
    document.getElementById("equale").value = "";
});

function test_function(thing, id, btn){
    thing[id] += 1;
    if (thing[id] == 3) thing[id] = 0;
    
    switch(thing[id]){
        case 0:
            btn.style.backgroundColor = null;
            break;
        case 1:
            btn.style.backgroundColor = "rgb(48, 193, 48)";
            break;
        case 2:
            btn.style.backgroundColor = "rgb(255, 60, 60)";
            break;
    }
    PrintTable();
}

function diference(i){
    var upVersion = parseFloat(document.getElementById("up").value);
    var downVersion = parseFloat(document.getElementById("down").value);
    var equaleVersion = parseFloat(document.getElementById("equale").value);

    if(!isNaN(equaleVersion)){
        return Characters[i][6] == equaleVersion;
    }
    if(!isNaN(upVersion) && !isNaN(downVersion) ){
        return Characters[i][6] > upVersion && Characters[i][6] < downVersion;
    }
    if(!isNaN(upVersion)){
        return Characters[i][6] > upVersion;
    }
    if(!isNaN(downVersion)){
        return Characters[i][6] < downVersion;
    }
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
    let finalScore = Math.round(score * 0.8 + Math.log2(char[7]+1) * 0.2) / 100;

    return finalScore;
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
        bestCharacter = ["", "No character found", "", "", "", "", ""];
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
}

function PrintTable() {
    let filtered = [];
    var table = document.getElementById("Trysss");
    while (table.rows.length > 1) {
        table.deleteRow(1);
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
        if(diference(i) == false){
            canPrint = false;
        }
        if(canPrint){
            filtered.push(Characters[i]);
            let row = table.insertRow();
            for(let j = 0; j < Characters[i].length-1; j++){
                let cell = row.insertCell();
                if (j == 0) {
                    let img = document.createElement("img");
                    img.src = "images/Characters_Icons/" + Characters[i][1] + "_icon.webp";
                    img.alt = Characters[i][1];
                    img.className = "imageSize";
                    cell.appendChild(img);
                    continue;
                }
                cell.innerText = Characters[i][j];
            }
        }
    }
    getBestGuess(filtered);
}
function reset(){
    dataButtons = [
        [0, 0],                     // 4 star, 5 star
        [0, 0, 0, 0, 0, 0, 0],      // Anemo, Geo, Electro, Dendro, Hydro, Pyro, Cryo
        [0, 0, 0, 0, 0],            // Sword, Claymore, Polearm, Bow, Catalyst
        [0, 0, 0, 0, 0, 0, 0, 0, 0] // Mondstadt, Liyue, Inazuma, Sumeru, Fontaine, Natlan, Nod-Krai, Snezhnaya, Outlander
    ];
    document.querySelectorAll(".imageSize").forEach(btn => btn.style.backgroundColor = null);
    document.querySelectorAll(".raritySize").forEach(btn => btn.style.backgroundColor = null);

    if(bestCharacters.length > 0){
        Characters[bestCharacters[0][0]-1][7] += 1; 
    }

    getBestGuess([]);
    var table = document.getElementById("Trysss");
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
    document.getElementById("up").value = "";
    document.getElementById("down").value = "";
    document.getElementById("equale").value = "";
}

function printAll(){
    let print = [];
    for(let i = 0; i < Characters.length; i++){
        print.push(Characters[i][1] + " - " + Characters[i][7]);
    }
    console.log(print);
}