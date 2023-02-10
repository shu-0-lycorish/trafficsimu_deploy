// document.write("Hello, util!")

// var print = console.log

//配列の合計値を計算する
export function sum(arr) {
    return arr.reduce(function (sum, element) {
        return sum + element
    }, 0)
}


export function init_array(length, init) {
    var arr = Array(length) //受け取った配列と同じ長さの配列arrをつくる
    arr.fill(init) //つくった配列arrの全てに初期値initを代入
    return arr //arrを返す
}

//長方形(塗りつぶし)を描く
export function draw_rect(x, y, dx, dy, c) {
    CTX.fillStyle = c //長方形の塗りつぶしの色をcとする
    CTX.fillRect(x, y, dx, dy) //長方形を描く ((x,y)=長方形の左上の座標, dx=長方形の幅, dy=長方形の高さ)
}

//長方形(塗りつぶしなし)を描く
export function draw_rect_edge(x, y, dx, dy, c) {
    CTX.strokeStyle = c //長方形の輪郭の色をcとする
    CTX.strokeRect(x, y, dx, dy) //長方形を描く ((x,y)=長方形の左上の座標, dx=長方形の幅, dy=長方形の高さ)
}

//円を描く
export function draw_circle(x, y, r, c) {
    CTX.fillStyle = c
    CTX.beginPath()
    CTX.arc(x, y, r, 0, 2 * Math.PI)
    CTX.closePath()
    CTX.fill()
}

// 線を描く
export function draw_line(x0, y0, x1, y1, w, c) {
    CTX.beginPath()
    CTX.moveTo(x0, y0)
    CTX.lineTo(x1, y1)
    CTX.lineWidth = w
    CTX.strokeStyle = c
    CTX.stroke()
}

//テキストを描く
export function draw_text(text, x, y, c, fontsize, textAlign = "center") {
    CTX.fillStyle = c
    CTX.font = fontsize + "px " + "sans-serif"
    CTX.textBaseline = "middle"
    CTX.textAlign = textAlign
    CTX.fillText(text, x, y)
}
