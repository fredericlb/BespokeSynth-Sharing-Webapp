import { Test, TestingModule } from '@nestjs/testing';
import { PatchesResolver } from './patches.resolver';

describe('PatchesResolver', () => {
  let resolver: PatchesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatchesResolver],
    }).compile();

    resolver = module.get<PatchesResolver>(PatchesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
