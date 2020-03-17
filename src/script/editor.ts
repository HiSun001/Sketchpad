
canvas:CanvasRenderingContext2D;
window.onload = function() {
    this.canvas = document.getElementById('canvas');
    const ctx = this.canvas.getContext('2d');
    ctx.fillStyle = 'green';
    ctx.fillRect(10, 10, 150, 100);
}
export * from "editor"