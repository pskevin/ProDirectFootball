export class Query {
  //Declaring variables
  offset: number;
  brands: string[];
  collections: string[];
  priceband: number;
  qbrands: any;
  qcollections: any;
  qpriceband: any;
  sbrands: string;
  scollections: string;
  spriceband: string;
  query: any;
  
  constructor (
    offset: number,
    brands: string[],
    collections: string[],
    priceband: number
  ) {
    this.offset = offset;
    this.brands = brands;
    this.collections = collections;
    this.priceband = priceband;
  }
  
  makeQuery() {
    if(this.brands.length > 0) {
      this.sbrands = '{ "$in" : ' + JSON.stringify (this.brands) + '}';
    } else {
      this.sbrands = 'null';
    }
    if(this.collections.length > 0) {
      this.scollections = '{ "$in" : ' + JSON.stringify (this.collections) + '}';
    } else {
      this.scollections = 'null';
    }
    switch( this.priceband ){
      case 0 :
        this.spriceband = 'null';
        break;
      case 1 :
        this.spriceband = '{ "$gt": ' + 0 + ' , "$lt": ' + 100 + '}';
        break;
      case 2 :
        this.spriceband = '{ "$gt": ' + 100 + ' , "$lt": ' + 200 + '}';
        break;
      case 3 :
        this.spriceband = '{ "$gt": ' + 200 + ' , "$lt": ' + 300 + '}';
    }
    this.qbrands = JSON.parse(this.sbrands);
    this.qcollections = JSON.parse(this.scollections);
    this.qpriceband = JSON.parse (this.spriceband);
    
    this.query = {
      offset: this.offset,
      query: {
        brand: this.qbrands,
        coll: this.qcollections,
        saleprice: this.qpriceband
      }
    };
    console.log(this.query);
    return this.query;
  }
}
