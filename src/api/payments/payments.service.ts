import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, DeleteResult } from 'typeorm';
import { HandleExceptions } from '../../common/helpers/handle.exceptions';
import { ResponseHttp } from '../../common/helpers/interfaces/response.http';
import { Credit } from '../../database/models/credit.entity';
import { PaymentDate } from '../../database/models/payment-date.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from '../../database/models/payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Credit)
    private readonly creditRepository: Repository<Credit>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(PaymentDate)
    private readonly paymentDateRepository: Repository<PaymentDate>,
    private readonly handle: HandleExceptions,
    private readonly dataSource: DataSource,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<ResponseHttp> {
    const {
      credit = null,
      paymentDate = null,
      ...toCreateorder
    } = createPaymentDto;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const payment: Payment = this.paymentRepository.create({
        ...toCreateorder,
        credit: credit ? this.creditRepository.create(credit) : null,
        paymentDate: paymentDate
          ? this.paymentDateRepository.create(paymentDate)
          : null,
      });

      this.paymentRepository.save(payment);

      await queryRunner.commitTransaction();

      return this.handle.success({
        data: payment,
        status: HttpStatus.OK,
        message: 'Fecha de pago creada exitosamente.',
      });
    } catch (error) {
      this.handle.throw(error);
    } finally {
      queryRunner.release();
    }
  }

  async findAll(): Promise<ResponseHttp> {
    const filters = {};
    const relations = ['credit', 'paymentDate'];

    try {
      const payments: Payment[] = await this.paymentRepository.find({
        where: filters,
        relations,
      });

      return this.handle.success({
        data: payments,
        status: HttpStatus.OK,
        message: 'Facturas encontradas con exito.',
      });
    } catch (error) {
      this.handle.throw(error);
    }
  }

  async findOne(id: number): Promise<ResponseHttp> {
    const filters = { id };
    const relations = ['credit', 'paymentDate'];

    const payment: Payment = await this.paymentRepository.findOne({
      relations,
      where: filters,
    });

    if (!payment)
      this.handle.throw(
        { code: HttpStatus.NOT_FOUND },
        `El pago con id: "${id}" no pudo ser encontrado.`,
      );

    return this.handle.success({
      status: HttpStatus.OK,
      data: payment,
      message: 'Datos del pago encontrado exitosamente!',
    });
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto): Promise<any> {
    const {
      credit = null,
      paymentDate = null,
      ...toUpdateorder
    } = updatePaymentDto;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const payment: Payment = await this.paymentRepository.preload({
        id,
        ...toUpdateorder,
        credit: credit ? this.creditRepository.create(credit) : null,
        paymentDate: paymentDate
          ? this.paymentDateRepository.create(paymentDate)
          : null,
      });

      const result = await this.paymentRepository.save(payment);

      await queryRunner.commitTransaction();

      return this.handle.success({
        data: result,
        status: HttpStatus.OK,
        message: `Los datos del pago han sido actualizados exitosamente.`,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handle.throw(
        error,
        'Algo salió mal al actualizar los datos del pago.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number): Promise<any> {
    const payment: Payment = await this.paymentRepository.findOne({
      where: { id },
    });

    if (!payment) {
      this.handle.throw(
        { code: HttpStatus.NOT_FOUND },
        `Los datos del pago no pudieron ser encontrados.`,
      );
    }

    try {
      const result: DeleteResult = await this.paymentRepository.delete(id);

      return this.handle.success({
        data: result,
        status: HttpStatus.OK,
        message: `El pago ha sido eliminada exitosamente,`,
      });
    } catch (error) {
      this.handle.throw(
        error,
        'Algo salió mal al eliminar los datos del pago.',
      );
    }
  }
}
