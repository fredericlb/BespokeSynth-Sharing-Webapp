import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Patch, PatchStatus } from './patch.model';
import { v4 as uuidv4 } from 'uuid';
import { StringMappingType } from '@ts-morph/common/lib/typescript';

@Injectable()
export class PatchesService {
  constructor(
    @InjectRepository(Patch)
    private repository: Repository<Patch>,
    private connection: Connection,
  ) {}

  public async find(tags: string[], search: string | null): Promise<Patch[]> {
    const builder = this.repository
      .createQueryBuilder('p')
      .where('p_status = :status', { status: PatchStatus.APPROVED });

    if (search && search.length > 0) {
      const s = `%${search.toLowerCase()}%`;
      builder.andWhere(
        'LOWER(p_title) like :s OR LOWER(p_author) like :s OR LOWER(p_summary) like :s',
        { s },
      );
    }

    // FIXME Own table for tags, this is ugly
    if (tags.length > 0) {
      builder.andWhere("',' || tags || ',' like :tags", {
        tags: `%,${tags.sort().join(',')},%`,
      });
    }

    const patches = await builder.printSql().getMany();

    return patches;
  }

  public async get(uuid: string, token: string | null): Promise<Patch> {
    const builder = this.repository.createQueryBuilder('p');

    builder.where('uuid = :uuid AND status = :status', {
      uuid,
      status: PatchStatus.APPROVED,
    });

    if (token != null) {
      builder.orWhere('_token = :token', { token });
    }

    return builder.getOneOrFail();
  }

  public async moderate(
    uuid: string,
    token: string,
    approved: boolean,
  ): Promise<Patch> {
    const patch = await this.get(uuid, token);

    if (patch.status === PatchStatus.APPROVED) {
      throw new Error('Patch already approved');
    }
    if (approved) {
      patch.status = PatchStatus.APPROVED;

      await this.repository.save(patch);
    } else {
      await this.repository.remove(patch);
    }

    return patch;
  }

  public async save(patchToSave: Patch): Promise<Patch> {
    const patch = patchToSave;
    patch.publicationDate = new Date();
    patch.tags = patch.tags.map((t) => t.toLowerCase()).sort();
    patch._token = uuidv4();

    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(patch);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    return patch;
  }
}
