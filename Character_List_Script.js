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
            parseFloat(cols[6])
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
            for(let j = 0; j < Characters[i].length; j++){
                let cell = row.insertCell();
                cell.innerText = Characters[i][j];
            }
        }
    }
    let bestCharacter = [];
    let elementsCount = [0, 0, 0, 0, 0, 0, 0];
    let weaponsCount = [0, 0, 0, 0, 0];
    let regionsCount = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    let max = [0, 0, 0, 0, 0, 0];

    for (let i = 0; i < filtered.length; i++) {
            let char = filtered[i];
            elementsCount[dataNames[1].indexOf(char[3])]++;
            weaponsCount[dataNames[2].indexOf(char[4])]++;
            regionsCount[dataNames[3].indexOf(char[5])]++;
    }
    max = [elementsCount.indexOf(Math.max(...elementsCount)),
            weaponsCount.indexOf(Math.max(...weaponsCount)),
            regionsCount.indexOf(Math.max(...regionsCount)),
            Math.max(...elementsCount),
            Math.max(...weaponsCount),
            Math.max(...regionsCount)]

    let elementIndex = [max[3], max[4], max[5]];
    elementIndex.sort(function(a, b){return b - a});
    let index = 0;
    for (let i = 0; i < filtered.length; i++) {
        if (elementIndex[0] !== filtered.length){
            index = max.indexOf(elementIndex[0], 3);
            if (filtered[i][index] == dataNames[index-2][max[index-3]]) {
                bestCharacter.push(filtered[i]);
            }
        }
        else if (elementIndex[1] !== filtered.length){
            index = max.indexOf(elementIndex[1], 3);
            if (filtered[i][index] == dataNames[index-2][max[index-3]]) {
                bestCharacter.push(filtered[i]);
            }
        }
        else if (elementIndex[2] !== filtered.length){
            index = max.indexOf(elementIndex[2], 3);
            if (filtered[i][index] == dataNames[index-2][max[index-3]]) {
                bestCharacter.push(filtered[i]);
            }
        }
        else {
            index = max.indexOf(elementIndex[0], 3);
            if (filtered[i][index] == dataNames[index-2][max[index-3]]) {
                bestCharacter.push(filtered[i]);
            }
        }
    }
    const suggestion = document.getElementById("bestParam");
    // suggestion.innerHTML = `Best guess: ${elementIndex},${(max[elementIndex-2])},${weaponsCount.indexOf(max[elementIndex-1])},${regionsCount.indexOf(max[elementIndex])}`;
    if(bestCharacter.length > 0) suggestion.innerHTML = `Best guess: ${bestCharacter[Math.floor((bestCharacter.length-1) / 2)][1]}`;
    else suggestion.innerHTML = "No characters found";
    // suggestion.innerHTML += `<br>Total characters found: ${bestCharacter}`;
    // suggestion.innerHTML += `<br>Total characters found: ${bestCharacter.length}`;
    // suggestion.innerHTML += `<br>Best guess index: ${elementIndex}`;
    // suggestion.innerHTML += `<br>Best guess name: ${dataNames[elementIndex-2][max[elementIndex-3]]} (${max[elementIndex]} characters)`;
    // suggestion.innerHTML += `<br>Best guess element: ${dataNames[1][elementsCount.indexOf(max[3])]} (${max[3]} characters)`;
    // suggestion.innerHTML += `<br>Best guess weapon: ${dataNames[2][weaponsCount.indexOf(max[4])]} (${max[4]} characters)`;
    // suggestion.innerHTML += `<br>Best guess region: ${dataNames[3][regionsCount.indexOf(max[5])]} (${max[5]} characters)`;
    // suggestion.innerHTML += `<br>Total characters found: ${max[elementIndex-3]}`;
}