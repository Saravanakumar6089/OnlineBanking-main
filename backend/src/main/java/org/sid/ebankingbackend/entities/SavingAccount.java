package org.sid.ebankingbackend.entities;

import lombok.Data;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity
@DiscriminatorValue("SA")
@Data
public class SavingAccount extends BankAccount {
    // No interestRate field anymore
}
