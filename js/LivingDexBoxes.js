
//old function but i decided to keep it just in case
/*function OrganiseIntoBoxes() {
    var listItems = document.getElementsByClassName('ListPokemonName'),

     PokemonSplit = map(listItems, getText);

    //Split Pokemon list into an array
    const $boxes = $('.boxes');
    $boxes.empty();
    const howManyBoxesNeeded = Math.ceil(PokemonSplit.length / 30);

    //Display boxes
    for (let boxNumber = 1; boxNumber <= howManyBoxesNeeded; boxNumber++) {
        //Create a new box for each set of 30 Pokemon
        const $box = $(`<div class="box box${boxNumber}"><div class=boxTitle>Box ${boxNumber}</div></div>`);
        
        //Loop through slots in each box
        for (let slotNumber = 0; slotNumber < 30; slotNumber++) {
            if (PokemonSplit[0] === undefined) PokemonSplit[0]=""; //If no more Pokemon left add empty spaces

            const pokemonName = PokemonSplit.shift() || ""; 
            $box.append(`
                <div class="slot">
                  <div class="ListPokemonName">
                      ${pokemonName}
                      <div class="rmbutton">x</div>
                    </div>
                </div>`
            );
        }
        $boxes.append($box);
    }
}*/


//when page gets inicialised
var boxCount = 0
var pokemonCount = 0
var boxCount = 0;
var pokemonCount = 0
let boxToRemove = null;

var input = document.getElementById("pokemonInput");

var options = "";
  
for(let i=0; i< all_pokemon_with_variants.length; i++){
  options+= "<option value='"+all_pokemon_with_variants[i].toLowerCase()+"'>"+all_pokemon_with_variants[i]+"</option>";
}
$("#pokemonInput").html(options);
all_pokemon_with_variants.shift()

var options = "";

for(let i=0; i< presets.length; i++){
options+= "<option value='"+presets[i].toLowerCase()+"'>"+presets[i]+"</option>";
}
$("#presetInput").html(options);

const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('draggable-initialized')) {
        makeSlotsDraggable(entry.target);
        entry.target.classList.add('draggable-initialized');

        const removeButton = entry.target.querySelector('.removeButton');
        if (removeButton) {
            removeButton.addEventListener('click', removeFromList, false);
        }
    }
});
});
;

//Execute a function when the user presses a key on the keyboard
input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("addPokemon").click();
  }
});

//open dialog box
function dialogOpen(id){
  const dialog = document.getElementById(id); 
  dialog.show()
}

//close dialog box
function dialogClose(id){
  const dialog = document.getElementById(id); 
  dialog.close()
}

