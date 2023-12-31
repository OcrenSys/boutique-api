import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { HandleExceptions } from '../../common/helpers/handle.exceptions';
import { ResponseHttp } from '../../common/helpers/interfaces/response.http';
import { User } from '../../database/models/user.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from '../../database/models/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly handle: HandleExceptions,
    private readonly dataSource: DataSource,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<ResponseHttp> {
    const { users = [], ...toCreateRole } = createRoleDto;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const role: Role = await this.roleRepository.create({
      ...toCreateRole,
      users: users.length
        ? users.map((_user: User) => this.userRepository.create(_user))
        : [],
    });

    if (!role) {
      this.handle.throw(
        { code: HttpStatus.BAD_REQUEST },
        'Lo sentimos, no se ha podido crear la nueva marca.',
      );
    }

    try {
      await this.roleRepository.save(role);

      await queryRunner.commitTransaction();

      return this.handle.success({
        data: role,
        status: HttpStatus.CREATED,
        message: 'Role creado exitosamente!',
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handle.throw(error, 'Algo salió mal al crear el nuevo role.');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<ResponseHttp> {
    const filters = {};
    const relations = ['products'];
    try {
      const roles: Role[] = await this.roleRepository.find({
        where: filters,
        relations,
      });

      return this.handle.success({
        data: roles,
        message: 'Roles de usuario encontrados exitosamente.',
        status: HttpStatus.OK,
      });
    } catch (error) {
      this.handle.throw(
        error,
        'Algo salió mal al encontrar los roles de usuario.',
      );
    }
  }

  async findOne(id: number): Promise<ResponseHttp> {
    const filters = { id };
    const relations = [];

    const role: Role = await this.roleRepository.findOne({
      relations,
      where: filters,
    });

    if (!role)
      this.handle.throw(
        { code: HttpStatus.NOT_FOUND },
        `Role de usuario con id: "${id}" no pudo ser encontrado.`,
      );

    return this.handle.success({
      status: HttpStatus.OK,
      data: role,
      message: 'Role de usuario encontrado exitosamente!',
    });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<any> {
    const { users = [], ...toUpdateRole } = updateRoleDto;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const role: Role = await this.roleRepository.preload({
      id,
      ...toUpdateRole,
      users: users.length
        ? users.map((_user: User) => this.userRepository.create(_user))
        : [],
    });

    if (!role) {
      this.handle.throw(
        { code: HttpStatus.BAD_REQUEST },
        'Lo sentimos, no se ha podido actualizar el role de usuario.',
      );
    }

    try {
      this.roleRepository.save(role);

      await queryRunner.commitTransaction();

      return this.handle.success({
        data: role,
        status: HttpStatus.OK,
        message: `Datos del role de usuario han actualizados exitosamente.`,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handle.throw(
        error,
        'Algo salió mal al actualizar el role de usuario.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number): Promise<any> {
    const role: Role = await this.roleRepository.findOne({
      where: { id },
    });

    if (!role) {
      this.handle.throw(
        { code: HttpStatus.NOT_FOUND },
        `Role de usuario no pudo ser encontrado`,
      );
    }

    try {
      const result = await this.roleRepository.delete(id);

      return this.handle.success({
        data: result,
        status: HttpStatus.OK,
        message: `Role de usuario ha sido eliminado exitosamente.`,
      });
    } catch (error) {
      this.handle.throw(
        error,
        'Algo salió mal al eliminar el role de usuario.',
      );
    }
  }
}
