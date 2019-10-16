import 'reflect-metadata';

export class MetadataHandler<MetadataStructure> {
  constructor(
    private initialMetadataFactory: () => MetadataStructure,
    private METADATA_KEY = Symbol('metadata'),
  ) {}

  get(target: object): MetadataStructure;
  get<K extends keyof MetadataStructure>(target: object, key: K): MetadataStructure[K];
  get<K extends keyof MetadataStructure>(target: object, key?: K): MetadataStructure | MetadataStructure[K]  {
    // Pull the existing metadata or create an the default metadata object
    const meta = (
      Reflect.getMetadata(this.METADATA_KEY, target) 
      || this.initialMetadataFactory()
    );
    if (key) {
      return meta[key];
    }
    return meta;
  }

  set<K extends keyof MetadataStructure>(target: object, key: K, value: MetadataStructure[K]): void {
    this.update(target, (meta) => {
      meta[key] = value;
      return meta;
    });
  }

  update(target: object, cb: (metadata: MetadataStructure) => MetadataStructure): void {
      // Pull the existing metadata
      let allMetadata: MetadataStructure = this.get(target);
    
      allMetadata = cb(allMetadata);
    
      // Update the metadata
      Reflect.defineMetadata(
        this.METADATA_KEY,
        allMetadata,
        target,
      );
  }
}
