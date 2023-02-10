import { Link, Cumplot, FDchanger, QKplot, Spawner, TSplot } from "./model"
import { draw_line } from "./util"
import { DELTAT, VMAX, DELTAT_DRAW, DELTAT_EDIE } from "./constants"

//** GLOBAL **/
T = 0
VEHS = []
ACC = 999
DECEL_PROB = 0
CANVAS = document.getElementById("main")
CTX = CANVAS.getContext("2d")

//** Variables */
var LINKS = []
LINKS.push(new Link(100, 1, 100, 50, 600, 0))
LINKS[0].set_delta(70, 80, 2)

var FDCHANGERS = []
FDCHANGERS.push(new FDchanger(LINKS[0], 70, 80))

var SPAWNERS = []
SPAWNERS.push(new Spawner(LINKS[0], 0.1, 1))

var REGULATORS = []

var QKPLOTS = []
QKPLOTS.push(new QKplot(40 + 40, 270, 100, 100, LINKS[0], 10, 1, 0))
QKPLOTS.push(new QKplot(230 + 40, 270, 100, 100, LINKS[0], 40, 1, 0))
QKPLOTS.push(new QKplot(420 + 40, 270, 100, 100, LINKS[0], 60, 1, 0))
QKPLOTS.push(new QKplot(610 + 40, 270, 100, 100, LINKS[0], 90, 1, 0))

var TSPLOTS = []
TSPLOTS.push(new TSplot(LINKS[0]))

var CUMPLOTS = []
//CUMPLOTS.push(new Cumplot(LINKS[0], [75, 5, 5], ["bottleneck", "upstream end", "upstream end (shifted)"], ["#ff0000", "#0000ff", "#aaaaff"], [0, 0, 70/VMAX]))
CUMPLOTS.push(new Cumplot(LINKS[0], [5, 5, 75], ["upstream end", "upstream end (shifted)", "bottleneck"], ["#0000ff", "#aaaaff", "#ff0000"], [0, 70 / VMAX, 0]))

let prevTime = 0
export function MAINLOOP(time) {
    let count = 0
    const elapsedTime = time - prevTime;
    if (elapsedTime >= 1000) {
        count = 0;
        prevTime = time;
    }
    count++;
    //use of requestAnimationFrame: adapted from https://zenn.dev/baroqueengine/books/a19140f2d9fc1a/viewer/ebed0a

    if (T % DELTAT == 0) {
        updates() //T／DELTATの余りが0のとき,関数updateを実行
    }

    if (T % DELTAT_DRAW == 0) {
        draws() //T／DELTAT_DRAWの余りが0のとき,関数drawsを実行
    }

    if (T % DELTAT_EDIE == 0) {
        edies() //T／DELTAT_EDIEの余りが0のとき,関数ediesを実行
    }

    T++ //Tをカウントアップ
    requestAnimationFrame(MAINLOOP); //アニメーションを実行
}

function updates() {
    for (let link of LINKS) { //配列LINKSの値のある間
        link.update() //linkにupdate (model.js) を実行
    }

    for (let fdc of FDCHANGERS) { //配列FDCHANGERSの値のある間
        if (document.getElementById("bn_none") != null) { //ボトルネックの影響力-無が選択されているとき
            fdc.delta = document.getElementsByName("bn_impact").item(0).checked * 1 + document.getElementsByName("bn_impact").item(1).checked * 2 + document.getElementsByName("bn_impact").item(2).checked * 4
        }
        fdc.update() //fdcにupdate (model.js) を実行
    }

    for (let veh of VEHS) { //配列VEHSの値のある間
        veh.speed_change() //vehにspeed_change (model.js) を実行
    }
    for (let veh of VEHS) { //配列VEHSの値のある間
        veh.update() //vehにupdate (model.js) を実行
    }
    for (let s of SPAWNERS) { //配列SPAWNERSの値のある間
        s.flow = Number(document.getElementById("inflow").value) / 100
        document.getElementById("inflow_value").innerHTML = s.flow.toFixed(2)
        s.update() //sにupdate (model.js) を実行
    }
    for (let r of REGULATORS) { //配列REGURATORSの値のある間
        r.num = Number(document.getElementById("num").value)
        document.getElementById("num_value").innerHTML = r.num.toFixed(0)
        r.update() //rにupdate (model.js) を実行
    }

    if (document.getElementsByName("model").item(1).checked == 0) { //交通流モデル-Nagel-Schreckenbergモデルにチェックが入っていないとき (Newellモデル（Kinematic Wave理論）にチェックが入っているとき)
        ACC = 999 //ACCの値を９９９として定義
        DECEL_PROB = 0 //DECEL_PROBの値を0として定義
        for (let veh of VEHS) { //配列VEHSの値のある間
            veh.acc = ACC //???にACCを代入
            veh.decel_prob = DECEL_PROB //???にDECEL_PROBを代入
        }
    } else {
        ACC = 1
        DECEL_PROB = 0.05
        for (let veh of VEHS) { //配列VEHSの値のある間
            veh.acc = ACC
            veh.decel_prob = DECEL_PROB
        }
    }

    var VEHS_new = [] //配列VEWS_newを定義
    for (let veh of VEHS) { //配列VEHSの値のある間
        if (veh.flag_delete != 1) { //??
            VEHS_new.push(veh)  //VEWS_newにpush (model.js) を実行
        }
    }
    VEHS = VEHS_new //VEWSにVEWS_newを代入

    for (let tsp of TSPLOTS) { //配列TSPLOTSの値のある間
        tsp.update() //tspにupdate (model.js) を実行
    }

    for (let cp of CUMPLOTS) { //配列CUMPLOTSの値のある間
        cp.update() //cpにupdate (model.js) を実行
    }
}

