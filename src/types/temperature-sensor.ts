import { Characteristic } from '../hap-types';
import { HapService, AccessoryTypeExecuteResponse } from '../interfaces';
import { Hap } from '../hap';

export class TemperatureSensor {
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
      // https://developers.google.com/assistant/smarthome/guides/sensor
      type: 'action.devices.types.SENSOR',
      // type: 'action.devices.types.THERMOSTAT',
      traits: [
        //'action.devices.traits.TemperatureSetting',
        'action.devices.traits.TemperatureControl',
        'action.devices.traits.HumiditySetting',
      ],
      attributes: {
        // availableThermostatModes: ['off'],
        // thermostatTemperatureUnit: unit,
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

    var tempValue = service.characteristics.find(x => x.type === Characteristic.CurrentTemperature).value;
    var humidity = service.characteristics.find(x => x.type === Characteristic.CurrentRelativeHumidity);

    const response = {
      online: true,
      // thermostatTemperatureAmbient: tempValue,
      // thermostatTemperatureSetpoint: tempValue,
      // thermostatMode: 'off',
      temperatureAmbientCelsius: tempValue,
    } as any;

    // check if device reports CurrentRelativeHumidity
    if (humidity) {
      response.humidityAmbientPercent = humidity.value;
      // response.thermostatHumidityAmbient = humidity.value;
    }

    return response;
  }

  execute(service: HapService, command): AccessoryTypeExecuteResponse {
      // no command
      return { payload: { characteristics: [] } };
  }

}