import { addListener } from "cluster";

let canvas:CanvasRenderingContext2D;
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

window.onload = function() {
    this.canvas = document.getElementById('canvas');
    if(!(this.canvas && this.canvas.getContext('2d') )) {
        console.error("不支持Canvas")
        return ;
    }
    rect = this.canvas.getBoundingClientRect();
    ctx = this.canvas.getContext('2d');
    initData();
    addCustomListener()
}

let addCustomListener = function() {
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