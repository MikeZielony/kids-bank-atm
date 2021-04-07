import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AccountDataService} from '../account-data.service';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.css']
})
export class KeyboardComponent implements OnInit {


  @Output()
  public subEntryPin: EventEmitter<string> = new EventEmitter<string>();
  EntryPin = '';


  constructor(public service: AccountDataService) { }

  ngOnInit(): void {
  }

}
