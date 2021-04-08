import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-num-pad',
  templateUrl: './num-pad.component.html',
  styleUrls: ['./num-pad.component.css']
})
export class NumPadComponent implements OnInit {

  entryPin = '';

  constructor() { }

  @Output() event = new EventEmitter<string>();

  ngOnInit(): void {
  }

  sendPin(): void {
    this.event.emit(this.entryPin);
  }

  public key(value): void {
    this.entryPin += value;
    if (this.entryPin.length === 4) {
      this.sendPin();
    }
  }

  public clear(): void {
    this.entryPin = '';
  }
}
