var mydiv = document.createElement("div");
mydiv.id = "mydiv";
mydiv.style.position = "absolute";
mydiv.style.zIndex = 9;
mydiv.style.backgroundColor = "#f69420";
mydiv.style.textAlign = "center";
mydiv.style.border = "1px solid #f69420";
mydiv.style.borderRadius = "6.9px";
mydiv.style.width = "270px";
mydiv.style.top = "69px";
mydiv.style.right = "0px";

document.body.appendChild(mydiv);

mydiv.innerHTML = "<style>#mydiv {background-color: #f69420;color: black;font-weight: bold;padding-left: 10px;padding-right: 10px;}#mydiv button {transition: all 0.25s ease;background-color: #fcd7ab;border-radius: 0.25rem;font-family:cursive;}#mydiv button:hover {transition: all 0.25s ease;background-color: #fdeedc;}#mydiv button:hover {cursor:cell;}</style><button onClick='oshow()'>Show Clementyne</button>";
