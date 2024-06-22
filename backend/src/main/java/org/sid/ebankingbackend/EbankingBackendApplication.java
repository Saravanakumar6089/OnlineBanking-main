package org.sid.ebankingbackend;

import org.sid.ebankingbackend.dtos.BankAccountDTO;
import org.sid.ebankingbackend.dtos.CurrentBankAccountDTO;
import org.sid.ebankingbackend.dtos.CustomerDTO;
import org.sid.ebankingbackend.dtos.SavingBankAccountDTO;
import org.sid.ebankingbackend.entities.*;
import org.sid.ebankingbackend.enums.AccountStatus;
import org.sid.ebankingbackend.enums.OperationType;
import org.sid.ebankingbackend.exceptions.BalanceNotSufficientException;
import org.sid.ebankingbackend.exceptions.BankAccountNotFoundException;
import org.sid.ebankingbackend.exceptions.CustomerNotFoundException;
import org.sid.ebankingbackend.repositories.AccountOperationRepository;
import org.sid.ebankingbackend.repositories.BankAccountRepository;
import org.sid.ebankingbackend.repositories.CustomerRepository;
import org.sid.ebankingbackend.services.BankAccountService;
import org.sid.ebankingbackend.services.BankService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Stream;

@SpringBootApplication
public class EbankingBackendApplication {

    @Autowired
    private BankAccountService bankAccountService;

    public static void main(String[] args) {
        SpringApplication.run(EbankingBackendApplication.class, args);
    }


}
