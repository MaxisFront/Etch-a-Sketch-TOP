// @ts-check

( () => {
  
  // Global variable
  let currentColoringType = "solid";
  let baseSquareColor = "93, 75, 209";
  let rightClickDown = false;

  // DOM nodes
  const sketchGrid = document.querySelector('[data-sketch="grid"]');
  const buttons = document.querySelectorAll('button');

  updateGridSize(16);


  // Buttons Logic
  
  buttons?.forEach(button => button.addEventListener("click", (event) => {

    const target = /** @type {HTMLElement} */ (event.currentTarget);

    switch(target.dataset.option) {
      case "size":
        const newSize = askGridSize()
        if (newSize !== null) updateGridSize(newSize)
        break;
      case "solid-color":
        setColoringType("solid")
        break;
      case "random-color":
        setColoringType("random")
        break;
      case "clean":
        cleanSquares();
        break;
      default:
        break;
    }
  }))

  // Coloring logic

  /** @param {string} type  */
  function setColoringType(type) {
    currentColoringType = type;
  }

  /** @param {HTMLElement} square  */
  function applyProgressiveColor(square) {
    // se obtiene o inicializa el data-opacity
    let currentOpacity = parseFloat(square.dataset.opacity || "0");

    if (currentOpacity < 1.0) {
      currentOpacity += 0.1;
      currentOpacity = Math.round(currentOpacity * 10) / 10;

      square.dataset.opacity = String(currentOpacity);
      square.style.backgroundColor = `rgba(${baseSquareColor}, ${currentOpacity})`;
    }
  }

  /** @param {HTMLElement} square  */
  function applyRandomColor(square) {

    square.style.backgroundColor = `rgba(${getRandomColor()})`;
  }

  function getRandomColor() {

    const R = Math.floor(Math.random() * 255);
    const G = Math.floor(Math.random() * 255);
    const B = Math.floor(Math.random() * 255);

    const randomcolor = `${R}, ${G}, ${B}, 1`;
    return randomcolor;

  }

  function cleanSquares() {
    const squares = document.querySelectorAll(".square");

    squares.forEach( (element) => {  
      const square = /** @type {HTMLElement}**/ (element);

      square.style.backgroundColor = `rgba(${baseSquareColor}, 0)`;
      delete square.dataset.opacity;
      });
    }

  // Square logic

  /** @param {number} gridSize  */
  function updateGridSize(gridSize) {
    let fragment = document.createDocumentFragment();

    for (let i = 0; i < gridSize; i++) {
      const gridRow = document.createElement("div");
      gridRow.classList.add("grid__row");

      for (let j = 0; j < gridSize; j++) {
        const square = document.createElement("div");
        square.classList.add("square");
        gridRow.appendChild(square);
      }

      fragment.appendChild(gridRow);
    }

    sketchGrid?.replaceChildren(fragment);
  }

  function askGridSize() {
    const input = prompt("Please, insert the grid size:", "16");
    if (input === null) return null;

    const gridSize = parseInt(input, 10);

    if (isNaN((gridSize)) || gridSize <= 0) {
      alert("The grid size needs to be a positive integer!");
      return null;
    }

    if (gridSize > 100) {
      alert("The grid size needs to be 100 or less!")
      return null;
    }

    return gridSize;
  }

  // Square interaction logic
  sketchGrid?.addEventListener("mousedown", (event) => {
    const target = /** @type {HTMLElement} */ (event.target);

    if (!target || !target.classList.contains("square")) return;

    rightClickDown = true;

    if (currentColoringType === "solid") {
      applyProgressiveColor(target);
    
    } else if (currentColoringType == "random") {
      applyRandomColor(target);
    }
  })

  sketchGrid?.addEventListener(("mouseover"), (event) => {
    
    const target = /** @type {HTMLElement} */ (event.target);

    if (!target || !target.classList.contains("square") || !rightClickDown) return;

    if (currentColoringType === "solid") {
      applyProgressiveColor(target);
    } else if (currentColoringType == "random") {
      applyRandomColor(target);
    }
  })

  window.addEventListener("mouseup", () => {
    rightClickDown = false;
  })

})();
