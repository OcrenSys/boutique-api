import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Product } from '../../api/products/entities/product.entity';
import { ProductData } from '../data/032_product.data';

export default class ProductSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Product)
      .values(ProductData)
      .execute();
  }
}