import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { AccountService } from '@app/_services';
import { MatPaginator } from '@angular/material/paginator'; // paginointia varten importtaus
import { MatSort } from '@angular/material/sort'; // sort toimintoa varten importtaus
@Component({ templateUrl: 'list.component.html' })

export class ListComponent implements OnInit  {
    displayedColumns: string[] = ['name','email','role','edit']; // list.component.html sivuston näytettävät kentät

    accounts: any[];
    dataSource = new MatTableDataSource<any>(); // taulukkoa, paginointtia ja sorttia varten dataSource sisällön määrittely
    @ViewChild(MatPaginator) paginator: MatPaginator;   // paginointi näkyvyys
    @ViewChild(MatSort) sort: MatSort;  // sort näkyvyys

    constructor(private accountService: AccountService) {}

    ngOnInit() {
        this.accountService.getAll() 
            .pipe(first())
            .subscribe(accounts => {
                this.dataSource.data = accounts; // tilataan observableilta dataa
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            });
    }
    deleteAccount(id: string) {
        const account =  this.dataSource.data.find(x => x.id === id);
        account.isDeleting = true;
        this.accountService.delete(id)
            .pipe(first())
            .subscribe(() => {
                this.dataSource.data =  this.dataSource.data.filter(x => x.id !== id) 
            });
    }   
}
