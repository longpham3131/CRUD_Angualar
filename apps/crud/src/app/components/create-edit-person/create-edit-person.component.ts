import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, ValidationErrors, Validators} from "@angular/forms";
import {TuiAlertService, TuiDialogContext, TuiDialogService, TuiNotification} from '@taiga-ui/core';
import {POLYMORPHEUS_CONTEXT} from '@tinkoff/ng-polymorpheus';
import {ActivatedRoute} from "@angular/router";
import {TableService} from "../../services/table.service";
import {TUI_VALIDATION_ERRORS} from "@taiga-ui/kit";
import { AbstractControl, ValidatorFn } from '@angular/forms';

export function NoWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let controlVal = control.value;
    if (typeof controlVal === 'number') {
      controlVal = `${controlVal}`;
    }
    const isWhitespace = (controlVal || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: 'value is only whitespace' };
  };
}
export function maxLengthValidator(context: {requiredLength: string}): string {
  return `Maximum length — ${context.requiredLength}`;
}

export function minLengthValidator(context: {requiredLength: string}): string {
  return `Minimum length — ${context.requiredLength}`;
}

@Component({
  selector: 'crud-angular-create-edit-person',
  templateUrl: './create-edit-person.component.html',
  styleUrls: ['./create-edit-person.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: {
        whitespace: `Enter this!`,
        pattern: 'Value invalid',
        min: `Value invalid`,
        maxlength: maxLengthValidator,
        minlength: minLengthValidator
      },
    },
  ],
})
export class CreateEditPersonComponent implements OnInit, OnDestroy{

  nameBtnSubmit = 'Create'
  nameDialog = 'Create Person'
  levelItems = ['Low','Medium' ,'High']
  loader = false;
  personForm = this.fb.group({
    name: ['', NoWhitespaceValidator()],
    imgUrl: ['https://i.imgur.com/GLqxxnn.png'],
    phone: ['', Validators.compose([ NoWhitespaceValidator(), Validators.minLength(12)])],
    age: [0, Validators.compose([NoWhitespaceValidator(), Validators.min(1), Validators.pattern( /[0-9]/)])],
    company: ['', Validators.compose([NoWhitespaceValidator(), Validators.minLength(3)])],
    isActive: [false],
    level: ['Low']
  })
  constructor(private cdr: ChangeDetectorRef, private fb: FormBuilder, private route: ActivatedRoute,
              @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<any, any>,
              @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
              private personSer: TableService,
              @Inject(TuiAlertService) private readonly alert: TuiAlertService) {}


  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if(params['edit']){
        this.nameDialog = 'Edit Person'
        this.nameBtnSubmit = 'Update'
        this.loader = true;
        this.personSer.getPersonDetail(params['edit']).subscribe({
          next: (person) => {
            const {name, age, company, phone, level, isActive, imgUrl} = person;
            this.personForm.setValue({name, age, company, phone, level, isActive, imgUrl  })
            this.loader = false;
          },
          error: (error) => {
            this.alert
              .open(`Can not find this person`, {
                status: TuiNotification.Error,
              })
              .subscribe();
              this.context.$implicit.complete();
          }
        })
      }
    })
  }

  ngOnDestroy() {
    this.nameBtnSubmit = 'Create'
    this.nameDialog = 'Create Person'
  }

  onSubmit() {
    if(this.personForm.valid){
      this.context.completeWith(this.personForm.value)
    }
  }
}
