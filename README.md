| Commands        | Purpose           |
| ------------- |-------------|
| `npm start`      | Starts service in port 3000  |
| `npm test`      | Runs test suite   |

Requirements
* npm
* node ~10

Init project
* got clone
* `npm i`

## API

### /place-mark (POST)

Allows clients to add new marks on the board.

**Request**  
```
{
  mark: 'X' | 'O',
  coordinates: {
    X: 1 | 2 | 3,
    O: 1 | 2 | 3,
  }
}
```

**Response**  
*Current status of board in text graphics*
```
O - - 
- O - 
- - O 
```

### /status (GET)

Allows clients to request current status of game board and to see game state ('ONGOING' | 'ENDED') and the winning mark if there's a winner.

**Request**  
```
```

**Response**  
*Current status of board in text graphics with game state and/or winner*
```
ENDED, O:
O - - 
- O - 
- - O 
```

### /restart (POST)

Allows clients to restart the game by resetting the board.

**Request**  
```
```

**Response**  
```
Board reset
```