import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'crud-angular-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  // @Input() show!: boolean;
  exampleForm = new FormGroup({
    exampleControl: new FormControl(``),
  });
  open = false;
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  showDialog(){
    this.open = true;
    this.cdr.detectChanges();
  }
}
