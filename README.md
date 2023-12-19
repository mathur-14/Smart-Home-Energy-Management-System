base URL: http://localhost:3000/api

Only 3 types for response status codes are returned for all API requests: 200 (success), 400 (Bad request), 500 (Server error)

## Customer

<details>

### POST - /v1/customer

Request Body:

```json
{
    "c_id": "js5678",
    "first_name": "John",
    "last_name": "Snow",
    "phn": "0987-654-321",
    "billing_address": "456 West St",
    "email": "js5678@nyu.edu",
    "pwd_hash": "a8b9e38ca6947817904eab40547eaaecd7cfabb9166f9c32f48a5a67e5ace3d6"
}
```

Response:

```json
{
    "message": "User created successfully",
    "user": {
        "c_id": "js5678",
        "first_name": "John",
        "last_name": "Snow",
        "phn": "0987-654-321",
        "billing_address": "456 West St"
    }
}
```

### GET - /v1/customers

Request Body:

```json
None
```

Response:

```json
[
    {
        "c_id": "tl2334",
        "first_name": "Tyrion",
        "last_name": "Lannister",
        "phn": "123-456-7890",
        "billing_address": "123 Main St"
    },
    {
        "c_id": "js5678",
        "first_name": "John",
        "last_name": "Snow",
        "phn": "0987-654-321",
        "billing_address": "456 West St"
    }
]
```

### GET - /v1/customer/:c_id

Request Body:

```json
None
```

Response:

```json
{
    "c_id": "js5678",
    "first_name": "John",
    "last_name": "Snow",
    "phn": "0987-654-321",
    "billing_address": "456 West St"
}
```

### PUT - /v1/customer/:c_id

Request Body:

```json
{
    "column": "first_name",
    "newValue": "Lol"
}
```

Response:

```json
{ message: 'User updated successfully' }
```

### DELETE - /v1/customer/:c_id

Request Body: 

```json
None
```

Response:

```json
{ "message": "User with ID tl2334 deleted successfully" }
```

### PUT - /v1/customer/:c_id/pwd-reset

Request Body: 

```json
{
    "pwd": "a8b9e38ca6947817904eab40547eaaecd7cfabb9166f9c32f48a5a67e5ace3d6",
    "confirm_pwd": "a8b9e38ca6947817904eab40547eaaecd7cfabb9166f9c32f48a5a67e5ace3d6"
}
```

Response:

```json
{ message: 'User credentials updated successfully' }
```

</details>

## Service Locations

<details>

### POST - /v1/customer/:c_id/service-location

Request Body:

```json
{
    "loc_address": "Apt 2 404 st",
    "area_by_foot": 900,
    "beds": 3,
    "occupants": 3,
    "zipcode": "12314"
}
```

Response:

```json
{
    "message": "Location registered successfully",
    "location": {
        "cid": "js5678",
        "loc_id": "hv3J28081",
        "loc_address": "Apt 2 404 st",
        "zipcode": "12314"
    }
}
```

### GET - /v1/customer/:c_id/service-locations

Request Body:

```json
{
    "loc_address": "Apt 2 404 st",
    "area_by_foot": 900,
    "beds": 3,
    "occupants": 3,
    "zipcode": "12314"
}
```

Response:

```json
[
    {
        "loc_id": "78wXrDAWb",
        "cid": "js5678",
        "loc_address": "Apt 1 404 st",
        "start_date": "2023-12-07T05:00:00.000Z",
        "area_by_foot": 800,
        "beds": 3,
        "occupants": 3,
        "zipcode": "12312"
    },
    {
        "loc_id": "-Qf9HoOQD",
        "cid": "js5678",
        "loc_address": "Apt 2 404 st",
        "start_date": "2023-12-12T05:00:00.000Z",
        "area_by_foot": 900,
        "beds": 3,
        "occupants": 3,
        "zipcode": "12314"
    },
    {
        "loc_id": "hv3J28081",
        "cid": "js5678",
        "loc_address": "Apt 2 404 st",
        "start_date": "2023-12-13T05:00:00.000Z",
        "area_by_foot": 900,
        "beds": 3,
        "occupants": 3,
        "zipcode": "12314"
    }
]
```

### PUT - /v1/customer/:c_id/service-location/:loc_id

Request Body:

```json
{
    "column": "zipcode",
    "newValue": "12312"
}
```

Response:

```json
{ "message": "Location updated successfully" }
```

### DELETE - /v1/customer/:c_id/service-location/:loc_id

