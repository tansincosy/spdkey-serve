import { Global, Module } from '@nestjs/common';
import { Log4JService } from './log4j.service';

@Global()
@Module({
  providers: [Log4JService],
  exports: [Log4JService],
})
export class CommonModule {}
