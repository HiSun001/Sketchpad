let colItemDom = function() {
    let colArr = ['#d81e06', '#f4ea2a','#1afa29','#1296db', '#13227a','#e6e6e6',
    '#dbdbdb','#cdcdcd','#bfbfbf','#8a8a8a','#515151','#2c2c2c']
    let len = colArr.length;
    let _html = "";
    for(let i=0;i<len;i++) {
        let item = colArr[i];
        _html += `<span class="col" id='${item}' style="background:${item}"></span>`;
    }
    document.getElementById('colors').innerHTML=_html;
}

colItemDom();
 
export * from "./colorDom"