 //gridUI.js's variables copies here

let collectedSheetDB=[]; //contains all sheetDBs
let sheetDB=[]; //current sheetDB

{
    let addSheetBtn=document.querySelector(".sheet-add-icon");
    addSheetBtn.click();
    handleSheetProperties();
}
 

 //ebar i have to develop a mechanism such that :
 //grid e cell E7 select korle jano storgae matrix eo cell E7 select hoi 
 //so proti ta cell er ekta identification mark dorkar
 // so cell element er jodi duto attribute set kori row and col then done 
 

 //bold button er element
 let bold =document.querySelector(".bold");
 let italic=document.querySelector(".italic");
 let underline=document.querySelector(".underline");

 let fontSize=document.querySelector(".font-size-prop");
 let fontFamily=document.querySelector(".font-family-prop");

 let BGColor=document.querySelector(".BGColor-prop");
 let fontColor=document.querySelector(".font-color-prop");

 let alignment = document.querySelectorAll(".alignment");
 let leftAlign=alignment[0];
    let centerAlign=alignment[1];
    let rightAlign=alignment[2];


//active and inactive color for button
let activeColorProp="#d1d8e0";
let inactiveColorProp="#ecf0f1";


//attach event listeners for these buttons :
bold.addEventListener("click",()=>{
    //bold e click korle currently address bar e 
    //je cell select kora ache oi cell er bold property change hobe

    //address bar e "A1" form e thakbe but cell element er attribute e rid and cid thakbe
    //in number form so we have to convert "A1" to 0,0 form

    //jokhoni kono property te click korbo :(ex: Bold):
    //step 1) Access current cell element from adressBar(char,int)
    //step2) Now decode it to rid,cid
    //step3) ebar query selector kore oi particular cell element select korte hobe
    //step4) ebar amader storage matrix ache so rid,cid diye sheetDB[rid][cid] kore
    // oi partucular cell er state access korte parbo

    //These is two-way binding : data change<----->UI change dutoi hobe

    let address=addressBar.value;

    let [cell,cellProp]=getActiveCell(address);

    //ebar modification :
    cellProp.bold=!cellProp.bold;  //bold thakle normal ar normal thakle bold (toggle)
    cell.style.fontWeight=cellProp.bold?"bold":"normal"; //cell element er style chng
    bold.style.backgroundColor=cellProp.bold?activeColorProp:inactiveColorProp; //button er style chng
    


})

italic.addEventListener("click",()=>{
 
    let address=addressBar.value;

    let [cell,cellProp]=getActiveCell(address);

    //ebar modification :
    cellProp.italic=!cellProp.italic;  //bold thakle normal ar normal thakle bold (toggle)
    cell.style.fontStyle=cellProp.italic?"italic":"normal"; //cell element er style chng
    italic.style.backgroundColor=cellProp.italic?activeColorProp:inactiveColorProp; //button er style chng
    


})
underline.addEventListener("click",()=>{
 
    let address=addressBar.value;

    let [cell,cellProp]=getActiveCell(address);

    //ebar modification :
    cellProp.underline=!cellProp.underline;  //bold thakle normal ar normal thakle bold (toggle)
    cell.style.textDecoration=cellProp.underline?"underline":"none"; //cell element er style chng
    underline.style.backgroundColor=cellProp.underline?activeColorProp:inactiveColorProp; //button er style chng

})

fontSize.addEventListener("change",()=>{
    let address=addressBar.value;

    let [cell,cellProp]=getActiveCell(address);

    //ebar modification :
    cellProp.fontSize=fontSize.value;   //fontsize is a select tag so value is the selected option
    cell.style.fontSize=cellProp.fontSize+"px"; //cell er fontsize change korlam actualy
    fontSize.value=cellProp.fontSize; //select tag er value change korlam

})
fontFamily.addEventListener("change",()=>{
    let address=addressBar.value;

    let [cell,cellProp]=getActiveCell(address);

    //ebar modification :
    cellProp.fontFamily=fontFamily.value;   //fontFamily is a select tag so value is the selected option
    cell.style.fontFamily=cellProp.fontFamily;  //cell er fontFamily change korlam actualy
    fontFamily.value=cellProp.fontFamily; //select tag er value change korlam

})
fontColor.addEventListener("change",()=>{
    let address=addressBar.value;

    let [cell,cellProp]=getActiveCell(address);

    //ebar modification :
    cellProp.fontColor=fontColor.value;   //fontFamily is a select tag so value is the selected option
    cell.style.fontColor=cellProp.fontColor;  //cell er fontFamily change korlam actualy
    fontColor.value=cellProp.fontColor; //select tag er value change korlam

})
BGColor.addEventListener("change", (e) => {
    let address = addressBar.value;
    let [cell, cellProp] = getActiveCell(address);

    cellProp.BGColor = BGColor.value; // Data change
    cell.style.backgroundColor = cellProp.BGColor;
    BGColor.value = cellProp.BGColor;
})
alignment.forEach((alignElem) => {
    alignElem.addEventListener("click", (e) => {
        let address = addressBar.value;
        let [cell, cellProp] = getActiveCell(address);

        let alignValue = e.target.classList[0];
        cellProp.alignment = alignValue; // Data change
        cell.style.textAlign = cellProp.alignment; // UI change (1)

        switch(alignValue) { // UI change (2)
            case "left":
                leftAlign.style.backgroundColor = activeColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "center":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = activeColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "right":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = activeColorProp;
                break;
        }

    })
})


// kono cell e click korle tar properties gulo jeno cell er sathe sync kore

let allCells = document.querySelectorAll(".cell");
for (let i = 0;i < allCells.length;i++) {
    addListenerToAttachCellProperties(allCells[i]);
}

function addListenerToAttachCellProperties(cell) {
    // Work
    cell.addEventListener("click", (e) => {
        let address = addressBar.value;
        let [rid, cid] = decodeRIDCIDFromAddress(address);
        let cellProp = sheetDB[rid][cid];

        // Apply cell Properties
        cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
        cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
        cell.style.textDecoration = cellProp.underline ? "underline" : "none";
        cell.style.fontSize = cellProp.fontSize + "px";
        cell.style.fontFamily = cellProp.fontFamily;
        cell.style.color = cellProp.fontColor;
        cell.style.backgroundColor = cellProp.BGColor === "#000000" ? "transparent" : cellProp.BGColor;
        cell.style.textAlign = cellProp.alignment;
                

        // Apply properties UI Props container
        bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp;
        italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp;
        underline.style.backgroundColor = cellProp.underline ? activeColorProp : inactiveColorProp;
        fontColor.value = cellProp.fontColor;
        BGColor.value = cellProp.BGColor;
       
        fontSize.value = cellProp.fontSize;
        fontFamily.value = cellProp.fontFamily;
        
        switch(cellProp.alignment) { // UI change (2)
            case "left":
                leftAlign.style.backgroundColor = activeColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "center":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = activeColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "right":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = activeColorProp;
                break;
        }
        let formulaBar=document.querySelector(".formula-bar");
        formulaBar.value=cellProp.formula;
        cell.innerText=cellProp.value;
       

        
    })
}





function getActiveCell(address){
    let [rid,cid]=decodeRIDCIDFromAddress(address);
    //rid , cid pe gachi ebar cell element lgbe 
    let cell=document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
    //sheetDB er cell er state access korte hobe
    let cellProp=sheetDB[rid][cid];;

    return [cell,cellProp];

}

function decodeRIDCIDFromAddress(address){
    let rowID=Number(address.substring(1))-1;
    let colID=address.charCodeAt(0)-65;
    return [rowID,colID];
}





