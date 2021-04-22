import Interactive from "https://vectorjs.org/interactive.js";
//  import { Interactive } from '../interactive.js';
//  export default function main(id) {

function main(id) {
    // Initialize the interactive
    let margin = 1;
    let interactive = new Interactive(id);
    let svg = document.getElementById("my-interactive");
    
    interactive.width = svg.offsetWidth;
    interactive.height = svg.offsetHeight;
    console.log(svg.style.width, svg.style.height)
    // interactive.border = true;
    interactive.originX = interactive.width / 2 + margin;
    interactive.originY = interactive.height / 2 + margin;
    interactive.width += 2 * margin;
    interactive.height += 2 * margin;

    console.log(interactive.width, interactive.height)
    
    interactive.style.overflow = 'visible';
    // Create three control points
    let point = interactive.control(0, 0);
    let xAxis = interactive.line(-interactive.width / 2 + margin, 0, interactive.width / 2 - margin, 0);
    let yAxis = interactive.line(0, -interactive.height / 2 + margin, 0, interactive.height / 2 - margin);
    // let rectangle = interactive.rectangle(xAxis.x1, yAxis.y1, xAxis.x2 - xAxis.x1, yAxis.y2 - yAxis.y1);
    // rectangle.style.strokeOpacity = "0"
    // rectangle.classList.add('default');
    // point.constrainWithinBox(xAxis.x1, yAxis.y1, xAxis.x2, yAxis.y2);
    interactive.circle(0, 0, 3).style.fill = '#404040';
    let text = interactive.text(150, 150, "myText");
    text.addDependency(point);
    text.update = function () {
        this.x = point.x + 15;
        this.y = point.y - 15;
        this.contents = `(${(point.x / 50).toFixed(2)}, ${(-point.y / 50).toFixed(2)})`;
    };
    text.update();
    let marker = interactive.marker(10, 5, 10, 10);
    marker.path('M 0 0 L 10 5 L 0 10 z').style.fill = '#404040';
    marker.setAttribute('orient', 'auto-start-reverse');
    xAxis.setAttribute('marker-end', `url(#${marker.id})`);
    xAxis.setAttribute('marker-start', `url(#${marker.id})`);
    yAxis.setAttribute('marker-end', `url(#${marker.id})`);
    yAxis.setAttribute('marker-start', `url(#${marker.id})`);
    let xAxisLabel = interactive.text(xAxis.x2 + 16, xAxis.y2, 'x');
    xAxisLabel.setAttribute('alignment-baseline', 'middle');
    let yAxisLabel = interactive.text(yAxis.x1, yAxis.y1 - 16, 'y');
    yAxisLabel.setAttribute('text-anchor', 'middle');
    let xPosition = interactive.line(0, 0, 0, 0);
    xPosition.style.stroke = 'cornflowerblue'; //#585a9d
    xPosition.addDependency(point);
    xPosition.update = function () {
        this.x1 = point.x;
        this.x2 = point.x;
        this.y2 = point.y;

        document.getElementById("x").value = point.x;
        document.getElementById("y").value = point.y;
    };
    let yPosition = interactive.line(0, 0, 0, 0);
    yPosition.style.stroke = 'cornflowerblue';
    yPosition.addDependency(point);
    yPosition.update = function () {
        this.y1 = point.y;
        this.x2 = point.x;
        this.y2 = point.y;

        document.getElementById("x").value = point.x;
        document.getElementById("y").value = point.y;
    };
    // let w = 50;
    // let h = 50;
    // for (let i = -6; i < 6; i++) {
    //     for (let j = -3; j < 3; j++) {
    //         let x = i * w;
    //         let y = j * h;
    //         // let rect = interactive.rectangle(x, y, w, h);
    //         // rect.style.strokeOpacity = '.0';
    //         // rect.classList.add('default');
    //         // rect.root.setAttribute('vector-effect', 'non-scaling-stroke');
    //         // interactive.background.prependChild(rect);
    //     }
    // }
    point.translate(150, -100);
}

main("my-interactive")
 