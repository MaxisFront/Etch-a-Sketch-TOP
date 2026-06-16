// @ts-check

( () => {
  
  // Global variable
  let currentColoringType = "solid";
  let baseSquareColor = "61, 53, 117";
  let leftClickDown = false;

  // DOM nodes
  const sketchGrid = document.querySelector('[data-sketch="grid"]');
  const buttons = document.querySelectorAll('button');
  const colorPicker =  /** @type {HTMLInputElement} */ (document.querySelector('[data-option="pick-color"]'))

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

    let colorInput = colorPicker.style;

    if (type === "random") {
      colorInput.display = "none";
    } else if (type === "solid") {
      colorInput.display = "inline-block";
    }
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

  /** @param {HTMLElement} eventTarget  */
  function setBrushType(eventTarget) {

    if (currentColoringType === "solid") {
      applyProgressiveColor(eventTarget);
      
    } else if (currentColoringType === "random") {
      applyRandomColor(eventTarget);
    }
  }

  /** @param {HTMLElement} square  */
  function applyRandomColor(square) {

    square.style.backgroundColor = `rgba(${getRandomColor()})`;
  }

  function getRandomColor() {

    const R = Math.floor(Math.random() * 256);
    const G = Math.floor(Math.random() * 256);
    const B = Math.floor(Math.random() * 256);

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

    if (event.button !== 0) return;

    const target = /** @type {HTMLElement} */ (event.target);

    if (!target || !target.classList.contains("square")) return;

    leftClickDown = true;
    setBrushType(target);
  })

  // EventListeners
  sketchGrid?.addEventListener(("mouseover"), (event) => {
    
    const target = /** @type {HTMLElement} */ (event.target);

    if (!target || !target.classList.contains("square") || !leftClickDown) return;
  
    setBrushType(target);

  })

  window.addEventListener("mouseup", () => {
    leftClickDown = false;
  })

  colorPicker?.addEventListener("input", (event) => {
    const target = /** @type {HTMLInputElement} */ (event.target);
    const hexColor = target.value;

    const R = parseInt(hexColor.substring(1, 3), 16);
    const G = parseInt(hexColor.substring(3, 5), 16);
    const B = parseInt(hexColor.substring(5, 7), 16);

    baseSquareColor = `${R}, ${G}, ${B}`;
  });


})();
