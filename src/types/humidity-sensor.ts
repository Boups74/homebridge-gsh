import { Characteristic } from '../hap-types';
import { HapService, AccessoryTypeExecuteResponse } from '../interfaces';
import { Hap } from '../hap';

export class HumiditySensor {
  hap: Hap;

  constructor(hap: Hap) {
    this.hap = hap;
  }

  sync(service: HapService) {
    var unit = this.hap.config.forceFahrenheit 
              ? 'F'
              : (service.characteristics.find(x => x.type === Characteristic.TemperatureDisplayUnits)
                ? (service.characteristics.find(x => x.type === Characteristic.TemperatureDisplayUnits).value 
                    ? 'F' 
                    : 'C')
                : 'C');

    return {
      id: service.uniqueId,
      type: 'action.devices.types.SENSOR',
      traits: [
        'action.devices.traits.TemperatureControl',
        'action.devices.traits.HumiditySetting',
      ],
      attributes: {
        queryOnlyTemperatureControl: true,
        queryOnlyHumiditySetting: true,
        temperatureUnitForUX: unit,
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

    var humidityValue = service.characteristics.find(x => x.type === Characteristic.CurrentRelativeHumidity).value;
    var temperature = service.characteristics.find(x => x.type === Characteristic.CurrentTemperature);

    const response = {
      online: true,
      humidityAmbientPercent: humidityValue,
    } as any;

    if (temperature) {
      response.temperatureAmbientCelsius = temperature.value;
    }
    return response;
  }

  execute(service: HapService, command): AccessoryTypeExecuteResponse {
      // no command
      return { payload: { characteristics: [] } };
  }

}