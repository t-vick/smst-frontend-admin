import { Component } from '@angular/core';

@Component({
	moduleId: module.id,
	selector: 'smst-garage-map',
	templateUrl: './garage-map.component.html',
	styleUrls: [ './garage-map.component.css' ],
})
export class GarageMapComponent {
	private option = {
    x: 0,//鼠标点击位置
    y: 0,
    map: null,
    option: {
      xLoc: 0,//画布左上角坐标
      yLoc: 0,
      pillarList: [
      {
        x: 150,
        y: 150,
        width: 10,
        height: 10
      },
      {
        x: 150,
        y: 200,
        width: 10,
        height: 10
      }
    ],
    cylinderList: [
      {
        x: 50,
        y: 270,
        r: 5
      },
      {
        x: 310,
        y: 270,
        r: 5
      },
      {
        x: 50,
        y: 380,
        r: 5
      },
      {
        x: 310,
        y: 380,
        r: 5
      }
    ],
      pathList: [
      {
        startX: -10,
        endX: 400,
        startY: 250,
        endY: 250,
        width: 20
      },
       {
        startX: -10,
        endX: 400,
        startY: 400,
        endY: 400,
        width: 20
      },
       {
        startX: 30,
        endX: 30,
        startY: -10,
        endY: 800,
        width: 20
      },
       {
        startX: 330,
        endX: 330,
        startY: -10,
        endY: 800,
        width: 20
      }
    ],
    cellList: [
      {
        x: 60,
        y: 275,
        w: 78,
        h: 100,
        num: {
          x: 80,
          y: 300,
          text: '301'
        }
      },
      {
        x: 140,
        y: 275,
        w: 78,
        h: 100,
        num: {
          x: 160,
          y: 300,
          text: '302',
        }
      },
      {
        x: 220,
        y: 275,
        w: 78,
        h: 100,
        num: {
          x: 240,
          y: 300,
          text: '303'
        }
      }
    ]
    }
  };
}