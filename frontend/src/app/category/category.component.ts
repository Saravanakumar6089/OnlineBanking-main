import { Component, OnInit } from '@angular/core';
import { AccountsService } from '../services/accounts.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { catchError, forkJoin, Observable, of, switchMap, throwError } from 'rxjs';
import { AccountDetails } from '../model/account.model';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  accountFormGroup!: FormGroup;
  currentPage: number = 0;
  pageSize: number = 5;
  operationFromGroup!: FormGroup;
  errorMessage!: string;
  categoryDebits: { [category: string]: number } | null = null; // Object to hold category-wise debits

  constructor(private fb: FormBuilder, private accountService: AccountsService) { }

  ngOnInit(): void {
    this.accountFormGroup = this.fb.group({
      accountId: this.fb.control('')
    });
    this.operationFromGroup = this.fb.group({
      operationType: this.fb.control(null),
      amount: this.fb.control(0),
      description: this.fb.control(null),
      accountDestination: this.fb.control(null),
      category: this.fb.control(null) // New form control for category
    });
  }

  handleCategorize() {
    let accountId: string = this.accountFormGroup.value.accountId;
    this.fetchAllPages(accountId).subscribe(allAccountDetails => {
      const combinedAccountDetails = this.combineAccountDetails(allAccountDetails);
      this.categoryDebits = this.calculateCategoryDebits(combinedAccountDetails);
    });
  }

  private fetchAllPages(accountId: string): Observable<AccountDetails[]> {
    return this.accountService.getAccount(accountId, this.currentPage, this.pageSize).pipe(
      catchError(err => {
      alert('Invalid accountId');
        this.errorMessage = err.message;
        return throwError(err);
      }),
      switchMap(initialDetails => {
        const totalPages = initialDetails.totalPages;
        const observables: Observable<AccountDetails>[] = [of(initialDetails)];

        for (let page = 1; page < totalPages; page++) {
          observables.push(this.accountService.getAccount(accountId, page, this.pageSize));
        }

        return forkJoin(observables);
      })
    );
  }

  private combineAccountDetails(allAccountDetails: AccountDetails[]): AccountDetails {
    const combinedAccountDetails = allAccountDetails[0];

    for (let i = 1; i < allAccountDetails.length; i++) {
      combinedAccountDetails.accountOperationDTOS.push(...allAccountDetails[i].accountOperationDTOS);
    }

    return combinedAccountDetails;
  }

  private calculateCategoryDebits(accountDetails: AccountDetails): { [category: string]: number } {
    const categories = ['emergency', 'entertainment', 'business', 'others'];
    const debits: { [category: string]: number } = {};

    // Initialize debits for each category to 0
    categories.forEach(category => {
      debits[category] = 0;
    });

    accountDetails.accountOperationDTOS
      .filter(operation => operation.type === 'DEBIT')
      .forEach(operation => {
        let category = operation.category || 'others';
        if (!categories.includes(category)) {
          category = 'others';
        }
        debits[category] += operation.amount;
      });

    return debits;
  }
}
