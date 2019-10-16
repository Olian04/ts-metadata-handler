# ts-metadata-handler

ts-metadata-handler provides a typesafe way of working with [reflect-metadata](https://www.npmjs.com/package/reflect-metadata).

```ts
import { MetadataHandler } from 'ts-metadata-handler';

interface IMetadata {
  name: string;
}
const metadata = new MetadataHandler<IMetadata>(() => ({
  name: 'N/A',
}));

const name = (target: object, propertyKey: string) => {
  Object.defineProperty(target, propertyKey, {
    get: () => metadata.get(target, 'name'),
    set: (value: string) => metadata.set(target, 'name', value),
    enumerable: true,
    configurable: true
  });
}
const log = (target: object, propertyKey: string, propertyDescriptor: PropertyDescriptor): PropertyDescriptor => {
  const func = propertyDescriptor.value.bind(target);
  propertyDescriptor.value = (...args) => {
    console.log(metadata.get(target).name);
    func(...args);
  }
  return propertyDescriptor;
};

class Foo {
  @name public name = 'foo';

  @log
  public bar() {
    console.log('bar');
  }
}
```

```ts
// tsconfig.json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "target": "ES5", // minimum
    "lib": [
      "es2015", // for symbol support
    ],
  }
}
```

**Install:** `npm i ts-metadata-handler`

## Type "Documentation"

```ts
class MetadataHandler<MetadataStructure> {
  constructor(
    private initialMetadataFactory: () => MetadataStructure,
    private METADATA_KEY = Symbol('metadata'),
  ) {}

  get(target: object): MetadataStructure;
  get<K extends keyof MetadataStructure>(target: object, key: K): MetadataStructure[K];

  set<K extends keyof MetadataStructure>(target: object, key: K, value: MetadataStructure[K]): void;

  update(target: object, cb: (metadata: MetadataStructure) => MetadataStructure): void;
}
```
