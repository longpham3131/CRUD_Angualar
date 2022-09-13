import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import {TableService} from "./services/table.service";
import {IPerson, IPersonPagination} from "./interfaces/person";
import {ActivatedRoute, Router} from "@angular/router";
@Component({
  selector: 'crud-angular-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements  OnInit{
  title = 'crud';
  page = 0;
  size = 10;
  @ViewChild('actionTpl', { static: true }) actionTpl!: TemplateRef<any>;
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
    ,private router: Router) {


  }

  ngOnInit():void {
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
    // console.log(this.route.snapshot.queryParams)
  }

  edit(rowIndex: number) {
    console.log(rowIndex)
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
