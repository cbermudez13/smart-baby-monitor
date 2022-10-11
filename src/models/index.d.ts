import { ModelInit, MutableModel } from "@aws-amplify/datastore";

type SensorsMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type InfantMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Sensors {
  readonly id: string;
  readonly Oxygen?: number | null;
  readonly Humidity?: number | null;
  readonly BodyTemp?: number | null;
  readonly RoomTemp?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Sensors, SensorsMetaData>);
  static copyOf(source: Sensors, mutator: (draft: MutableModel<Sensors, SensorsMetaData>) => MutableModel<Sensors, SensorsMetaData> | void): Sensors;
}

export declare class Infant {
  readonly id: string;
  readonly Name?: string | null;
  readonly isMonitored?: boolean | null;
  readonly InfantSensors?: Sensors | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly infantInfantSensorsId?: string | null;
  constructor(init: ModelInit<Infant, InfantMetaData>);
  static copyOf(source: Infant, mutator: (draft: MutableModel<Infant, InfantMetaData>) => MutableModel<Infant, InfantMetaData> | void): Infant;
}