export * from './entity';
export * from './repository';
export * from './redis';
export * from './logger';
export * from './dto';
export * from './message';
export * from './interfaces';
export * from './utility';
export * from './interceptor';
export * from './db';
export * from './protopath';
export * from './response-handlers';
export * from './health';
/**
 * TODO
 *
 * 1. write rate limit for autosuggest search
 * 2. write auth ✅
 * 3. write rating logic
 *      calculate entity rate score & group score by rate
 * 4. write get rating logic (with cache policy)<with cache>✅
 * 5. write public data correctness logic (with cache policy)
 */
