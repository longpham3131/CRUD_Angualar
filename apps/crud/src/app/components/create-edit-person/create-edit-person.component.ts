import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {TuiDialogContext, TuiDialogService} from '@taiga-ui/core';
import {POLYMORPHEUS_CONTEXT} from '@tinkoff/ng-polymorpheus';
import {ActivatedRoute} from "@angular/router";
import {TableService} from "../../services/table.service";

@Component({
  selector: 'crud-angular-create-edit-person',
  templateUrl: './create-edit-person.component.html',
  styleUrls: ['./create-edit-person.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateEditPersonComponent implements OnInit, OnDestroy{

  nameBtnSubmit = 'Create'
  nameDialog = 'Create Person'
  levelItems = ['Low','Medium' ,'High']
  loader = false;
  personForm = this.fb.group({
    name: ['', Validators.required],
    imgUrl: ['https://i.imgur.com/GLqxxnn.png'],
    phone: ['',  Validators.required],
    age: [0,  Validators.required],
    company: ['',  Validators.required],
    isActive: [false],
    level: ['Low',  Validators.required]
  })
  constructor(private cdr: ChangeDetectorRef, private fb: FormBuilder, private route: ActivatedRoute,
              @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<any, any>,
              @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
              private personSer: TableService) {}


  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if(params['edit']){
        this.nameDialog = 'Edit Person'
        this.nameBtnSubmit = 'Update'
        this.loader = true;
        this.personSer.getPersonDetail(params['edit']).subscribe((person) => {
          const {name, age, company, phone, level, isActive, imgUrl} = person;
          this.personForm.setValue({name, age, company, phone, level, isActive, imgUrl  })
          this.loader = false;
        })
      }
    })
  }

  ngOnDestroy() {
    // console.log(this.context)
    this.nameBtnSubmit = 'Create'
    this.nameDialog = 'Create Person'
  }

  onSubmit() {
    this.context.completeWith(this.personForm.value)

  }
}
