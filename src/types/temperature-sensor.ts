import { Characteristic } from '../hap-types';
import { HapService, AccessoryTypeExecuteResponse } from '../interfaces';
import { Hap } from '../hap';

export class TemperatureSensor {
  hap: Hap;

  constructor(hap: Hap) {
    this.hap = hap;
  }

  sync(service: HapService) {

    return {
      id: service.uniqueId,
      // https://developers.google.com/assistant/smarthome/guides/sensor
      type: 'action.devices.types.SENSOR',
      traits: [
        'action.devices.traits.TemperatureControl',
        'action.devices.traits.HumiditySetting',
      ],
      attributes: {
        queryOnlyTemperatureControl: true,
        queryOnlyHumiditySetting: true,
        temperatureUnitForUX: this.hap.config.forceFahrenheit ? 'F'
          : service.characteristics.find(x => x.type === Characteristic.TemperatureDisplayUnits).value ? 'F' : 'C',
      },
      name: {
        defaultNames: [
          service.serviceName,
          service.accessoryInformation.Name,
        ],
        name: service.serviceName,
        nicknames: [],
      },
      willReportState: true,
      deviceInfo: {
        manufacturer: service.accessoryInformation.Manufacturer,
        model: service.accessoryInformation.Model,
      },
      customData: {
        aid: service.aid,
        iid: service.iid,
        instanceUsername: service.instance.username,
        instanceIpAddress: service.instance.ipAddress,
        instancePort: service.instance.port,
      },
    };
  }

  query(service: HapService) {

    const response = {
      online: true,
      temperatureAmbientCelsius: service.characteristics.find(x => x.type === Characteristic.CurrentTemperature).value,
    } as any;

    // check if device reports CurrentRelativeHumidity
    if (service.characteristics.find(x => x.type === Characteristic.CurrentRelativeHumidity)) {
      response.humidityAmbientPercent = service.characteristics.find(x => x.type === Characteristic.CurrentRelativeHumidity).value;
    }

    return response;
  }

  execute(service: HapService, command): AccessoryTypeExecuteResponse {
      // no command
      return { payload: { characteristics: [] } };
  }

}