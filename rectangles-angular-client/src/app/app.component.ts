import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  x1: number = 10;
  y1: number = 10;
  x2: number = 15;
  y2: number = 15;

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

  segment = {
    start: { x: 20, y: 20 },
    end: { x: 250, y: 1500 },
  };

  minX!: number;
  maxX!: number;
  minY!: number;
  maxY!: number;

  selectedRectangleId: number | null = null;

  selectRectangle(id: number) {
    this.selectedRectangleId = this.selectedRectangleId === id ? null : id;
  }

  getSelectedRectangle() {
    return this.rectangles.find(
      (rect) => rect.rectangleid === this.selectedRectangleId
    );
  }

  ngOnInit() {
    this.calculateBounds();
  }

  calculateScale() {
    let allXs = this.rectangles
      .flatMap((rect) => [rect.pax, rect.pbx, rect.pcx, rect.pdx])
      .concat([this.segment.start.x, this.segment.end.x]);
    let allYs = this.rectangles
      .flatMap((rect) => [rect.pay, rect.pby, rect.pcy, rect.pdy])
      .concat([this.segment.start.y, this.segment.end.y]);

    this.minX = Math.min(...allXs);
    this.maxX = Math.max(...allXs);
    this.minY = Math.min(...allYs);
    this.maxY = Math.max(...allYs);

    let rangeX = this.maxX - this.minX;
    let rangeY = this.maxY - this.minY;

    let maxRange = Math.max(rangeX, rangeY);

    this.maxX = this.minX + maxRange;
    this.maxY = this.minY + maxRange;
  }

  calculateBounds() {
    let allXs = this.rectangles
      .flatMap((rect) => [rect.pax, rect.pbx, rect.pcx, rect.pdx])
      .concat([this.segment.start.x, this.segment.end.x]);
    let allYs = this.rectangles
      .flatMap((rect) => [rect.pay, rect.pby, rect.pcy, rect.pdy])
      .concat([this.segment.start.y, this.segment.end.y]);

    this.minX = Math.min(...allXs);
    this.maxX = Math.max(...allXs);
    this.minY = Math.min(...allYs);
    this.maxY = Math.max(...allYs);

    let rangeX = this.maxX - this.minX;
    let rangeY = this.maxY - this.minY;
    let maxRange = Math.max(rangeX, rangeY);

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
    const payload = {
      start: { x: this.x1, y: this.y1 },
      end: { x: this.x2, y: this.y2 },
    };
    this.segment = payload;
    this.http
      .post<any>(
        'https://web-39tdjwsgnot6.up-de-fra1-k8s-1.apps.run-on-seenode.com/intersections',
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
