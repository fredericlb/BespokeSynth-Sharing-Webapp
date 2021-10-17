import { Test, TestingModule } from '@nestjs/testing';
import { ActionTokenService } from './action-token.service';

describe('ActionTokenService', () => {
  let service: ActionTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActionTokenService],
    }).compile();

    service = module.get<ActionTokenService>(ActionTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
