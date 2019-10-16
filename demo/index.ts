import { MetadataHandler } from '../src/index';

interface IMetadata {
  name: string;
}
const metadata = new MetadataHandler<IMetadata>(() => ({
  name: '',
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

new Foo().bar();
