import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface _SERVICE {
  'get' : ActorMethod<[string], [] | [string]>,
  'principalget' : ActorMethod<[string], [] | [string]>,
  'set' : ActorMethod<[string, string], [] | [string]>,
  'who' : ActorMethod<[], string>,
}
