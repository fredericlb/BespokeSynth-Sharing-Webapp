import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patch } from './patches/patch.model';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
