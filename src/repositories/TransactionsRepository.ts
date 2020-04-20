import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionDTO {
  title: string,
  value: number,
  type: "income" | "outcome"
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const income = this.transactions.reduce((accum, curr) => {
      let value = 0;
      if (curr.type === 'income') {
        value = curr.value;
      }
      return accum + value;
    }, 0);

    const outcome = this.transactions.reduce((accum, curr) => {
      let value = 0;
      if (curr.type === 'outcome') {
        value = curr.value;
      }
      return accum + value;
    }, 0);

    const result = {
      income,
      outcome,
      total: income - outcome
    };

    return result;
  }

  public create({title, value, type}: TransactionDTO): Transaction {
    const transation = new Transaction({title, value, type});
    const balance = this.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw Error('Sorry, insufficient funds');
    }

    this.transactions.push(transation);

    return transation;
  }
}

export default TransactionsRepository;