function DownloadExcel() {
  var listItems = document.getElementsByClassName('pokemonName');
  var PokemonSplit = Array.from(listItems).map(item => item.innerText.trim());
  
  const wb = XLSX.utils.book_new();
  const howManyBoxesNeeded = Math.ceil(PokemonSplit.length / 30);
  var boxes = [];
  for (let boxNumber = 1; boxNumber <= howManyBoxesNeeded; boxNumber++) {
      //Add a title to the box
      boxes.push([
        { v: `Box ${boxNumber}`, t: "s", s: {fill: { fgColor: { rgb: "77ccff" } }, alignment: { vertical: "center", horizontal: "center" }, font: { bold: true, color: { rgb: "000000" } }, border: { top: { style: "thin", color: { rgb: "000000" } }, right: { style: "thin", color: { rgb: "000000" } }, bottom: { style: "thin", color: { rgb: "000000" } }, left: { style: "thin", color: { rgb: "000000" } } } } },
        { v: "", s: {fill: { fgColor: { rgb: "77ccff" } }, border: { top: { style: "thin", color: { rgb: "000000" } }, bottom: { style: "thin", color: { rgb: "000000" } } } } },
        { v: "", s: {fill: { fgColor: { rgb: "77ccff" } }, border: { top: { style: "thin", color: { rgb: "000000" } }, bottom: { style: "thin", color: { rgb: "000000" } } } } },
        { v: "", s: {fill: { fgColor: { rgb: "77ccff" } }, border: { top: { style: "thin", color: { rgb: "000000" } }, bottom: { style: "thin", color: { rgb: "000000" } } } } },
        { v: "", s: {fill: { fgColor: { rgb: "77ccff" } }, border: { top: { style: "thin", color: { rgb: "000000" } }, bottom: { style: "thin", color: { rgb: "000000" } } } } },
        { v: "", s: {fill: { fgColor: { rgb: "77ccff" } }, border: { top: { style: "thin", color: { rgb: "000000" } }, right: { style: "thin", color: { rgb: "000000" } }, bottom: { style: "thin", color: { rgb: "000000" } } } } }
    ]);
      //Add pokemon names to sheet
      for (let row = 0; row < 5; row++) {
          let Tablerow = [];
          for (let col = 0; col < 6; col++) {
              const pokemonName = PokemonSplit.shift() || "";
              Tablerow.push({ v: pokemonName, t: "s", s: { alignment: { vertical: "center", horizontal: "center" }, border: { top: { style: "thin", color: { rgb: "000000" } }, right: { style: "thin", color: { rgb: "000000" } }, bottom: { style: "thin", color: { rgb: "000000" } }, left: { style: "thin", color: { rgb: "000000" } } } } });
          }
          boxes.push(Tablerow);
      }
      //Add an empty box for aesthetics
      boxes.push([]);
  }
  const ws = XLSX.utils.aoa_to_sheet(boxes);

  //Merge cells for the titles
  ws["!merges"] = [];
  for (let boxNumber = 0; boxNumber < howManyBoxesNeeded; boxNumber++) {
      ws["!merges"].push(
          { s: { c: 0, r: boxNumber * 7 }, e: { c: 5, r: boxNumber * 7 } } //Title merge for each box
      );
  }

let maxWidth = 0;
const columnCount = 6;

for (let col = 0; col < columnCount; col++) {
    for (let row = 1; ; row++) {
        var cellAddress = XLSX.utils.encode_cell({ c: col, r: row });
        var cell = ws[cellAddress];
        
        if (row>howManyBoxesNeeded*7) break;
        while (!cell||cell.v==undefined){ 
          row++
          cellAddress = XLSX.utils.encode_cell({ c: col, r: row });
        cell = ws[cellAddress];
        if (row>howManyBoxesNeeded*7) break
        }
        if (row>howManyBoxesNeeded*7) break
        const cellText = String(cell.v || "");
        const cellWidth = cellText.length;

        if (cellWidth > maxWidth) {
            maxWidth = cellWidth;
        }
    }
}

const columnWidth = maxWidth + 2;
ws['!cols'] = new Array(columnCount).fill({ wch: columnWidth });


  XLSX.utils.book_append_sheet(wb, ws, `Living Dex`);
  XLSX.writeFile(wb, 'PokemonBoxesSorted.xlsx');
}
function ImportExcel(){
  dialogClose("ImportExcelDialog")
  var input = document.createElement('input');
  input.type = 'file';
  input.onchange = async e => { 
    var file = e.target.files[0];
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    var worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const raw_data = XLSX.utils.sheet_to_json(worksheet, {header: 1});
    
    var i = 0;
    raw_data.forEach(row => {
      row.forEach(element => {
        if(i % 7 != 0 && i % 7 != 6) AddToList(element);
      });
      i++;
    });
  };
  input.click();
}

function replaceArrayInString(str, arr, replacement){
  let newstr = str
  arr.forEach(word => {
    newstr = newstr.replace(word,replacement)
  });
  return newstr
}
//add entry to box
function AddToList(pokemonName) {
  wordsToRemove = ["-antique","-artisan","-masterpiece","--own-tempo"]
  pokemonNameImg=replaceArrayInString(pokemonName,wordsToRemove,"")
  console.log(pokemonNameImg)
  const $boxes = document.querySelector('.boxes');
  pokemonCount++;
  

  if (pokemonCount > boxCount * 30) {
    if (boxCount==0){
      document.getElementById(`placeholderBox`).style.display = "none";
    }
    boxCount++;
    const $boxcontainer = document.createElement('div'); 
    const $box = document.createElement('div');
    $boxcontainer.classList.add(`boxcontainer`);
    $box.classList.add('box', `box${boxCount}`);
    $boxcontainer.innerHTML = `<div class="boxTitle">Box ${boxCount}</div><div class="removeBoxButton">x</div>`;
    $boxcontainer.appendChild($box);
    $boxes.appendChild($boxcontainer);
    const rmbuttonbox = document.querySelectorAll('.removeBoxButton');
    rmbuttonbox[rmbuttonbox.length - 1].addEventListener('click', function() {
      openRemoveBoxDialog($box);
  }, false);
  

    //Initialize 30 slots per box
    for (let i = 0; i < 30; i++) {
      const slot = document.createElement('div');
      slot.classList.add('slot', 'emptySlot');
      $box.appendChild(slot);
    }
  }

  //Find the next empty slot and add the Pokémon
  const emptySlot = document.querySelector('.emptySlot');
  if (emptySlot) {
    const newSlot = document.createElement('div');
    newSlot.classList.add('slot', 'slotTaken', 'drag');
    newSlot.innerHTML = `
      <div class="pokemonImage">
        <img src="https://img.pokemondb.net/sprites/home/normal/${pokemonNameImg}.png" alt="${pokemonName}" onerror="this.src='./img/noImage.png'; this.className='placeholderImg'">
      </div>
      <div class="pokemonName">${pokemonName}</div>
      <div class="removeButton">x</div>
    `;
    emptySlot.parentNode.replaceChild(newSlot, emptySlot); //Replace emptySlot with newSlot
    observer.observe(newSlot);
  }

  const lis = document.querySelectorAll('.slotTaken');
  const rmbutton = document.querySelectorAll('.removeButton');
  rmbutton[lis.length - 1].addEventListener('click', removeFromList, false);
}

