//=============================================================================
// Pathfind.js
//=============================================================================
/*:
* @target MZ
* @plugindesc v0.0.1 Pathfind
* @author KING Studio
* @help Pathfind.js
*
* This is CINEMA.
*
* @command moveeventto
* @text Move Event To Position
* @desc Moves the specified event to the specified position.
* 
* @arg eventId
* @text Event ID
* @desc The ID of the event to be moved.
* @type number
* @default 1
*
* @arg targetX
* @text Target X
* @desc The target X position.
* @type number
* @default 5
*
* @arg targetY
* @text Target Y
* @desc The target Y position.
* @type number
* @default 8
*/

(function () {
    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);

        if (command.toLowerCase() === 'moveeventto') {
            const eventId = parseInt(args[0]);
            const targetX = parseInt(args[1]);
            const targetY = parseInt(args[2]);

            if (!isNaN(eventId) && !isNaN(targetX) && !isNaN(targetY)) {
                $gameMap.event(eventId).moveEventToPosition(eventId, targetX, targetY);
            } else {
                console.error('Invalid parameters for MoveEventTo command. Please provide valid numbers.');
            }
        }
    };

    Game_Character.prototype.moveEventToPosition = function (eventId, targetX, targetY) {
        const event = $gameMap.event(eventId);
        if (event) {
            console.log(`MoveEventToPosition called for Event ID ${eventId}. Target: (${targetX}, ${targetY})`);
    
            const path = this.findPath(event.x, event.y, targetX, targetY);
            console.log('Path:', path);
    
            if (path && path.length > 0) {
                const moveRoute = path.map(dir => ({ code: dir / 2 }));
                console.log('Move Route:', moveRoute);
    
                event.forceMoveRoute({ list: moveRoute, repeat: false, skippable: true });
            } else {
                console.warn('Path not found or empty.');
            }
        } else {
            console.error(`Event ID ${eventId} not found on the map.`);
        }
    };

    Game_Character.prototype.findPath = function (startX, startY, targetX, targetY) {
        const mapWidth = $gameMap.width();
        const mapHeight = $gameMap.height();
        const visited = Array.from({ length: mapWidth }, () => Array(mapHeight).fill(false));
        const queue = [{ x: startX, y: startY, path: [] }];

        while (queue.length > 0) {
            const { x, y, path } = queue.shift();

            if (x === targetX && y === targetY) {
                return path;
            }

            const directions = [
                { dx: 0, dy: -1, dir: 8 }, // Up
                { dx: -1, dy: 0, dir: 4 }, // Left
                { dx: 1, dy: 0, dir: 6 }, // Right
                { dx: 0, dy: 1, dir: 2 } // Down
            ];

            for (const { dx, dy, dir } of directions) {
                const newX = x + dx;
                const newY = y + dy;

                if (newX >= 0 && newX < mapWidth && newY >= 0 && newY < mapHeight && !$gameMap.checkPassage(newX, newY, 0x0f)) {
                    if (!visited[newX][newY]) {
                        visited[newX][newY] = true;
                        queue.push({ x: newX, y: newY, path: [...path, dir] });
                    }
                }
            }
        }

        return null;
    };
})();


// end of file