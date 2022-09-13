import {ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Columns, Config, DefaultConfig} from "ngx-easy-table";
import {IPersonPagination} from "../../interfaces/person";
import {TableService} from "../../services/table.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DialogComponent} from "../../components/dialog/dialog.component";

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
  @ViewChild('dialog') dialogComp!: DialogComponent;
  public configuration!: Config;
  columns!: Columns[];
  paginationNgx = false;
  data:IPersonPagination = {
    items: [],
    page: this.page,
    pageSize: this.size,
    totalItems: 0
  };

  constructor(private  personService: TableService
    ,private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit():void {
    this.page = +this.route.snapshot.queryParams['page'] || 0
    this.size = +this.route.snapshot.queryParams['pageSize'] || 4
    this.personService.getPerson(this.page, this.size).subscribe(
      (value) => {
        this.data = value
        this.configuration.isLoading = false
      }
    )
    this.configuration = { ...DefaultConfig, paginationEnabled: false, rows: 10, isLoading: true };
    this.columns = [
      { key: 'level', title: 'Level' },
      { key: 'age', title: 'Age' },
      { key: 'company', title: 'Company' },
      { key: 'name', title: 'Name' },
      { key: 'isActive', title: 'STATUS' },
      { key: 'action', title: 'Actions', cellTemplate: this.actionTpl },
    ];


  }

  edit(rowIndex: number) {
    console.log(rowIndex)
    this.dialogComp.showDialog();

  }

  delete(rowIndex: any) {}


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
}
