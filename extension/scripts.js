function FindVar(sprite, specificName) {
    let jsonObj;
    if (sprite.toUpperCase() !== 'STAGE') {
        jsonObj = vm.runtime.getSpriteTargetByName(sprite).variables;
    } else {
        jsonObj = vm.runtime.getTargetForStage().variables;
    }

    for (let key in jsonObj) {
        if (typeof jsonObj[key] === 'object') {
            if (jsonObj[key].hasOwnProperty('name')) {
                if (jsonObj[key].name === specificName) {
                    return jsonObj[key];
                }
            }
        }
    }
    return null; 
}

function getTargetAndVariableIdByName(runtime, targetName, variableName) {
    for (const target of runtime.targets) {
        if (target.getName() === targetName) {
            const targetId = target.id; // Get the target ID

            // Look for the variable within this target
            for (const [varId, variable] of Object.entries(target.variables)) {
                // Check if the variable's name matches the desired variable name
                if (variable.name === variableName) {
                    const variableId = varId; // Get the variable ID
                    return { targetId, variableId };
                }
            }

            // If the target is found but no matching variable
            console.warn(`Variable "${variableName}" not found in target "${targetName}".`);
            return null;
        }
    }

    // If no target matches the name
    console.warn(`Target "${targetName}" not found.`);
    return null;
}

function enableInfiniteClones() {
    vm.runtime.clonesAvailable = function() {
        return true;
    };
}

function cloudify(ele) {
    let sprite = "Stage";
    let variable = ele;
    let found = FindVar(sprite, variable);
    if (found) {
        found.isCloud = true;
        alert("🍊: Cloudify successful!");
    }
}

let ProviderLog;

function sendCloudUpdate(variableName, value, projectId) {
    // Declare the WebSocket and handshake status in the function scope
    let socket = sendCloudUpdate.socket || null; 
    let hasHandshaken = sendCloudUpdate.hasHandshaken || false;
    const cloudusername = document.getElementsByClassName("profile-name")[0].innerHTML;

    if (!socket || socket.readyState !== WebSocket.OPEN) {
        // Create and open a new WebSocket if one does not exist or is not open
        socket = new WebSocket('wss://clouddata.scratch.mit.edu/');
        sendCloudUpdate.socket = socket; // Save the socket for reuse

        socket.onopen = function () {
            console.log('WebSocket connection opened');

            // Send the handshake packet
            const handshakePacket = JSON.stringify({
                name: "Handshake",
                user: cloudusername,
                project_id: projectId
            }) + '\n';

            socket.send(handshakePacket);
            console.log('Sent Handshake Packet:', handshakePacket);

            hasHandshaken = true; // Mark handshake as complete
            sendCloudUpdate.hasHandshaken = hasHandshaken; // Save handshake status

            // Send the cloud update packet after handshake
            sendUpdatePacket();
        };

        socket.onmessage = function (event) {
            console.log('Received WebSocket message:', event.data);
        };

        socket.onclose = function () {
            console.log('WebSocket connection closed');
            sendCloudUpdate.hasHandshaken = false; // Reset handshake status on close
            sendCloudUpdate.socket = null; // Clear the socket reference
        };

        socket.onerror = function (error) {
            console.log('WebSocket error: ', error);
        };
    } else if (socket.readyState === WebSocket.OPEN) {
        // If the WebSocket is open, send the cloud update packet
        if (hasHandshaken) {
            sendUpdatePacket();
        } else {
            console.log("Handshake not completed. Cannot send update.");
        }
    }

    function sendUpdatePacket() {
        // Construct and send the cloud update packet
        const cloudUpdatePacket = JSON.stringify({
            method: 'set',
            user: cloudusername,
            project_id: projectId,
            name: `☁ ${variableName}`,
            value: value
        }) + '\n';

        socket.send(cloudUpdatePacket);
        console.log('Sent Cloud Update Packet:', cloudUpdatePacket);
    }
}

const spritefile = document.createElement("input");
spritefile.type = "file";
const jsfile = document.createElement("input");
jsfile.type = "file";

function crun(what) {
    if (what === 'setuser'){
        vm.runtime.ioDevices.userData._username = document.getElementById("cusername").value;
        document.getElementsByClassName("profile-name")[0].innerHTML = "(🍊) " + vm.runtime.ioDevices.userData._username;   
    } else if (what === 'setvar'){
        const runtime = vm.runtime;
        const targetName = "Stage"; // Replace with the target's name
        const variableName = document.getElementById("setVar").value;
        const variablevalue = document.getElementById("varVal").value;

        const result = getTargetAndVariableIdByName(runtime, targetName, variableName);
        vm.setVariableValue(result.targetId, result.variableId, variablevalue);
        alert("🍊: Variable set!");
} else if (what === 'injectsp') {
    spritefile.onchange = function(e){
        console.log(e.target,e.target.files)
        const files = e.target.files;
        Array.from(files).forEach(file=>{
            const reader = new FileReader;
            reader.onload = ()=>{
                vm.addSprite(reader.result);
            }
            reader.readAsArrayBuffer(file);
        });
    }
    spritefile.click();
} else if (what === 'injectjs') {
    jsfile.onchange = function(e){
        const files = e.target.files;
        Array.from(files).forEach(file=>{
            const reader = new FileReader;
            reader.onload = ()=>{
                eval(reader.result);
            }
            reader.readAsText(file);
        });
    }
    jsfile.click();
} else if (what === 'cloudify') {
    cloudify(document.getElementById("cloudname").value);
} else if (what === 'cloudchange') {
    sendCloudUpdate(document.getElementById("cloudvar").value, document.getElementById("cloudvalue").value, window.location.href.substring(33, 43))
} else if (what === 'clones') {
    enableInfiniteClones();
} else if (what === 'turbo') {
    if (vm.runtime.turboMode) {
                    vm.setTurboMode(false);
                } else {
                    vm.setTurboMode(true);
                };
} else if (what === 'settimer') {
    vm.runtime.ioDevices.clock._projectTimer.startTime = Date.now() - (document.getElementById("ctimer").value * 1000);
} else if (what === 'setmousex') {
    vm.runtime.ioDevices.mouse.__scratchX = document.getElementById("cmousex").value
} else if (what === 'setmousey') {
    vm.runtime.ioDevices.mouse.__scratchY = document.getElementById("cmousey").value
}
}

function ohide() {
    document.getElementsByClassName("Clementyne")[0].innerHTML = "<button onClick='oshow()'>Show Clementyne</button>";
};
function oshow() {
    const requestMain = new CustomEvent("requestMainHtml");
    document.dispatchEvent(requestMain);
};
function osettings() {
    const rqsettings = new CustomEvent("rqsettings");
    document.dispatchEvent(rqsettings);
}
document.addEventListener("respondMainHtml", function(e) {
    const htmlContent = e.detail;
    mydiv.innerHTML = htmlContent;
});
document.addEventListener("rpsettings", function(e) {
    const rpsettings = e.detail;
    mydiv.innerHTML = rpsettings;
});
