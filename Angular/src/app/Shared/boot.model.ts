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
