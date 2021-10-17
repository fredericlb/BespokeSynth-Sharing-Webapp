import { Test, TestingModule } from '@nestjs/testing';
import { ActionTokenResolver } from './action-token.resolver';

describe('ActionTokenResolver', () => {
  let resolver: ActionTokenResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActionTokenResolver],
    }).compile();

    resolver = module.get<ActionTokenResolver>(ActionTokenResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
