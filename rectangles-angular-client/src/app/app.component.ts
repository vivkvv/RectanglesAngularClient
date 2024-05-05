import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  x1: number = 0;
  y1: number = 0;
  x2: number = 0;
  y2: number = 0;

  width = 400;
  height = 400;

  rectangles = [
    {
      rectangleid: 1,
      pax: 50,
      pay: 50,
      pbx: 150,
      pby: 50,
      pcx: 150,
      pcy: 100,
      pdx: 50,
      pdy: 100,
    },
    {
      rectangleid: 2,
      pax: 200,
      pay: 80,
      pbx: 300,
      pby: 80,
      pcx: 300,
      pcy: 180,
      pdx: 200,
      pdy: 180,
    },
  ];
  segment = { x1: 20, y1: 20, x2: 250, y2: 1500 };

  minX!: number;
  maxX!: number;
  minY!: number;
  maxY!: number;

  selectedRectangleId: number | null = null;

  selectRectangle(id: number) {
    this.selectedRectangleId = this.selectedRectangleId === id ? null : id;
    // this.rectangles = this.rectangles
    //   .filter((rect) => rect.rectangleid !== id)
    //   .concat(this.rectangles.filter((rect) => rect.rectangleid === id));
  }

  ngOnInit() {
    this.calculateBounds();
  }

  calculateScale() {
    let allXs = this.rectangles
      .flatMap((rect) => [rect.pax, rect.pbx, rect.pcx, rect.pdx])
      .concat([this.segment.x1, this.segment.x2]);
    let allYs = this.rectangles
      .flatMap((rect) => [rect.pay, rect.pby, rect.pcy, rect.pdy])
      .concat([this.segment.y1, this.segment.y2]);

    this.minX = Math.min(...allXs);
    this.maxX = Math.max(...allXs);
    this.minY = Math.min(...allYs);
    this.maxY = Math.max(...allYs);

    let rangeX = this.maxX - this.minX;
    let rangeY = this.maxY - this.minY;

    // Выбор наибольшего диапазона для масштабирования
    let maxRange = Math.max(rangeX, rangeY);

    // Обновление максимальных X и Y для обеспечения одинакового масштаба
    this.maxX = this.minX + maxRange;
    this.maxY = this.minY + maxRange;
  }

  calculateBounds() {
    let allXs = this.rectangles
      .flatMap((rect) => [rect.pax, rect.pbx, rect.pcx, rect.pdx])
      .concat([this.segment.x1, this.segment.x2]);
    let allYs = this.rectangles
      .flatMap((rect) => [rect.pay, rect.pby, rect.pcy, rect.pdy])
      .concat([this.segment.y1, this.segment.y2]);

    this.minX = Math.min(...allXs);
    this.maxX = Math.max(...allXs);
    this.minY = Math.min(...allYs);
    this.maxY = Math.max(...allYs);

    // Выбор наибольшего диапазона для масштабирования
    let rangeX = this.maxX - this.minX;
    let rangeY = this.maxY - this.minY;
    let maxRange = Math.max(rangeX, rangeY);

    // Обновление максимальных X и Y для обеспечения одинакового масштаба
    this.maxX = this.minX + maxRange;
    this.maxY = this.minY + maxRange;
  }

  scaleX(x: number): number {
    return ((x - this.minX) / (this.maxX - this.minX)) * this.width;
  }

  scaleY(y: number): number {
    return ((this.maxY - y) / (this.maxY - this.minY)) * this.height;
  }

  scaledPoints(rect: any): string {
    return `${this.scaleX(rect.pax)},${this.scaleY(rect.pay)} ${this.scaleX(
      rect.pbx
    )},${this.scaleY(rect.pby)} ${this.scaleX(rect.pcx)},${this.scaleY(
      rect.pcy
    )} ${this.scaleX(rect.pdx)},${this.scaleY(rect.pdy)}`;
  }

  constructor(private http: HttpClient) {}

  checkIntersections() {
    const payload = { x1: this.x1, y1: this.y1, x2: this.x2, y2: this.y2 };
    this.segment = payload;
    this.http
      .post<any>(
        'https://web-39tdjwsgnot6.up-de-fra1-k8s-1.apps.run-on-seenode.com/intersections/',
        payload
      )
      .subscribe({
        next: (data) => {
          this.rectangles = data;
          console.log(this.rectangles);
          this.calculateBounds();
        },
        error: (error) => {
          console.error('There was an error:', error);
        },
      });
  }
}
