// 初始化棋盘
let domRow = document.getElementsByClassName('row')
domRow[3].children[3].children[0].className = 'white'
domRow[4].children[4].children[0].className = 'white'
domRow[3].children[4].children[0].className = 'black'
domRow[4].children[3].children[0].className = 'black'
let chessboard = []// 模拟棋盘，1为白子，0为黑子,-1为无子
for (let i = 0; i < 8; i++) {
  chessboard[i] = new Array(8).fill(-1)
}
chessboard[3][3] = 1
chessboard[3][4] = 0
chessboard[4][4] = 1
chessboard[4][3] = 0

let currUser = 0 // 当前处于哪一方,1表示白子,0表示黑子
let chessNumber = {
  whiteCount: 0,
  blackCount: 0
}
Object.defineProperty(chessNumber, 'whiteCount', {
  set: function (val) {
    document.getElementById('white').innerHTML = '白色棋子：' + val
    whiteCount = val
  }
})
Object.defineProperty(chessNumber, 'blackCount', {
  set: function (val) {
    document.getElementById('black').innerHTML = '黑色棋子：' + val
    blackCount = val
  }
})
chessNumber.whiteCount = 2
chessNumber.blackCount = 2


function isGameOver(){
  for(let i=0;i<8;i++){
    for(let j=0;j<8;j++){
      if(chessboard[i][j]==-1){
        if(trans(i,j,false)!=0){
          return false
        }
      }
    }
  }
  gameover()
  return true
}
function chess(event) {
  console.log(event)
  // 无子状态
  if (event.path[0].classList[0] == 'column' && event.path[0].children[0].className == '') {
    for (let i = 0; i < event.path[1].offsetParent.children.length; i++) {
      item = event.path[1].offsetParent.children[i]
      if (item === event.path[1]) {
        // 第i行
        for (let j = 0; j < event.path[1].children.length; j++) {
          // 第j列
          if (event.path[0] === event.path[1].children[j]) {
            if (trans(i, j)) {
              chessboard[i][j] = currUser
              event.path[0].children[0].className = currUser ? 'white' : 'black'
              if (currUser) {
                chessNumber.whiteCount = whiteCount + 1
              } else {
                chessNumber.blackCount = blackCount + 1
              }
              currUser = currUser ? 0 : 1
            }
            break
          }
        }
        break
      }
    }
  }
  setTimeout(() => {
    isGameOver()
  }, 200);
}

function trans(x, y,flag=true) {
  let arr = []    // 记录哪些棋子需要翻转
  let account = 0
  for (let i = x + 1; i < 10; i++) {
    if (i == 8 || chessboard[i][y] === -1) {
      while (account) {
        arr.pop()
        account--
      }
      break
    } else if (chessboard[i][y] != currUser) {
      arr.push([i, y])
      account++
    } else {
      break
    }
  }
  account = 0
  for (let i = x - 1; i > -11; i--) {
    if (i == -1 || chessboard[i][y] === -1) {
      while (account) {
        arr.pop()
        account--
      }
      break
    } else if (chessboard[i][y] != currUser) {
      arr.push([i, y])
      account++
    } else {
      break
    }
  }
  account = 0
  for (let i = y + 1; i < 81; i++) {
    if (i == 8 || chessboard[x][i] === -1) {
      while (account) {
        arr.pop()
        account--
      }
      break
    } else if (chessboard[x][i] != currUser) {
      arr.push([x, i])
      account++
    } else {
      break
    }
  }
  account = 0
  for (let i = y - 1; i > -11; i--) {
    if (i == -1 || chessboard[x][i] === -1) {
      while (account) {
        arr.pop()
        account--
      }
      break
    } else if (chessboard[x][i] != currUser) {
      arr.push([x, i])
      account++
    } else {
      break
    }
  }
  account = 0
  for (let i = x - 1, j = y - 1; i > -11; i--, j--) {
    if (i == -1 || j == -1 || chessboard[i][j] === -1) {
      while (account) {
        arr.pop()
        account--
      }
      break
    } else if (chessboard[i][j] != currUser) {
      arr.push([i, j])
      account++
    } else {
      break
    }
  }
  account = 0
  for (let i = x - 1, j = y + 1; i > -11; i--, j++) {
    if (i == -1 || j == 8 || chessboard[i][j] === -1) {
      while (account) {
        arr.pop()
        account--
      }
      break
    } else if (chessboard[i][j] != currUser) {
      arr.push([i, j])
      account++
    } else {
      break
    }
  }
  account = 0
  for (let i = x + 1, j = y - 1; i < 11; i++, j--) {
    if (i == 8 || j == -1 || chessboard[i][j] === -1) {
      while (account) {
        arr.pop()
        account--
      }
      break
    } else if (chessboard[i][j] != currUser) {
      arr.push([i, j])
      account++
    } else {
      break
    }
  }
  account = 0
  for (let i = x + 1, j = y + 1; i > -11; i++, j++) {
    if (i == 8 || j == 8 || chessboard[i][j] === -1) {
      while (account) {
        arr.pop()
        account--
      }
      break
    } else if (chessboard[i][j] != currUser) {
      arr.push([i, j])
      account++
    } else {
      break
    }
  }
  // 反转棋子
  if(flag){
    for (let i = 0; i < arr.length; i++) {
      let targetX = arr[i][0]
      let targetY = arr[i][1]
      chessboard[targetX][targetY] = currUser
      domRow[targetX].children[targetY].children[0].className = currUser ? 'white' : 'black'
      if (currUser) {
        chessNumber.whiteCount = whiteCount + 1
        chessNumber.blackCount = blackCount - 1
      } else {
        chessNumber.whiteCount = whiteCount - 1
        chessNumber.blackCount = blackCount + 1
      }
    }
  }
  return arr.length
}

function gameover() {
  if (whiteCount > blackCount) {
    alert("恭喜白棋获胜！")
  } else if (whiteCount < blackCount) {
    alert("恭喜黑棋获胜！")
  } else {
    alert('平局！！')
  }
}