
let canvas:any;
let ctx:any;
let rect:any;
let isAllowDrawBool:boolean = false;
let points:any[] = [];
const INFO = {
    MOUSE_X:0,
    MOUSE_Y:0,
    CANVAS_WIDTH:0,
    CANVAS_HEIGTH:0,
    RECT_LEFT:0,
    RECT_TOP:0,
    POINT_X:0,
    POINT_Y:0
}
const IMG_MIME_TYPE = "image/png";
const IMG_DOWNLOAD_NAME = '画板图片下载'

window.onload = function() {
    canvas = document.getElementById('canvas');
    if(!(canvas && canvas.getContext('2d') )) {
        console.error("不支持Canvas")
        return ;
    }
    rect = canvas.getBoundingClientRect();
    ctx = canvas.getContext('2d');
    initData();
    addDrawListener();
    addControlEvent();
}

let addDrawListener = function() {
    document.addEventListener('mousedown', function(event:MouseEvent ){
        draw(event, 'start')
    })
    document.addEventListener('mousemove', function(event:MouseEvent ){
        if(!isAllowDrawBool) return;
        draw(event, 'move');
    })

    document.addEventListener('mouseup', function(event:MouseEvent ){
        draw(event, 'end');
    })
}

let draw = function(event:MouseEvent, state:'start'|'move'|'end') {
    if(!event) {
        return ;
    }
    INFO['MOUSE_X'] = event['clientX'] - INFO['RECT_LEFT'];
    INFO['MOUSE_Y'] = event['clientY'] -  INFO['RECT_TOP'];

    if(state === 'start') {
        isAllowDrawBool = true;
        points = [];
        ctx.beginPath();
        ctx.moveTo(INFO['MOUSE_X'], INFO['MOUSE_Y']);
        ctx.lineTo(INFO['MOUSE_X']+1, INFO['MOUSE_Y']+1);
        ctx.stroke();
        INFO['POINT_X'] = INFO['MOUSE_X'] + 1;
        INFO['POINT_Y'] = INFO['MOUSE_Y'] + 1;
    } else {
        let len = points.length;
        points.unshift({x:INFO['MOUSE_X'], y:INFO['MOUSE_Y']});
        points.length = 2;
        if(len > 1) {
            drawQuadratic()
        }

        if(state === 'end') {
            isAllowDrawBool = false;
            points = [];
        }
    } 
}

let drawQuadratic = function() {
    if(!(Array.isArray(points) && points.length === 2 && points[1])) return;
    ctx.beginPath();
    ctx.moveTo(INFO['POINT_X'], INFO['POINT_Y']);
    ctx.quadraticCurveTo(points[1].x,  points[1].y, (points[1].x + points[0].x)/2, (points[0].y + points[1].y) /2);
    INFO['POINT_X'] = (points[0].x + points[1].x) /2
    INFO['POINT_Y'] = (points[0].y + points[1].y) /2;
    ctx.stroke();
    ctx.closePath();

}

let addControlEvent = function() {
    clearDraw(); // 清除画板
    downLoadImg(); //下载图片
    changeColor(); //选择画笔颜色
}

// 选择颜色
let changeColor = function() {
    let colorsDom = document.getElementById('colors');
    colorsDom.addEventListener('click', function(event:any) {
        let col = event && event.target  && event.target['id'];
        ctx.strokeStyle = col;
    })
}

// 清除画板
let clearDraw = function() {
    let clearDom = document.getElementById('clear');
    clearDom.addEventListener('click', function() {
        ctx.clearRect(0, 0, INFO['CANVAS_WIDTH'], INFO['CANVAS_HEIGTH']);  
    });
} 

// 保存图片
let downLoadImg = function() {
    let downloadDom = document.getElementById('download');
    downloadDom.addEventListener('click', function() {
        const imgURL = canvas.toDataURL(IMG_MIME_TYPE);
        let _dom = document.createElement('a');
        _dom.download = IMG_DOWNLOAD_NAME;
        _dom.href = imgURL;
        _dom.dataset.downloadurl = [IMG_MIME_TYPE, _dom.download, _dom.href].join(':');

        document.body.appendChild(_dom);
        _dom.click();
        document.body.removeChild(_dom);
    })
}


let initData = function() {
    //initCtx
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 1;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    //initInfo
    INFO['CANVAS_WIDTH'] = ctx['canvas']['width'];
    INFO['CANVAS_HEIGTH'] = ctx['canvas']['height'];
    INFO['RECT_LEFT'] =  rect.left * (INFO['CANVAS_WIDTH'] / rect.width);
    INFO['RECT_TOP'] =  rect.top * (INFO['CANVAS_HEIGTH'] / rect.height);
}

export * from "editor"