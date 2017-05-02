export class Boot {
  //Declaring variables
  id: string;
  brand: string;
  name: string;
  collection: string;
  img: string;
  price: string;
  status: string;

  constructor (
    id: string,
    brand: string,
    name: string,
    collection: string,
    img: string,
    price: string,
    status: string
  ) {
    this.id = id;
    this.brand = brand;
    this.name = name;
    this.collection = collection;
    this.img = img;
    this.price = price;
    this.status = status;
  }
}

export class BootOrder {
  bname: string;
  quantity: number;

  constructor(
    bname: string,
    quantity: number
  ) {
    this.bname = bname;
    this.quantity = quantity;
  }
}

export class Order {
  no: number;
  boots: Boot[] = [];
  quantity: number[] = [];
  constructor(
    no : number,
    boots: Boot[],
    quantity: number[]
  ) {
    this.no = no;
    this.boots = boots;
    this.quantity = quantity;
  }
}
