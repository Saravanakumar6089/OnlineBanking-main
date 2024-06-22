import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AccountsService } from '../services/accounts.service';
import { CustomerService } from '../services/customer.service';
import { catchError, Observable, throwError } from 'rxjs';
import { AccountDetails } from '../model/account.model';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  accountFormGroup!: FormGroup;
  currentPage: number = 0;
  pageSize: number = 5;
  accountObservable!: Observable<AccountDetails>;
  operationFromGroup!: FormGroup;
  errorMessage!: string;
  accountFound: boolean = false;

  constructor(private fb: FormBuilder, private accountService: AccountsService, private customerService: CustomerService) { }

  ngOnInit(): void {
    this.accountFormGroup = this.fb.group({
      accountId: this.fb.control('')
    });
    this.operationFromGroup = this.fb.group({
      operationType: this.fb.control(null),
      amount: this.fb.control(0),
      description: this.fb.control(null),
      accountDestination: this.fb.control(null),
      category: this.fb.control({value: null, disabled: true}) // Initially disabled
    });

    // Listen to changes in operationType to enable/disable category
    this.operationFromGroup.get('operationType')?.valueChanges.subscribe(operationType => {
      if (operationType === 'CREDIT') {
        this.operationFromGroup.get('category')?.disable();
      } else {
        this.operationFromGroup.get('category')?.enable();
      }
    });
  }

  handleSearchAccount() {
    let accountId: string = this.accountFormGroup.value.accountId;
    this.accountObservable = this.accountService.getAccount(accountId, this.currentPage, this.pageSize).pipe(
      catchError(err => {
        this.errorMessage = err.message;
        this.accountFound = false;
        return throwError(err);
      })
    );
    this.accountObservable.subscribe({
      next: (accountDetails) => {
        this.accountFound = true;
        this.errorMessage = '';
      },
      error: (err) => {
        this.accountFound = false;
        alert('Invalid accountId');
      }
    });
  }

  gotoPage(page: number) {
    this.currentPage = page;
    this.handleSearchAccount();
  }

  handleAccountOperation() {
    let accountId: string = this.accountFormGroup.value.accountId;
    let operationType = this.operationFromGroup.value.operationType;
    let amount: number = this.operationFromGroup.value.amount;
    let description: string = this.operationFromGroup.value.description;
    let accountDestination: string = this.operationFromGroup.value.accountDestination;
    let category: string = this.operationFromGroup.value.category;

    if (operationType == 'DEBIT') {
      this.accountService.debit(accountId, amount, description, category).subscribe({
        next: (data) => {
          alert('Success Debit');
          this.operationFromGroup.reset();
          this.handleSearchAccount();
        },
        error: (err) => {
          alert('Insufficient balance');
          console.log(err);
        }
      });
    } else if (operationType == 'CREDIT') {
      this.accountService.credit(accountId, amount, description).subscribe({
        next: (data) => {
          alert('Success Credit!!!');
          this.operationFromGroup.reset();
          this.handleSearchAccount();
        },
        error: (err) => {
          console.log(err);
        }
      });
    } else if (operationType == 'TRANSFER') {
      this.accountService.transfer(accountId, accountDestination, amount, description, category).subscribe({
        next: (data) => {
          alert('Success Transfer');
          this.operationFromGroup.reset();
          this.handleSearchAccount();
        },
        error: (err) => {
          alert('Insufficient balance or invalid destination Id');
          console.log(err);
        }
      });
    }
  }
}
