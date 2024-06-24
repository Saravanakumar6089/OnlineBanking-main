export interface Customer {
  id : number;
  name? : string;
  email? : string;
  pwd : string;
}

export class CustomerImpl implements Customer {
  constructor(
    public id : number,
    public  pwd: string,
    public name?: string,
    public email?: string,
    
  ) {}
}