Request Body:

```json
None
```

Response:

```json
{ "message": "Location with ID hv3J28081 deleted successfully" }
```

</details>

## Device Models

<details>

### POST - /dev/device-model

Request Body:

```json
{
    "m_name": "godrej xxl",
    "props": "extra spacious",
    "d_type": "Refrigirator"
}
```

Response:

```json
{
    "message": "Model created successfully",
    "device-model": {
        "m_num": "yIpxkaf-q",
        "m_name": "godrej xxl",
        "d_type": "Refrigirator",
        "m_props": "extra spacious"
    }
}
```

PS: show the m_num generated in the UI

### GET - /v1/device-models (get all device models)

Request Body:

```json
None
```

Response:

```json
[
    {
        "m_name": "siska 456",
        "d_type": "Bulb",
        "m_num": "cfsJ0plsx",
        "m_props": "energy efficient"
    },
    {
        "m_name": "godrej xl",
        "d_type": "Refrigirator",
        "m_num": "D0lKujS4q",
        "m_props": "spacious"
    },
    {
        "m_name": "godrej xxl",
        "d_type": "Refrigirator",
        "m_num": "yIpxkaf-q",
        "m_props": "extra spacious"
    }
]
```

### GET - /v1/device-models/device-types (get all device types)

Request Body:

```json
None
```

Response:

```json
[
    {
        "d_type": "Refrigirator"
    },
    {
        "d_type": "Bulb"
    }
]
```

### GET - /v1/device-models/:device_type (get all device models for a particular device type)

Request Body:

```json
None
```

Response:

```json
[
    {
        "m_name": "godrej xl",
        "d_type": "Refrigirator",
        "m_num": "D0lKujS4q",
        "m_props": "spacious"
    },
    {
        "m_name": "godrej xxl",
        "d_type": "Refrigirator",
        "m_num": "yIpxkaf-q",
        "m_props": "extra spacious"
    }
]
```

### PUT - /dev/device-model/:m_num (update device model)

Request Body:

```json
{
    "column": "d_type",
    "newValue": "Tube Light"
}
```

Response:

```json
{ "message": "Model updated successfully"}
```

### DELETE - /dev/device-model/:m_num (update device model)

Request Body:

```json
None
```

Response:

```json
{ message: "Model with ID m_num deleted successfully"}
```

</details>

## Enrolled Devices

<details>

### POST - /v1/customer/:c_id/service-location/:loc_id/device

Request Body:

```json
{
    "m_num": "yIpxkaf-q"
}
```

Response:

```json
{
    "message": "Device enrolled successfully",
    "device": {
        "d_id": "cW6_WKzmD",
        "loc_id": "-Qf9HoOQD",
        "m_num": "yIpxkaf-q"
    }
}
```

### GET - /v1/customer/:c_id/service-location/:loc_id/devices (get all devices for the location)

Request Body:

```json
None
```

Response:

```json
[
    {
        "d_id": "9cafd4_Aj",
        "loc_id": "78wXrDAWb",
        "m_num": "D0lKujS4q",
        "m_name": "godrej xl",
        "d_type": "Refrigirator",
        "m_props": "spacious"
    },
    {
        "d_id": "t6tIblhB3",
        "loc_id": "78wXrDAWb",
        "m_num": "yIpxkaf-q",
        "m_name": "godrej xxl",
        "d_type": "Refrigirator",
        "m_props": "extra spacious"
    }
]
```

### PUT - /v1/customer/:c_id/service-location/:loc_id/device/:d_id (update a device for the location)

Request Body:

```json
{
    "column": "m_num",
    "newValue": "yIpxkaf-q"
}
```

Response:

```json
{ message: 'Device updated successfully' }
```

</details>

## Energy Prices

<details>

### POST - /v1/zipcode/:zipcode/price (prices are added for each zipcode every hour)

Request Body:

```json
{
    "timestamp": "2023-12-12 03:00:00",
    "price": 0.10
}
```

Response:

```json
{ "message": "Energy Price added successfully" }
```

### GET - /v1/zipcode/:zipcode/prices/:xHours (prices are added for each zipcode every hour)

Request Body:

```json
None
```

Response:

