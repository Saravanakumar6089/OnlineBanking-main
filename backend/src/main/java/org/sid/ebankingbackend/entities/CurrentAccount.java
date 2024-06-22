package org.sid.ebankingbackend.entities;

import lombok.Data;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity
@DiscriminatorValue("CA")
@Data
public class CurrentAccount extends BankAccount {

}
