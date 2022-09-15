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
import {TuiDialogContext, TuiDialogService} from "@taiga-ui/core";
import {PolymorpheusComponent, PolymorpheusContent} from '@tinkoff/ng-polymorpheus';
import {Observer} from "rxjs";
@Component({
  selector: 'crud-angular-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss'],

})
export class PersonComponent implements OnInit {
  title = 'crud';
  page = 0;
  size = 4;
  showDialog = false
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
              @Inject(Injector) private readonly injector: Injector,) {

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



  }
  fetchDataTable(){
    this.configuration.isLoading = true
    this.personService.getPerson(this.page, this.size).subscribe(
      (value) => {
        this.data = value
        this.configuration.isLoading = false
      }
    )
  }
  create() {
    this.router.navigate([''], {
      queryParams: {
        ...this.route.snapshot.queryParams,
        edit: undefined
      }
    })
    this.dialog.subscribe({
      next: data => {
        this.personService.createPerson(data).subscribe();
      },
      complete: () => {
        console.log(`Dialog closed`);
      },
    });

  }

  edit(rowIndex: number) {
    const idPerson = this.data.items[rowIndex].id as number;
    this.router.navigate([''], {
      queryParams: {
        ...this.route.snapshot.queryParams,
        edit: idPerson
      }
    })
    this.dialog.subscribe({
      next: data => {
        this.personService.updatePerson(data).subscribe();
      },
      complete: () => {
        console.log(`Dialog closed`);
      },
    });




  }

  delete(rowIndex: number, content: PolymorpheusContent<TuiDialogContext>) {
    this.dialogService.open(content).subscribe();
    this.idItemDeleted = this.data.items[rowIndex].id as number;
  }


  pageChange($event: number) {
    this.page = $event
    this.configuration.isLoading = true

    // push router
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


  confirmDelete(content: PolymorpheusContent<TuiDialogContext>, observe: Observer<void>) {
    const fetch = () => this.fetchDataTable()
    this.personService.deletePerson(this.idItemDeleted).subscribe({
      complete(){
        observe.complete();
        fetch();
      }
    });
  }
}
