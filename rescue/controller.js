var KEYCODE_SHIFT = 16;
var KEYCODE_CTRL = 17;
var KEYCODE_SPACE = 32;
var KEYCODE_LEFT = 37;
var KEYCODE_UP = 38;
var KEYCODE_RIGHT = 39;
var KEYCODE_DOWN = 40;
var KEYCODE_A = 65;
var KEYCODE_D = 68;
var KEYCODE_E = 69;
var KEYCODE_H = 72;
var KEYCODE_I = 73;
var KEYCODE_J = 74;
var KEYCODE_K = 75;
var KEYCODE_Q = 81;
var KEYCODE_S = 83;
var KEYCODE_U = 85;
var KEYCODE_W = 87;
var KEYCODE_Y = 89;
var KEYCODE_NUMPAD_4 = 100;
var KEYCODE_NUMPAD_5 = 101;
var KEYCODE_NUMPAD_6 = 102;
var KEYCODE_NUMPAD_7 = 103;
var KEYCODE_NUMPAD_8 = 104;
var KEYCODE_NUMPAD_9 = 105;

var keyShift = false;
var keyCtrl = false;
var keySpace = false;

var keyLeft = false;
var keyUp = false;
var keyRight = false;
var keyDown = false;

var keyA = false;
var keyD = false;
var keyE = false;
var keyH = false;
var keyI = false;
var keyJ = false;
var keyK = false;
var keyQ = false;
var keyS = false;
var keyU = false;
var keyW = false;
var keyY = false;

var keyNumpad4 = false;
var keyNumpad5 = false;
var keyNumpad6 = false;
var keyNumpad7 = false;
var keyNumpad8 = false;
var keyNumpad9 = false;

document.onkeydown = onKeyDown;
document.onkeyup = onKeyUp;

function onKeyDown(key) {
    //cross browser issues exist
    if(!key){ var key = window.event; }
    switch(key.keyCode) {
        case KEYCODE_SHIFT: keyShift = true; break;
        case KEYCODE_CTRL: keyCtrl = true; break;
        case KEYCODE_SPACE: keySpace = true; break;
        
        case KEYCODE_LEFT: keyLeft = true; break;
        case KEYCODE_UP: keyUp = true; break;
        case KEYCODE_RIGHT: keyRight = true; break;
        case KEYCODE_DOWN: keyDown = true; break;

        case KEYCODE_A: keyA = true; break;
        case KEYCODE_D: keyD = true; break;
        case KEYCODE_E: keyE = true; break;
        case KEYCODE_H: keyH = true; break;
        case KEYCODE_I: keyI = true; break;
        case KEYCODE_J: keyJ = true; break;
        case KEYCODE_K: keyK = true; break;
        case KEYCODE_Q: keyQ = true; break;
        case KEYCODE_S: keyS = true; break;
        case KEYCODE_U: keyU = true; break;
        case KEYCODE_W: keyW = true; break;
        case KEYCODE_Y: keyY = true; break;
        
        case KEYCODE_NUMPAD_4: keyNumpad4 = true; break;
        case KEYCODE_NUMPAD_5: keyNumpad5 = true; break;
        case KEYCODE_NUMPAD_6: keyNumpad6 = true; break;
        case KEYCODE_NUMPAD_7: keyNumpad7 = true; break;
        case KEYCODE_NUMPAD_8: keyNumpad8 = true; break;
        case KEYCODE_NUMPAD_9: keyNumpad9 = true; break;
    }
    update();
}

function onKeyUp(key) {
    //cross browser issues exist
    if(!key){ var key = window.event; }
    switch(key.keyCode) {
        case KEYCODE_SHIFT: keyShift = false; break;
        case KEYCODE_CTRL: keyCtrl = false; break;
        case KEYCODE_SPACE: keySpace = false; break;
        
        case KEYCODE_LEFT: keyLeft = false; break;
        case KEYCODE_UP: keyUp = false; break;
        case KEYCODE_RIGHT: keyRight = false; break;
        case KEYCODE_DOWN: keyDown = false; break;

        case KEYCODE_A: keyA = false; break;
        case KEYCODE_D: keyD = false; break;
        case KEYCODE_E: keyE = false; break;
        case KEYCODE_H: keyH = false; break;
        case KEYCODE_I: keyI = false; break;
        case KEYCODE_J: keyJ = false; break;
        case KEYCODE_K: keyK = false; break;
        case KEYCODE_Q: keyQ = false; break;
        case KEYCODE_S: keyS = false; break;
        case KEYCODE_U: keyU = false; break;
        case KEYCODE_W: keyW = false; break;
        case KEYCODE_Y: keyY = false; break;
        
        case KEYCODE_NUMPAD_4: keyNumpad4 = false; break;
        case KEYCODE_NUMPAD_5: keyNumpad5 = false; break;
        case KEYCODE_NUMPAD_6: keyNumpad6 = false; break;
        case KEYCODE_NUMPAD_7: keyNumpad7 = false; break;
        case KEYCODE_NUMPAD_8: keyNumpad8 = false; break;
        case KEYCODE_NUMPAD_9: keyNumpad9 = false; break;
    }
    update();
}

function update() {
    update_player("p1", keyD, keyW, keyA, keyS, keyE);
    update_player("p2", keyK, keyU, keyH, keyJ, keyI);
    update_player("p3", keyRight, keyUp, keyLeft, keyDown, keyShift);
    update_player("p4", keyNumpad6, keyNumpad8, keyNumpad4, keyNumpad5, keyNumpad9);
}

function update_player(player, right, up, left, down, shoot) {
    // Update player commands
    var x = 0, y = 0;
    
    // Get direction of movement
    if (right && up) {
        x = .707;
        y = -.707;
    } else if (up && left) {
        x = -.707;
        y = -.707;
    } else if (left && down) {
        x = -.707;
        y = .707;
    } else if (down && right) {
        x = .707;
        y = .707;
    } else if (right) {
        x = 1;
    } else if (up) {
        y = -1;
    } else if (left) {
        x = -1;
    } else if (down) {
        y = 1;
    }
    
    // Notify player of new movement
    EVENT.notify(player+".move", {x: x, y: y});
    
    // Update player actions
    if (shoot) {
        EVENT.notify(player+".shoot", {});
    }
}