//run after pressing add button to add a single pokemon
function AddToBox(pokemonName){
  AddToList(pokemonName)
  ScrollToBottom()
}
//run when adding a preset
function AddPreset(){
  dialogClose(`addPresetDialog`)
  const preset = document.getElementById("presetInput").value
  eval(preset).forEach(pokemonName => {
    AddToList(pokemonName)
  });
  ScrollToBottom()
}


function openRemoveBoxDialog(box) {
  boxToRemove = box;
  dialogOpen('removeBoxDialog');
}

function removeBox() {
  if (boxToRemove) {
    const pokemonRemoved = boxToRemove.querySelectorAll(".slotTaken").length;
    
    boxCount--;
    pokemonCount -= pokemonRemoved;

    boxToRemove.parentNode.remove();
    boxToRemove = null;
    dialogClose('removeBoxDialog');
    const boxTitles = document.querySelectorAll(".boxTitle")
    var boxNrTemp = 1
    boxTitles.forEach(title => {
      title.innerHTML=`Box ${boxNrTemp}`
      title.nextElementSibling.nextElementSibling.classList = `box box${boxNrTemp}`
      boxNrTemp++
    });
    if (boxCount==0){
      document.getElementById(`placeholderBox`).style.display = "initial";
    }
  }
}


//make sure there are exactly 30 entries in each box at all times
function keep30inboxes() {
  for (let i = 0; i < boxCount; i++) {
      const $current = $(`.box${i + 1}`);
      const $next = $(`.box${i + 2}`);

      //move everything past slot 30 to the net box
      while ($next.length && $current.children('.slot').length > 30) {
          const childToMove = $current.children('.slot').eq(30);  //Get the 31st element
          $next.prepend(childToMove);  //Move it to the beginning of the next box
          console.log('Moved to make $current shorter');
      }

      //add slots from the next ones if below 30
      while ($next.length && $current.children('.slot').length < 30) {
          const childToMove = $next.children('.slot').eq(0);  //Get the first element of $next
          $current.append(childToMove); //Move it to the end of $current
          console.log('Moved to make $current longer');
      }

      //remove box if only empty
      if ($current.children('.slot').eq(0).hasClass('emptySlot')) {
          $current.parent().remove();
          boxCount--;  
          if (boxCount==0){
            document.getElementById(`placeholderBox`).style.display = "initial";
          }
          console.log('Box removed because it has only empty slots');
      }
  }
}
//Enable drag-and-drop functionality for `.slotTaken` items
function makeSlotsDraggable(slot) {
      Draggable.create(slot, {
          type: "x,y",
          bounds: ".boxes",
          autoScroll:2,
          dragClickables:true,
          allowEventDefault:true,
          onDragStart() {
              this.startX = this.x;
              this.startY = this.y;
              
              //Add a class for dragging style
              this.target.classList.add("is-dragging");
          },
          onDrag() {
            const closestSlot = findClosestSlot(this.target);
        
            if (closestSlot && closestSlot !== this.target) {
                const draggedRect = this.target.getBoundingClientRect();
                const closestRect = closestSlot.getBoundingClientRect();
                const slots = document.getElementsByClassName("slot");
        
                //Reset all borders before setting the closest one
                Array.from(slots).forEach(slot => {
                    if (slot !== closestSlot) slot.style.border = "";
                });
        
                //Determine whether to insert before or after based on proximity
                if (draggedRect.left < closestRect.left) {
                  closestSlot.style.borderRight = "";  
                  closestSlot.style.borderLeft = "4px solid red";
                } else {
                  closestSlot.style.borderLeft = "";
                    closestSlot.style.borderRight = "4px solid red";
                }
            }
        },              
          onDragEnd() {
            const slots = document.getElementsByClassName("slot");
            for (const slot of slots) {
                slot.style.border = "";
            }
            const closestSlot = findClosestSlot(this.target);
            if (closestSlot && closestSlot !== this.target) {
                insertSlotAtPosition(this.target, closestSlot);
                gsap.set(this.target, { x: 0, y: 0 });
            } else {
              gsap.to(this.target, { x: this.startX, y: this.startY });
            }
            const boxContainer = this.target.closest('.box');
            if (boxContainer) {
              const slots = Array.from(boxContainer.querySelectorAll('.slot'));
              const sortedSlots = sortByMovingToEnd(slots, slot => slot.classList.contains('emptySlot'));
              sortedSlots.forEach(slot => boxContainer.appendChild(slot));
            }
            this.target.classList.remove("is-dragging");
            this.target.style.zIndex = "auto"
            closestSlot.style.zIndex = "auto"
            keep30inboxes() 
        }
  });
}
//Draggable elements

    //Helper function to find the closest slot element to the dragged item
    function findClosestSlot(draggedElement) {
      const slots = document.querySelectorAll(".slot");
      let closestSlot = null;
      let closestDistance = Infinity;
      const draggedRect = draggedElement.getBoundingClientRect();

      slots.forEach(slot => {
          const slotRect = slot.getBoundingClientRect();
          const distance = Math.hypot(
              draggedRect.left - slotRect.left,
              draggedRect.top - slotRect.top
          );

          if (distance < closestDistance && slot !== draggedElement) {
              closestDistance = distance;
              closestSlot = slot;
          }
      });

      return closestSlot;
    }

    //Helper function to insert the dragged slot at the closest position
    function insertSlotAtPosition(draggedElement, closestSlot, slotToInsert) {
      const draggedRect = draggedElement.getBoundingClientRect();
      const closestRect = closestSlot.getBoundingClientRect();
      if (!slotToInsert)
      {
        slotToInsert=draggedElement
      }

      //Determine whether to insert before or after based on proximity
      if (draggedRect.left < closestRect.left) {
          closestSlot.parentNode.insertBefore(slotToInsert, closestSlot); //Insert before
      } else {
          closestSlot.parentNode.insertBefore(slotToInsert, closestSlot.nextSibling); //Insert after
      }

      //Reinitialize draggable functionality
      makeSlotsDraggable(draggedElement);
      makeSlotsDraggable(closestSlot);
    }

    //list into array
    function sortByMovingToEnd(arr, predicate) {
      const withoutPredicate = arr.filter(item => !predicate(item));
      const withPredicate = arr.filter(item => predicate(item));
      return [...withoutPredicate, ...withPredicate];
    }

//Download excel elements
    function map(arrayLike, fn) {
        var ret = [], i = -1, len = arrayLike.length;
        while (++i < len) ret[i] = fn(arrayLike[i]);
        return ret;
    }

    function getText(node) {
        if (node.nodeType === 3) return node.data;
        var txt = '';
        if (node = node.firstChild) do {
            txt += getText(node);
        } while (node = node.nextSibling);
        return txt;
    }

//Remove from list
function removeFromList(){
    console.log('test')
    
      this.parentNode.remove()
      var $box = $(`.box${boxCount}`)
      $box.append(`
        <div class="slot emptySlot">
        </div>`)
      
    pokemonCount--
    keep30inboxes()
}
//Scroll to the bottom of boxes after adding an entry
function ScrollToBottom() { 
  if (window.innerWidth>800){
  $('.scrollbar').animate({ 
      scrollTop: ($(`.boxcontainer`).last().get(0).offsetTop)
     
  },
  {queue: false }
  , 500);
  console.log($(`.box`).last().get(0).offsetTop) 
}
else{
  $('body').animate({ 
      scrollTop: ($(`.boxcontainer`).last().get(0).offsetTop)
      
  },
  {queue: false }
  , 500);
} 
}


