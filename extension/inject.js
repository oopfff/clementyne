// Create the popup container (DIV)
var mydiv = document.createElement("div");
mydiv.id = "mydiv";
mydiv.style.position = "absolute";
mydiv.style.zIndex = 9;
mydiv.style.backgroundColor = "#f69420";
mydiv.style.textAlign = "center";
mydiv.style.border = "1px solid #f69420";
mydiv.style.width = "270px";
mydiv.style.top = "69px"; // Position it 10px from the top
mydiv.style.right = "0px"; // Position it 10px from the right

// Create the header of the popup
var mydivheader = document.createElement("div");
mydivheader.id = "mydivheader";

// Add the header to the popup
mydiv.appendChild(mydivheader);

// Append the popup to the body
document.body.appendChild(mydiv);

// Fetch the content from the URL and set it as the innerHTML of the popup
fetch('https://raw.githubusercontent.com/oopfff/clementyne/refs/heads/main/code/gui.html')
  .then(response => response.text())
  .then(data => {
    mydiv.innerHTML += data; // Append the fetched content to the popup
    // Reinitialize drag after content is loaded
    dragElement(mydiv);
  })
  .catch(error => {
    console.error('Error fetching the HTML content:', error);
  });
