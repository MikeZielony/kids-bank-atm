import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormTypes} from '../form-types.enum';
import {AccountDataService} from '../services/account-data.service';


@Component({
  selector: 'app-num-pad',
  templateUrl: './num-pad.component.html',
  styleUrls: ['./num-pad.component.css']
})
export class NumPadComponent {

  constructor(public accountDataService: AccountDataService) {

  }

  @Output() event: EventEmitter<string> = new EventEmitter<string>();
  @Output() clear: EventEmitter<void> = new EventEmitter<void>();

  @Input()
  type: FormTypes = FormTypes.password;

  @Input()
  set pinPadValue(value: string | number) {
    if (this.type === FormTypes.text) {
      this._pinPadValue = +value === 0 ? '' : value;
      return;
    }
    this._pinPadValue = value;
  }

  get pinPadValue(): string | number {
    return this._pinPadValue;
  }

  private _pinPadValue;

  public key(value: string): void {
    this.event.emit(value);
  }

  public onClear(): void {
    this.clear.emit();
  }

}