function draws() {
    var CANVAS = document.getElementById("main")
    var CTX = CANVAS.getContext("2d")

    //CTX.fillStyle = "#eeeeee" //シミュレータ画面の背景色(薄い肌色)
    //CTX.fillRect(0, 0, CANVAS.width, CANVAS.height) //シミュレータ画面のサイズ設定

    for (let qkp of QKPLOTS) { //配列QKPLOTSの値のある間
        if (document.getElementById("flow_density").checked == 1) { //追加情報-流率密度図にチェックが入っているとき
            qkp.draw() //qkpにdraw (model.js) を実行
        }
    }

    for (let link of LINKS) { //配列LINKSの値のある間
        link.draw() //linkにdraw (model.js) を実行

        if (document.getElementById("traffic_state").checked == 1) { //追加情報-交通状態にチェックが入っているとき
            link.draw_trafficstate() //linkにdraw_trafficstate (model.js) を実行
        }
    }

    for (let veh of VEHS) { //配列VEHSの値のある間
        veh.draw() //vehにdraw (model.js) を実行
    }

    for (let s of SPAWNERS) { //配列SPAWNERSの値のある間
        s.draw() //sにdraw (model.js) を実行
    }

    if (document.getElementById("ts_diagram_trajects").checked == 1 || document.getElementById("ts_diagram_state").checked == 1) { //追加情報-車両軌跡の時空間図or交通状態の時空間図にチェックが入っているとき
        if (CANVAS.height != 590 && CANVAS.height != 860) { // シミュレーション画面の高さが590and860でない場合
            CANVAS.height = 590 //高さを590に変更(拡大)
        }
        for (let tsp of TSPLOTS) { //配列TSPLOTSの値のある間
            tsp.draw(
                document.getElementById("ts_diagram_trajects").checked,
                document.getElementById("ts_diagram_state").checked,
                document.getElementsByName("ts_diagram_state_which").item(0).checked * 100 + document.getElementsByName("ts_diagram_state_which").item(1).checked * 10 + document.getElementsByName("ts_diagram_state_which").item(2).checked * 1
            )
        }
    }

    if (document.getElementById("cumlative").checked == 1) { //追加情報-累積図にチェックが入っているとき
        if (CANVAS.height != 860) { //シミュレーション画面の高さが860でない場合
            CANVAS.height = 860 //高さを860に変更(拡大)
        }
        for (let cp of CUMPLOTS) { //配列CUMPLOTSの値のある間
            cp.draw() //cpにdraw (model.js) を実行
        }
    }
}

function edies() {
    for (let link of LINKS) { //配列LINKSの値のある間
        link.calc_edie() //linkに対してcalc_edie [model.js] を実行
    }
    for (let qkp of QKPLOTS) { //配列QKPLOTSの値のある間
        if (document.getElementById("flow_density").checked == 1) {
            qkp.add_qk() //qkpに対してadd_qk [model.js] を実行
        }
    }
    for (let tsp of TSPLOTS) { //配列TSPLOTSの値のある間
        tsp.collect_states() //tspに対してcollect_states [model.js] を実行
    }
}