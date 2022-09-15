import {
  Component,
  Inject,
  Injector,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {Columns, Config, DefaultConfig} from "ngx-easy-table";
import {IPerson, IPersonPagination} from "../../interfaces/person";
import {TableService} from "../../services/table.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CreateEditPersonComponent} from "../../components/create-edit-person/create-edit-person.component";
import {TuiAlertService, TuiDialogContext, TuiDialogService, TuiNotification} from "@taiga-ui/core";
import {PolymorpheusComponent, PolymorpheusContent} from '@tinkoff/ng-polymorpheus';
import {catchError, Observer, of, switchMap, tap} from "rxjs";
@Component({
  selector: 'crud-angular-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss'],

})
export class PersonComponent implements OnInit {
  page = 0;
  size = 4;
  @ViewChild('actionTpl', { static: true }) actionTpl!: TemplateRef<any>;
  public configuration!: Config;
  columns!: Columns[];
  data:IPersonPagination = {
    items: [],
    page: this.page,
    pageSize: this.size,
    totalItems: 0
  };
  idItemDeleted = 0;

  private readonly dialog = this.dialogService.open<IPerson>(
    new PolymorpheusComponent(CreateEditPersonComponent, this.injector)
  );


  constructor(private  personService: TableService
    ,private router: Router, private route: ActivatedRoute,
              @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
              @Inject(Injector) private readonly injector: Injector,@Inject(TuiAlertService) private readonly alert: TuiAlertService) {
  }

  ngOnInit():void {
    this.page = +this.route.snapshot.queryParams['page'] || 0
    this.size = +this.route.snapshot.queryParams['pageSize'] || 4
    this.configuration = { ...DefaultConfig, paginationEnabled: false, rows: 10, isLoading: true };
    this.fetchDataTable();
    this.columns = [
      { key: 'level', title: 'Level' },
      { key: 'age', title: 'Age' },
      { key: 'company', title: 'Company' },
      { key: 'name', title: 'Name' },
      { key: 'isActive', title: 'STATUS' },
      { key: 'action', title: 'Actions', cellTemplate: this.actionTpl },
    ];

    if(this.route.snapshot.queryParams['edit']){
      this.handleEdit();
    }



  }
  fetchDataTable(): void{
    this.configuration.isLoading = true
    this.personService.getPerson(this.page, this.size).subscribe(
      (value) => {
        this.data = value
        this.configuration.isLoading = false
      }
    )
  }
  create(): void{
    this.router.navigate([''], {
      queryParams: {
        ...this.route.snapshot.queryParams,
        edit: undefined
      }
    })
    this.dialog.pipe(
      tap((person) => {if(person){this.configuration.isLoading = true} }),
      switchMap((data) => this.personService.createPerson(data))).subscribe({
      next: () => {
        this.fetchDataTable();
        this.alert
          .open(`Create success`, {
            status: TuiNotification.Success,
          }).subscribe();
      },
    });

  }
  edit(rowIndex: number): void {
    this.router.navigate([''], {
      queryParams: {
        ...this.route.snapshot.queryParams,
        edit: this.data.items[rowIndex].id
      }
    })
    this.handleEdit();

  }
  handleEdit():void{
    this.dialog.pipe(
      tap((person) => {if(person){this.configuration.isLoading = true} }),
      switchMap(
        (data) => this.personService.updatePerson( this.route.snapshot.queryParams['edit'], data),
      )).subscribe({
      next: () => {
        this.fetchDataTable();
        this.alert
          .open(`Update success`, {
            status: TuiNotification.Success,
          }).subscribe();
      },
      complete: () => {
        this.router.navigate([''], {
          queryParams: {
            ...this.route.snapshot.queryParams,
            edit: undefined
          }
        })
      }
    });
  }

  delete(rowIndex: number, content: PolymorpheusContent<TuiDialogContext>): void {
    this.dialogService.open(content, {size: 's'}).subscribe();
    this.idItemDeleted = this.data.items[rowIndex].id as number;
  }

  pageChange($event: number): void {
    this.page = $event
    this.configuration.isLoading = true

    this.router.navigate([''], {
      queryParams: {
        page: this.page,
        pageSize: this.size,
      }
    })
    // call API pagination
    this.personService.getPerson(this.page, this.size).subscribe(
      (value) => {
        this.data = value
        this.configuration.isLoading = false
      }
    )

  }

  confirmDelete(content: PolymorpheusContent<TuiDialogContext>, observe: Observer<void>): void {
    this.personService.deletePerson(this.idItemDeleted).subscribe({
      next: () => {
        observe.complete();
      },
      complete: () =>{
        this.fetchDataTable()
        this.alert
          .open(`Delete success`, {
            status: TuiNotification.Success,
          }).subscribe();
      }
    });
  }
}
