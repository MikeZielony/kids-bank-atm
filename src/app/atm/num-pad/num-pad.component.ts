import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormTypes} from '../form-types.enum';

@Component({
  selector: 'app-num-pad',
  templateUrl: './num-pad.component.html',
  styleUrls: ['./num-pad.component.css']
})
export class NumPadComponent implements OnInit {

  entryPin = '';

  constructor() { }

  @Output() event = new EventEmitter<string>();

  @Input()
  type: FormTypes = FormTypes.password;

  ngOnInit(): void {
  }

  sendPin(): void {
    this.event.emit(this.entryPin);
  }

  public key(value): void {
    this.entryPin += value;
    if (this.entryPin.length === 4 && this.type === FormTypes.password) {
      this.sendPin();
    }
  }

  public clear(): void {
    this.entryPin = '';
  }
}
