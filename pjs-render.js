var Node = function(x, y, t) {
    this.x = x;
    this.y = y;
    this.time = t;
}
Node.prototype.setPosition = (x, y) => {
    this.x = x;
    this.y = y;
}
Node.prototype.setTime = (t) => {this. time = t;}
Node.prototype.getPosition = () => ({x:this.x, y:this.y})

var Path = function(p) {
    this.path = p;
}
Path.prototype.rescale = (dimX, dimY, that) => {
    var path = that.path;
    var minX = Infinity;
    var maxX = -Infinity;
    var minY = Infinity;
    var maxY = -Infinity;
    for(let i in path) {
        minX = Math.min(minX, path[i].x)
        maxX = Math.max(maxX, path[i].x)
        minY = Math.min(minY, path[i].y)
        maxY = Math.max(maxY, path[i].y)
    }
    for(let i in path) {
        path[i].x = (path[i].x-minX)/(maxX-minX)*dimX;
        path[i].y = (path[i].y-minY)/(maxY-minY)*dimY;
    }
    return path;
}
Path.prototype.getPathFromCSV = (rCSV, that) => {
    //fill this.path with Node
    //info until column 5
    //points start on column 6, end on column 486
    //comments until 523
    //524 drops start, until 583
    var p = [];
    for(var i = 6; i<486; i+=3) {
        //console.log(rCSV[i] + ", " + rCSV[i+1] + ", " + rCSV[i+2])
        p.push(
            new Node(
                json.parse(rCSV[i]),
                json.parse(rCSV[i+1]),
                json.parse(rCSV[i+2])
            )
        )
    }
    try {that.path =  p;}catch(e){}
    return new Path(p);
}
var drawField = function(processingInstance) {
    with(processingInstance) {
        var fieldDim = {
            x: 54,
            y: 27
        }
        var fieldScale = 10;
        var colors = [color(255, 0, 0), color(0, 255, 0), color(0, 0, 255)];
        var pathThickness = 3;
        var paths = [];
        var pathsLoaded = false;
        size(fieldDim.x*fieldScale, fieldDim.y*fieldScale);
        var mouseIsPressed = false
        mousePressed = function() {
            mouseIsPressed = true
        }
        mouseReleased = function() {
            mouseIsPressed = false
        }
        textAlign(3, 3)
        textSize(20)

        var drawPath = function(path) {
            path = path.path;
            let x = path[0].x;
            let y = path[0].y;
            ellipse(x, y, pathThickness*1.5, pathThickness*1.5)
            for(let i = 1; i<path.length; i++) {
                let nx = path[i].x;
                let ny = path[i].y;
                line(x, y, nx, ny);
                ellipse(nx, ny, pathThickness*1.5, pathThickness*1.5)
                x = nx;
                y = ny;
            }
        }
        draw = function() {
            if(loaded) {
                background(0, 0, 255)
                if(!pathsLoaded) {
                    console.log(`${countCSVs} CSVs loaded`)
                    for(var i in raw_csv) {
                        paths.push(//what am I doing :p
                            (new Path()).getPathFromCSV(raw_csv[i])
                        )
                        paths[i].rescale(width, height, paths[i])
                    }
                    pathsLoaded = true;
                } else {
                    strokeWeight(pathThickness)
                    for(var i in paths) {
                        stroke(colors[i])
                        fill(colors[i])
                        drawPath(paths[i])
                    }
                }
            } else {
                background(255, 0, 0);
                fill(255);
                text("Upload a file first", width/2, height/2)
            }
        }
    }
}
var ProcessingInstance = new Processing(document.getElementById("draw-canvas"), drawField)