```json
{
    "prices": [
        {
            "timestamp": "2023-12-12T02:00:00.000Z",
            "cost_per_kwh": 0.23
        },
        {
            "timestamp": "2023-12-12T03:00:00.000Z",
            "cost_per_kwh": 0.27
        },
        {
            "timestamp": "2023-12-12T04:00:00.000Z",
            "cost_per_kwh": 0.27
        },
        {
            "timestamp": "2023-12-12T05:00:00.000Z",
            "cost_per_kwh": 0.21
        },
        {
            "timestamp": "2023-12-12T06:00:00.000Z",
            "cost_per_kwh": 0.31
        }
    ]
}
```

</details>

## Events

<details>

### POST - /v1/customer/:c_id/service-location/:loc_id/device/:d_id/event (to be added every 5 min for energy use)

Request Body:

```json
{
    "e_label": "energy use",
    "val": 10, 
    "eventDate": "2023-12-12 01:30:00"
}
```

Response:

```json
{
    "message": "Event notified successfully",
    "event": {
        "e_id": 8,
        "d_id": "cW6_WKzmD",
        "e_label": "energy use",
        "timestamp": "2023-12-12T06:30:00.000Z",
        "val": 10
    }
}
```

### POST - /v1/customer/:c_id/service-location/:loc_id/events/energy-used (get the total energy consumed and price with all devices for a location)

Request Body:

```json
{
    "startTime": "2023-12-12 01:05:00",
    "endTime": "2023-12-12 02:11:00"
}
```

Response:

```json
{
    "loc_id": "78wXrDAWb",
    "totalEnergyUsage": 46,
    "totalEnergyCost": 3.6000000000000005,
    "devices": [
        {
            "deviceid": "aSJb-7i4-",
            "m_num": "yIpxkaf-q",
            "m_name": "godrej xxl",
            "totalenergycost": 1.4000000000000001,
            "totalenergyusage": 28
        },
        {
            "deviceid": "t6tIblhB3",
            "m_num": "yIpxkaf-q",
            "m_name": "godrej xxl",
            "totalenergycost": 2.2,
            "totalenergyusage": 18
        }
    ]
}
```

### POST - /v1/customer/:c_id/location-events/energy-used (get the total energy consumed and price for all locations for a customer)

Request Body:

```json
{
    "startTime": "2023-12-12 01:05:00",
    "endTime": "2023-12-12 02:11:00"
}
```

Response:

```json
{
    "c_id": "js5678",
    "totalEnergyUsage": 70,
    "totalEnergyCost": 4.800000000000001,
    "locations": [
        {
            "locationid": "-Qf9HoOQD",
            "totalenergycost": 1.2000000000000002,
            "totalenergyusage": 24
        },
        {
            "locationid": "78wXrDAWb",
            "totalenergycost": 3.6000000000000005,
            "totalenergyusage": 46
        }
    ]
}
```

### POST - /v1/customer/:c_id/device-events/energy-used (get the total energy consumed and price for all devices for a customer)

~ NOTE: Devices with more than 0 energy consumed is returned. If you need to display all devices, compare with getAllDevice for a customer, the devices  missing from the list can have value 0. ~

Request Body:

```json
{
    "startTime": "2023-12-12 01:05:00",
    "endTime": "2023-12-12 02:11:00"
}
```

Response:

```json
{
    "c_id": "js5678",
    "totalEnergyUsage": 70,
    "devices": [
        {
            "d_id": "aSJb-7i4-",
            "m_num": "yIpxkaf-q",
            "m_name": "godrej xxl",
            "d_type": "Refrigirator",
            "totalenergyusage": 28,
            "averageenergyusage": 14
        },
        {
            "d_id": "cW6_WKzmD",
            "m_num": "yIpxkaf-q",
            "m_name": "godrej xxl",
            "d_type": "Refrigirator",
            "totalenergyusage": 24,
            "averageenergyusage": 12
        },
        {
            "d_id": "t6tIblhB3",
            "m_num": "yIpxkaf-q",
            "m_name": "godrej xxl",
            "d_type": "Refrigirator",
            "totalenergyusage": 18,
            "averageenergyusage": 6
        }
    ]
}
```

### POST - /v1/device-events/energy-used/avg (get the avg energy consumed per 5 min)

Request Body:

```json
{
    "startTime": "2023-12-12 01:05:00",
    "endTime": "2023-12-12 02:11:00"
}
```

Response:

```json
{
    "deviceTypes": [
        {
            "devicetype": "Refrigirator",
            "avgmonthlyenergyconsumption": 10
        },
        {
            "devicetype": "Tube Light",
            "avgmonthlyenergyconsumption": 7.5
        }
    ]
}
```

</details>