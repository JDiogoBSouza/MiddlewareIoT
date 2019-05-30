# MiddlewareIoT
Um middleware simples desenvolvido com o node-red.

Formato de Requisição API-Web

POST:

Enviar um ou mais dados para o middleware:

Url: localhost:1880/postData
Body: 

{
	"post" : 
	[
		{
			"deviceToken"  : "deviceToken", 
			"sensor" : "sensorName",
			"timestamp" : "YYYY-MM-DDTHH:MM:SS.000Z",
			"valor" : valor
		}
	]
}

Para enviar mais de um dado, basta adiciona-lo ao array de dados.

GET:

Retornar todos os dados de um dispositivo:
Url: http://localhost:1880/getDeviceData/{deviceToken}

Formato de Resposta:

{
    "_id": "mongoDB id",
    "deviceToken": "deviceToken",
    "sensor1": [],
    "sensor2": []
}

Retornar todos os dados de um sensor em um dispositivo:
Url: http://localhost:1880/getDeviceData/{deviceToken}/{sensor}
Body: Empty

Formato de Resposta:

{
    "sensor": [
        {
			"timestamp" : "YYYY-MM-DDTHH:MM:SS.000Z",
			"valor" : valor
        }
    ]
}

Retornar N ultimos dados de um sensor em um dispositivo:
Url: http://localhost:1880/{getDeviceData}/{deviceToken}/{sensor}/{quantidade}
Body: Empty

Formato de Resposta:

{
    "sensor": [
        {
			"timestamp" : "YYYY-MM-DDTHH:MM:SS.000Z",
			"valor" : valor
        }
    ]
}

Retornar informações do dispositivo:
Url: http://localhost:1880/{getDeviceInfo}/{deviceToken}
Body: Empty

Formato de Resposta:

{
    "_id": "mongoDB id",
    "deviceId": "deviceId",
    "sensores": [
        "sensor1",
        "sensor2"
    ],
    "deviceToken": "deviceToken"
}

DELETE:

Deletar todos os dados de um dispositivo:
Url: http://localhost:1880/deleteDeviceData/{deviceToken}
Body: Empty

Deletar N primeiros dados de determinado sensor em um dispositivo:
Url: http://localhost:1880/deleteDeviceData/start/{deviceToken}/{sensor}/{quantity}
Body: Empty

Deletar N ultimos dados de determinado sensor  um dispositivo:
Url: http://localhost:1880/deleteDeviceData/end/{deviceToken}/{sensor}/{quantity}
Body: Empty

Deletar dados em um intervalo de tempo de determinado sensor um dispositivo, neste caso o {start} e o {end} deverão ter o formato
"YYYY-DD-MM HH:MM:SS.000Z":
Url: http://localhost:1880/deleteDeviceData/{deviceToken}/{sensor}/{start}/{end}
Body: Empty


PUT:

Atualizar dado de um sensor em um dispositivo.
Url:
http://localhost:1880/updateDeviceData/{deviceToken}/{sensor}

Body:

{
	"old" :
	{
		"timestamp" : "YYYY-MM-DDTHH:MM:SS.000Z",
		"valor" : valor
	},
	"new" :
	{
		"timestamp" : "YYYY-MM-DDTHH:MM:SS.000Z",
		"valor" : valor
	}
}
